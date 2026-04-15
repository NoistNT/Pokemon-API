import {
  createHttpException,
  sanitizedString,
  isValidUrlForApi,
  handleError,
  validateEnvVariables,
} from '@/lib/utils';
import { POKEMON_API_ID_LENGTH_THRESHOLD, DEFAULT_POKEMON_LIMIT, STATS_FILTER } from '@/lib/constants';
import { Pokemon, PokemonApiResponse, PokemonResponse } from '@/schemas/pokemon.schema';
import { Type } from '@/schemas/type.schema';
import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PokemonEntity } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel('Pokemon') private readonly pokemonModel: Model<Pokemon>,
    @InjectModel('Type') private readonly typeModel: Model<Type>,
  ) {
    validateEnvVariables();
  }

  private isDataComplete(data: PokemonApiResponse): boolean {
    const requiredFields = ['id', 'name', 'sprites', 'stats', 'types', 'height', 'weight'];
    return requiredFields.every((field) => field in data);
  }

  async create(createPokemonDto: CreatePokemonDto): Promise<HttpStatus> {
    const name = sanitizedString(createPokemonDto.name);
    try {
      const [pokemonInDb, { data }]: [Pokemon | null, AxiosResponse<PokemonResponse>] = await Promise.all([
        this.pokemonModel.findOne({ name }),
        axios.get(`${process.env.BASE_URL}/pokemon?limit=${process.env.TOTAL_POKEMONS}`),
      ]);

      if (pokemonInDb || data.results.some((pokemon) => pokemon.name === name)) {
        throw createHttpException(`Name ${name} already exists`, HttpStatus.CONFLICT);
      }

      const types = await this.typeModel.find({
        name: {
          $in: createPokemonDto.type?.map(({ name }: { name: string }) => sanitizedString(name)) ?? [],
        },
      });

      const newPokemon = new this.pokemonModel({
        ...createPokemonDto,
        id: crypto.randomUUID(),
        userCreated: true,
        type: types.map((t) => t._id),
      });
      await newPokemon.save();
      return HttpStatus.CREATED;
    } catch (error) {
      return handleError(error, 'Failed to create Pokemon');
    }
  }

  private async getPokemonFromApi(url: string): Promise<PokemonEntity | void> {
    if (!isValidUrlForApi(url)) throw new ForbiddenException('Attempted to access an invalid external URL.');

    try {
      const { data }: AxiosResponse<PokemonApiResponse> = await axios.get(url);
      if (!this.isDataComplete(data)) {
        throw createHttpException('Incomplete pokemon data received from API', HttpStatus.BAD_REQUEST);
      }

      const { id, name, sprites, types, stats, height, weight } = data;
      const { front_default: image } = sprites.other.home;

      const baseStats = stats.reduce(
        (acc: { [key: string]: number }, stat: { stat: { name: string }; base_stat: number }) => {
          if (STATS_FILTER.includes(stat.stat.name as (typeof STATS_FILTER)[number])) {
            acc[stat.stat.name] = stat.base_stat;
          }
          return acc;
        },
        {} as { [key: string]: number },
      );

      return {
        id: Number(id),
        name,
        image,
        hp: baseStats.hp,
        attack: baseStats.attack,
        defense: baseStats.defense,
        speed: baseStats.speed,
        height,
        weight,
        userCreated: false,
        type: types.map((t: { type: { name: string } }) => ({ name: t.type.name })),
      };
    } catch (error) {
      return handleError(error, 'Failed to retrieve Pokemon from API');
    }
  }

  private async findAllFromApi(): Promise<Pokemon[] | void> {
    try {
      const { data } = await axios.get(`${process.env.BASE_URL}/pokemon?limit=${DEFAULT_POKEMON_LIMIT}`);
      return await Promise.all(
        data.results.map(async (pokemon: { url: string }) => await this.getPokemonFromApi(pokemon.url)),
      );
    } catch (error) {
      return handleError(error, 'Failed to retrieve Pokemon from API');
    }
  }

  private async findAllFromDb(): Promise<Pokemon[] | void> {
    try {
      return await this.pokemonModel
        .find()
        .select(
          '-createdAt -updatedAt -__v -type._id -type.id -type.url -type.createdAt -type.updatedAt -type.__v',
        );
    } catch (error) {
      return handleError(error, 'Failed to retrieve Pokemon from database');
    }
  }

  async findAll(): Promise<Pokemon[] | void> {
    try {
      const pokemonsFromDB = await this.findAllFromDb();
      const pokemonsFromAPI = await this.findAllFromApi();

      if (pokemonsFromDB && pokemonsFromAPI) {
        return await Promise.all([...pokemonsFromAPI, ...pokemonsFromDB]);
      }
    } catch (error) {
      return handleError(error, 'Failed to retrieve Pokemons from both database and API');
    }
  }

  async findById(id: string | number): Promise<Pokemon | PokemonEntity | void> {
    try {
      if (typeof id === 'string' && id.length > POKEMON_API_ID_LENGTH_THRESHOLD) {
        const pokemonDb = await this.pokemonModel
          .findOne({ id })
          .select('-createdAt -updatedAt -__v -type._id -type.url -type.createdAt -type.updatedAt -type.__v');

        if (!pokemonDb) throw createHttpException(`Pokemon not found in database`, HttpStatus.NOT_FOUND);
        return pokemonDb;
      }

      const numericId = Number(id);
      if (isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
        throw createHttpException('Invalid Pokemon ID provided', HttpStatus.BAD_REQUEST);
      }
      const pokemon = await this.getPokemonFromApi(`${process.env.BASE_URL}/pokemon/${numericId}`);
      if (!pokemon) throw createHttpException(`Pokemon not found in API`, HttpStatus.NOT_FOUND);
      return pokemon;
    } catch (error) {
      return handleError(error, 'Pokemon not found in database or API');
    }
  }

  async findByName(name: string): Promise<Pokemon[] | PokemonEntity[] | void> {
    const sanitizedName = sanitizedString(name);
    try {
      const pokemonDB = await this.pokemonModel.findOne({ name: sanitizedName });
      if (pokemonDB) return [pokemonDB];

      const url = `${process.env.BASE_URL}/pokemon/${encodeURIComponent(sanitizedName)}`;
      const pokemonApi = await this.getPokemonFromApi(url);
      if (!pokemonApi) throw createHttpException('Pokemon not found in API', HttpStatus.NOT_FOUND);

      return [pokemonApi];
    } catch (error) {
      return handleError(error, 'Pokemon not found in database or API');
    }
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto): Promise<Pokemon | void> {
    try {
      const sanitizedDto = {
        name: updatePokemonDto.name?.trim().toLowerCase(),
        image: updatePokemonDto.image?.trim(),
      };

      const types = updatePokemonDto.type
        ? await this.typeModel.find({
            name: { $in: updatePokemonDto.type.map(({ name }: { name: string }) => name) },
          })
        : [];

      const existingPokemon = await this.pokemonModel.findOne({ id });
      if (!existingPokemon) throw createHttpException(`Pokemon to update not found`, HttpStatus.NOT_FOUND);

      if (sanitizedDto.name && sanitizedDto.name !== existingPokemon.name) {
        const pokemonWithName = await this.pokemonModel.findOne({ name: sanitizedDto.name });
        if (pokemonWithName) {
          throw createHttpException(`Name ${sanitizedDto.name} already exists`, HttpStatus.CONFLICT);
        }
      }

      const updateData: Record<string, unknown> = { ...sanitizedDto };
      if (types.length > 0) {
        updateData.types = types.map((t) => t.id);
      }

      const updatedPokemon = await this.pokemonModel.findOneAndUpdate(
        { id },
        { $set: updateData },
        { new: true },
      );
      return updatedPokemon as Pokemon;
    } catch (error) {
      return handleError(error, 'Failed to update Pokemon');
    }
  }

  async remove(id: string): Promise<boolean | void> {
    try {
      const removed = await this.pokemonModel.findOneAndDelete({ id });
      if (!removed) throw createHttpException(`Pokemon to remove not found`, HttpStatus.NOT_FOUND);
      return true;
    } catch (error) {
      return handleError(error, 'Failed to remove Pokemon');
    }
  }
}
