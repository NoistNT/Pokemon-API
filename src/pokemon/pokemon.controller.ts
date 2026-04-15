import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CreatePokemonDto, createPokemonSchema } from './dto/create-pokemon.dto';
import { UpdatePokemonDto, updatePokemonSchema } from './dto/update-pokemon.dto';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPokemonDto: CreatePokemonDto) {
    const validated = createPokemonSchema.parse(createPokemonDto);
    return this.pokemonService.create(validated);
  }

  @Get()
  findAll() {
    return this.pokemonService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.pokemonService.findById(id);
  }

  @Get('name/:name')
  findByName(@Param('name') name: string) {
    return this.pokemonService.findByName(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    const validated = updatePokemonSchema.parse(updatePokemonDto);
    return this.pokemonService.update(id, validated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.pokemonService.remove(id);
  }
}
