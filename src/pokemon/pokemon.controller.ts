import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  /**
   * Create a new Pokemon.
   * @param createPokemonDto The data for creating the Pokemon.
   * @returns The created Pokemon.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPokemonDto: CreatePokemonDto) {
    try {
      return await this.pokemonService.create(createPokemonDto);
    } catch (error) {
      const typedError = error as Error;
      throw new InternalServerErrorException(typedError.message);
    }
  }

  /**
   * Retrieve all Pokemon from the database.
   * @returns A list of Pokemon.
   */
  @Get()
  async findAllFromDb() {
    try {
      return await this.pokemonService.findAllFromDb();
    } catch (error) {
      const typedError = error as Error;
      throw new InternalServerErrorException(typedError.message);
    }
  }

  /**
   * Retrieve a specific Pokemon from the database.
   * @param id The ID of the Pokemon to retrieve.
   * @returns The specified Pokemon.
   */
  @Get(':id')
  async findOneFromDb(@Param('id') id: string) {
    try {
      const pokemon = await this.pokemonService.findOneFromDb(id);
      if (!pokemon) {
        throw new NotFoundException(`Pokemon with id ${id} not found`);
      }
      return pokemon;
    } catch (error) {
      const typedError = error as Error;
      throw new InternalServerErrorException(typedError.message);
    }
  }

  /**
   * Update a specific Pokemon.
   * @param id The ID of the Pokemon to update.
   * @param updatePokemonDto The data for updating the Pokemon.
   * @returns The updated Pokemon.
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ) {
    try {
      return await this.pokemonService.update(id, updatePokemonDto);
    } catch (error) {
      const typedError = error as Error;
      throw new InternalServerErrorException(typedError.message);
    }
  }

  /**
   * Delete a specific Pokemon.
   * @param id The ID of the Pokemon to delete.
   * @returns The deleted Pokemon.
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.pokemonService.remove(id);
    } catch (error) {
      const typedError = error as Error;
      throw new InternalServerErrorException(typedError.message);
    }
  }
}
