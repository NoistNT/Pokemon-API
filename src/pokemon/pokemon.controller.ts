import {
  Body,
  Controller,
  Delete,
  Get,
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
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  /**
   * Retrieve all Pokemon from the database.
   * @returns A list of Pokemon.
   */
  @Get()
  findAllFromDb() {
    return this.pokemonService.findAllFromDb();
  }

  /**
   * Retrieve a specific Pokemon from the database.
   * @param id The ID of the Pokemon to retrieve.
   * @returns The specified Pokemon.
   */
  @Get(':id')
  findOneFromDb(@Param('id') id: string) {
    const pokemon = this.pokemonService.findOneFromDb(id);
    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }
    return pokemon;
  }

  /**
   * Update a specific Pokemon.
   * @param id The ID of the Pokemon to update.
   * @param updatePokemonDto The data for updating the Pokemon.
   * @returns The updated Pokemon.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(id, updatePokemonDto);
  }

  /**
   * Delete a specific Pokemon.
   * @param id The ID of the Pokemon to delete.
   * @returns The deleted Pokemon.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pokemonService.remove(id);
  }
}
