import { createHttpException, sanitizedString, isValidUrlForApi } from '@/lib/utils';
import { Pokemon, PokemonApiResponse, PokemonResponse, createPokemonSchema } from '@/schemas/pokemon.schema';
import { Type } from '@/schemas/type.schema';
import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { handleError, validateEnvVariables } from '../lib/utils';
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

  /**
   * Creates a new Pokemon in the database.
   *
   * @remarks
   * - Sanitizes input data for consistency and security.
   * - Validates provided type names exist in the database.
   * - Ensures name uniqueness within the collection.
   * - Returns the newly created Pokemon document if successful.
   * - Throws informative errors for various failure scenarios.
   *
   * @param createPokemonDto - The data to create a new Pokemon with.
   * @returns A promise resolving to the http status code of the response.
   */
  async create(createPokemonDto: CreatePokemonDto): Promise<HttpStatus | void> {
    const name = sanitizedString(createPokemonDto.name);
    try {
      const [isInDB, { data }]: [boolean, AxiosResponse<PokemonResponse>] = await Promise.all([
        this.pokemonModel.findOne({ name }) as Promise<boolean>,
        axios.get(`${process.env.BASE_URL}/pokemon?limit=${process.env.TOTAL_POKEMONS}`),
      ]);

      if (isInDB || data.results.some((pokemon) => pokemon.name === name)) {
        throw createHttpException(`Name ${name} already exists`, HttpStatus.CONFLICT);
      }

      createPokemonDto.userCreated = true;
      createPokemonDto.type = await this.typeModel.find({
        name: {
          $in: createPokemonDto.type.map(({ name }) => sanitizedString(name)),
        },
      });

      const validatedData = createPokemonSchema.safeParse(createPokemonDto);
      if (!validatedData.success) {
        throw createHttpException(
          `Failed to validate Pokemon data: ${validatedData.error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const newPokemon = new this.pokemonModel(validatedData.data);
      await newPokemon.save();
      return HttpStatus.CREATED;
    } catch (error) {
      return handleError(error, 'Failed to create Pokemon');
    }
  }

  /**
   * Fetches Pokemon details from the provided API URL.
   *
   * @param {string} url - The URL of the Pokemon data endpoint.
   * @returns {Promise<PokemonEntity>} A promise resolving to a Pokemon entity object.
   * @throws {IncompleteDataError} If the API response lacks required data.
   * @throws {Error} If any other error occurs during retrieval.
   */
  private async getPokemonFromApi(url: string): Promise<PokemonEntity | void> {
    if (!isValidUrlForApi(url)) throw new ForbiddenException('Attempted to access an invalid external URL.');

    try {
      const { data }: AxiosResponse<PokemonApiResponse> = await axios.get(url);
      if (!this.isDataComplete(data)) {
        throw createHttpException('Incomplete pokemon data received from API', HttpStatus.BAD_REQUEST);
      }

      const { id, name, sprites, types, stats, height, weight } = data;
      const { front_default: image } = sprites.other.home;

      // Extract base stats with explicit types
      const baseStats = stats.reduce(
        (acc: { [key: string]: number }, stat: { stat: { name: string }; base_stat: number }) => {
          // Filter out unwanted properties before adding
          if (['attack', 'defense', 'hp', 'speed'].includes(stat.stat.name)) {
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

  /**
   * Retrieves data for a limited number of Pokemon from the specified API endpoint.
   *
   * @returns {Promise<Pokemon[]>} A promise resolving to an array of Pokemon objects.
   * @throws {Error} If required environment variables are missing.
   * @throws {ApiError} If API retrieval fails, potentially due to exceeding the rate limit.
   */
  private async findAllFromApi(): Promise<Pokemon[] | void> {
    try {
      const { data } = await axios.get(`${process.env.BASE_URL}/pokemon?limit=40`);
      return await Promise.all(
        data.results.map(async (pokemon: { url: string }) => await this.getPokemonFromApi(pokemon.url)),
      );
    } catch (error) {
      return handleError(error, 'Failed to retrieve Pokemon from API');
    }
  }

  /**
   * Retrieves all Pokemon from the database and returns them as an array of objects.
   *
   * @remarks
   * - Excludes internal fields (`createdAt`, `updatedAt`, `__v`) for conciseness.
   * - Includes only the `name` property from the `type` object, omitting other type details.
   * - Throws an informative error if retrieval fails.
   *
   * @returns {Promise<Pokemon[]>} A promise resolving to an array of Pokemon objects, or throws an error if retrieval fails.
   */
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

  /**
   * Retrieves a comprehensive list of Pokemon by combining data from the database and API.
   *
   * @returns {Promise<Pokemon[]>} A promise resolving to an array of Pokemon objects.
   * @throws {Error} If retrieval from both database and API fails.
   *
   * @remarks
   * - Attempts to retrieve data from both the database and the API.
   * - If the database retrieval fails, the API retrieval is still attempted.
   * - Both successful results are concatenated into a single array and returned.
   * - Any error encountered during retrieval throws a generic error message.
   */
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

  /**
   * Retrieves a specific Pokemon by its ID, searching both the database and the API.
   *
   * @remarks
   * - Excludes internal fields and unnecessary type details for conciseness.
   * - Throws a `DatabaseRetrievalError` or `ApiRetrievalError` if unable to fetch data from the respective source.
   * - Throws an {Error} if the Pokemon is not found in either source.
   *
   * @param id - The ID of the Pokemon to search for.
   * @returns {Promise<Pokemon>} A promise resolving to the fetched Pokemon object, or throws an error if not found.
   */
  async findById(id: string | number): Promise<Pokemon | PokemonEntity | void> {
    try {
      // Check if the ID is longer than 10 characters meaning it is an internal ID from the database
      if (typeof id === 'string' && id.length > 10) {
        // Exclude internal fields and unnecessary type details
        const pokemonDb = await this.pokemonModel
          .findOne({ id })
          .select('-createdAt -updatedAt -__v -type._id -type.url -type.createdAt -type.updatedAt -type.__v');

        if (!pokemonDb) throw createHttpException(`Pokemon not found in database`, HttpStatus.NOT_FOUND);
        return pokemonDb;
      }

      // Fetch data from the API since the ID is less than 10 characters meaning it's a number
      // Validate id to ensure it's a safe numerical identifier
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

  /**
   * Retrieves a Pokemon by its name, searching both the database and the API.
   *
   * @remarks
   * - Sanitizes the provided name before the search.
   * - Attempts to find the Pokemon in the database first, then in the API if not found.
   * - Throws an {Error} if the Pokemon is not found in either source.
   *
   * @param name - The name of the Pokemon to search for.
   * @returns {Promise<Pokemon>} A promise resolving to an array of the fetched Pokemon object, or throws an error if not found.
   */
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

  /**
   * Updates a Pokemon in the database by its _id property.
   *
   * @remarks
   *  - Sanitizes input data to ensure consistency and security.
   *  - Validates that provided type names exist in the database and name is unique.
   *  - Throws informative errors for various failure scenarios.
   *
   * @param id - The id of the Pokemon to update.
   * @param updatePokemonDto - The data to update the Pokemon with.
   * @returns {Promise<Pokemon>} A promise resolving to the updated Pokemon document, or throws an error if the update fails.
   */
  async update(id: string, updatePokemonDto: UpdatePokemonDto): Promise<Pokemon | void> {
    try {
      const sanitizedDto = {
        name: updatePokemonDto.name?.trim().toLowerCase(),
        image: updatePokemonDto.image?.trim(),
        type: updatePokemonDto.type?.map(({ name }) => name),
      };

      const types = await this.typeModel.find({ name: { $in: sanitizedDto.type } });

      const existingPokemon = await this.pokemonModel.findOne({ id });
      if (!existingPokemon) throw createHttpException(`Pokemon to update not found`, HttpStatus.NOT_FOUND);

      if (sanitizedDto.name !== existingPokemon.name) {
        const pokemonWithName = await this.pokemonModel.findOne({ name: sanitizedDto.name });
        if (pokemonWithName) {
          throw createHttpException(`Name ${sanitizedDto.name} already exists`, HttpStatus.CONFLICT);
        }
      }

      const updatedPokemon = await this.pokemonModel.findOneAndUpdate(
        { id },
        { $set: { types: types.map((t) => t.id), ...sanitizedDto } },
        { new: true },
      );
      return updatedPokemon as Pokemon;
    } catch (error) {
      return handleError(error, 'Failed to update Pokemon');
    }
  }

  /**
   * Permanently removes a Pokemon from the database by its ID.
   *
   * @remarks
   * - Throws an informative error if the Pokemon with the specified ID is not found.
   * - Returns `true` if the removal is successful.
   *
   * @param id - The ID of the Pokemon to remove.
   * @returns {Promise<boolean>} A promise resolving to `true` if the Pokemon was removed, or throws an error if not found.
   */
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
