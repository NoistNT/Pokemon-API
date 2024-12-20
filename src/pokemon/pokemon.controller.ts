import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PokemonService } from './pokemon.service';

/**
 * @Controller('pokemon')
 *
 * This controller handles API requests related to Pokemon resources.
 */
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  /**
   * Creates a new Pokemon in the database.
   *
   * @remarks
   * - Delegates creation logic to the `pokemonService`.
   * - Returns the newly created Pokemon object.
   *
   * @param createPokemonDto - The data to create a new Pokemon with.
   * @returns A promise resolving to the http status code of the response.
   */
  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  /**
   * Retrieves all Pokemon from the database.
   *
   * @remarks
   * - Delegates retrieval logic to the `pokemonService`.
   * - Returns an array of Pokemon objects.
   *
   * @returns A promise resolving to a list of Pokemon objects.
   */
  @Get()
  findAll() {
    return this.pokemonService.findAll();
  }

  /**
   * Retrieves a specific Pokemon from the database by its ID.
   *
   * @remarks
   * - Delegates retrieval logic to the `pokemonService`.
   * - Returns the specified Pokemon object, or throws a `NotFoundException` if not found.
   *
   * @param id - The ID of the Pokemon to retrieve.
   * @returns A promise resolving to the fetched Pokemon object.
   */
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.pokemonService.findById(id);
  }

  /**
   * Retrieves a Pokemon by its name, searching both the database and the API.
   *
   * @remarks
   * - Expects a Pokemon name in the request parameter `name`.
   * - Delegates the retrieval logic to the `pokemonService.findByName` method.
   * - Returns a promise resolving to an array of the fetched Pokemon object, or throws an error if not found.
   *
   * @param name - The name of the Pokemon to search for.
   * @returns A promise resolving to an array of the fetched Pokemon object, or throws an error if not found.
   */
  @Get('name/:name')
  findByName(@Param('name') name: string) {
    return this.pokemonService.findByName(name);
  }

  /**
   * Updates a specific Pokemon in the database.
   *
   * @remarks
   * - Delegates update logic to the `pokemonService`.
   * - Returns the updated Pokemon object, or throws a error if not found.
   *
   * @param id - The ID of the Pokemon to update.
   * @param updatePokemonDto - The data for updating the Pokemon.
   * @returns A promise resolving to the updated Pokemon doccment.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(id, updatePokemonDto);
  }

  /**
   * Removes a specific Pokemon from the database.
   *
   * @remarks
   * - Delegates removal logic to the `pokemonService`.
   * - Returns `true` if the Pokemon was successfully deleted, or throws a error if not found.
   *
   * @param id - The ID of the Pokemon to delete.
   * @returns A promise resolving to `true` if deletion was successful.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pokemonService.remove(id);
  }
}
