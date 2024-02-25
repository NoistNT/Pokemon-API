import { sanitizedString } from '@/lib/utils';
import {
  Pokemon,
  PokemonApiResponse,
  createPokemonSchema,
} from '@/schemas/pokemon.schema';
import { Type } from '@/schemas/type.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel('Pokemon') private readonly pokemonModel: Model<Pokemon>,
    @InjectModel('Type') private readonly typeModel: Model<Type>,
  ) {}

  /**
   * Creates a new Pokemon.
   * @param createPokemonDto The data to create a new Pokemon.
   * @returns The newly created Pokemon.
   * @throws {Error} When environmental variables are missing or validation fails.
   */
  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    const { BASE_URL, TOTAL_POKEMONS } = process.env;
    if (!BASE_URL || !TOTAL_POKEMONS) {
      throw new Error('Required environment variables are not defined');
    }

    const name = sanitizedString(createPokemonDto.name);

    try {
      const [isInDB, { data }]: [boolean, AxiosResponse<PokemonApiResponse>] =
        await Promise.all([
          this.pokemonModel.findOne({ name }) as Promise<boolean>,
          axios.get(`${BASE_URL}/pokemon?limit=${TOTAL_POKEMONS}`),
        ]);

      const isInApi = data.results.some((pokemon) => pokemon.name === name);

      if (isInDB || isInApi) {
        throw new Error(`Pokemon with name ${name} already exists`);
      }

      createPokemonDto.type = await this.typeModel.find({
        name: { $in: createPokemonDto.type.map(sanitizedString) },
      });

      const validatedData = createPokemonSchema.safeParse(createPokemonDto);

      if (!validatedData.success) {
        throw new Error(
          `Failed to validate pokemon data: ${validatedData.error.message}`,
        );
      }

      return await new this.pokemonModel(createPokemonDto).save();
    } catch (error) {
      const typedError = error as Error;
      throw new Error(`Failed to fetch data: ${typedError.message}`);
    }
  }

  /**
   * Finds all Pokemon in the database.
   * @returns A promise resolving to an array containing all Pokemon in the database, excluding certain fields (_id, createdAt, updatedAt, __v).
   */
  async findAllFromDb(): Promise<Pokemon[]> {
    try {
      return await this.pokemonModel
        .find()
        .select('-_id -createdAt -updatedAt -__v');
    } catch (error) {
      const typedError = error as Error;
      throw new Error(`Failed to retrieve all pokemon: ${typedError.message}`);
    }
  }

  /**
   * Finds a Pokemon in the database by its ID property.
   * @param id The ID of the Pokemon to find.
   * @returns A promise resolving to the Pokemon object if found, otherwise throws an error.
   */
  async findOneFromDb(id: string): Promise<Pokemon> {
    const pokemon = await this.pokemonModel.findOne({ id });
    if (!pokemon) {
      throw new Error(`Pokemon with id ${id} not found`);
    }
    return pokemon;
  }

  /**
   * Updates a Pokemon in the database by its ID property.
   * @param id The ID of the Pokemon to update.
   * @param updatePokemonDto The data to update the Pokemon with.
   * @returns A promise resolving to void if the Pokemon was successfully updated, otherwise throws an error.
   */
  async update(id: string, updatePokemonDto: UpdatePokemonDto): Promise<void> {
    // Sanitize input by trimming whitespace
    updatePokemonDto.name = updatePokemonDto.name?.trim().toLowerCase();
    updatePokemonDto.image = updatePokemonDto.image?.trim();
    updatePokemonDto.type = updatePokemonDto.type?.map((t) =>
      sanitizedString(t),
    );

    const types = await this.typeModel.find({
      name: { $in: updatePokemonDto.type },
    });

    const pokemon = await this.pokemonModel.findOneAndUpdate(
      { id },
      { $set: { types: { $each: types }, ...updatePokemonDto } },
      { new: true },
    );

    if (!pokemon) {
      throw new Error(`Pokemon with id ${id} not found`);
    }
  }

  /**
   * Removes a Pokemon from the database by its ID property.
   * @param id The ID of the Pokemon to remove.
   * @returns A promise resolving to true if the Pokemon was successfully removed, otherwise throws an error.
   */
  async remove(id: string): Promise<boolean> {
    const removed = await this.pokemonModel.findOneAndDelete({ id });
    if (!removed) {
      throw new Error(`Pokemon with id ${id} not found`);
    }
    return true;
  }
}
