import { PokemonSchema } from '@/schemas/pokemon.schema';
import { TypeSchema } from '@/schemas/type.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Pokemon', schema: PokemonSchema },
      { name: 'Type', schema: TypeSchema },
    ]),
  ],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
