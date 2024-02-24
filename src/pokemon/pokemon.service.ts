import { Pokemon } from '@/schemas/pokemon.schema';
import { Type } from '@/schemas/type.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';
import { Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
dotenv.config();

const { BASE_URL } = process.env;

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
   */
  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    try {
      const isInDB = await this.pokemonModel.findOne({
        name: createPokemonDto.name.trim().toLowerCase(),
      });

      const { data }: AxiosResponse<{ results: { name: string }[] }> =
        await axios.get(`${BASE_URL}/pokemon?limit=1281`);

      const isInApi = data.results.find(
        (pokemon) =>
          pokemon.name === createPokemonDto.name.trim().toLowerCase(),
      );

      if (isInDB || isInApi) {
        throw new Error(
          `Pokemon with name ${createPokemonDto.name.trim()} already exists`,
        );
      }

      if (
        !createPokemonDto.name ||
        !createPokemonDto.image ||
        !createPokemonDto.hp ||
        !createPokemonDto.attack ||
        !createPokemonDto.defense ||
        !createPokemonDto.speed ||
        !createPokemonDto.height ||
        !createPokemonDto.weight ||
        !createPokemonDto.type
      ) {
        throw new Error('All fields are required');
      }

      // Sanitize input by trimming whitespace
      createPokemonDto.name = createPokemonDto.name.trim().toLowerCase();
      createPokemonDto.image = createPokemonDto.image.trim();
      createPokemonDto.type = createPokemonDto.type.map((t) =>
        t.trim().toLowerCase(),
      );

      // Find types in the Type schema
      const types = await this.typeModel.find({
        name: { $in: createPokemonDto.type.map((t) => t.trim().toLowerCase()) },
      });

      const newPokemon = await new this.pokemonModel(createPokemonDto).save();

      await newPokemon.updateOne({ $push: { types: { $each: types } } });

      return newPokemon;
    } catch (error) {
      const typedError = error as Error;
      throw new Error(`Failed to create pokemon: ${typedError.message}`);
    }
  }

  /**
   * Finds all Pokemon in the database.
   * @returns A promise resolving to an array containing all Pokemon in the database, excluding certain fields (_id, createdAt, updatedAt, __v).
   */
  async findAllFromDb(): Promise<Pokemon[]> {
    try {
      const pokemons = await this.pokemonModel
        .find()
        .select('-_id -createdAt -updatedAt -__v');

      if (!pokemons.length) {
        return [];
      }

      return pokemons;
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
    try {
      const pokemon = await this.pokemonModel.findOne({ id });

      if (!pokemon) {
        throw new Error(`Pokemon with id ${id} not found`);
      }

      return pokemon;
    } catch (error) {
      const typedError = error as Error;
      throw new Error(`Failed to retrieve pokemon: ${typedError.message}`);
    }
  }

  /**
   * Updates a Pokemon in the database by its ID property.
   * @param id The ID of the Pokemon to update.
   * @param updatePokemonDto The data to update the Pokemon with.
   * @returns A promise resolving to void if the Pokemon was successfully updated, otherwise throws an error.
   */
  async update(id: string, updatePokemonDto: UpdatePokemonDto): Promise<void> {
    try {
      const pokemon = await this.pokemonModel.findOne({ id });

      if (!pokemon) {
        throw new Error(`Pokemon with id ${id} not found`);
      }

      // Sanitize input by trimming whitespace
      updatePokemonDto.name = updatePokemonDto.name?.trim().toLowerCase();
      updatePokemonDto.image = updatePokemonDto.image?.trim();
      updatePokemonDto.type = updatePokemonDto.type?.map((t) =>
        t.trim().toLowerCase(),
      );

      // Find types in the Type schema
      const types = await this.typeModel.find({
        name: {
          $in: updatePokemonDto.type?.map((t) => t.trim().toLowerCase()),
        },
      });

      await pokemon.updateOne({
        $set: { types: { $each: types } },
      });
      await pokemon.updateOne(updatePokemonDto);
    } catch (error) {
      const typedError = error as Error;
      throw new Error(`Failed to update pokemon: ${typedError.message}`);
    }
  }

  /**
   * Removes a Pokemon from the database by its ID property.
   * @param id The ID of the Pokemon to remove.
   * @returns A promise resolving to true if the Pokemon was successfully removed, otherwise throws an error.
   */
  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.pokemonModel.deleteOne({ id });

      if (result.deletedCount === 0) {
        throw new Error(`Pokemon with id ${id} not found`);
      }

      return true;
    } catch (error) {
      const typedError = error as Error;
      throw new Error(`Failed to delete pokemon: ${typedError.message}`);
    }
  }
}
