import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { z } from 'zod';
import { createTypeSchema } from './type.schema';

@Schema({ timestamps: true })
export class Pokemon {
  @Prop({
    required: true,
    unique: true,
    index: true,
    default: () => crypto.randomUUID(),
  })
  id!: string;
  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 30,
  })
  name!: string;
  @Prop({
    required: true,
    trim: true,
    default:
      'https://res.cloudinary.com/dsg5ofk4e/image/upload/v1709047835/pokewiki/60f684ec58ea6ded58112eac2324bfa8.webp',
  })
  image!: string;
  @Prop({ required: true, default: 1, min: 1, max: 999 })
  hp!: number;
  @Prop({ required: true, default: 1, min: 1, max: 999 })
  attack!: number;
  @Prop({ required: true, default: 1, min: 1, max: 999 })
  defense!: number;
  @Prop({ required: true, default: 1, min: 1, max: 999 })
  speed!: number;
  @Prop({ required: true, default: 1, min: 1, max: 999 })
  height!: number;
  @Prop({ required: true, default: 1, min: 1, max: 999 })
  weight!: number;
  @Prop({ required: true, default: true })
  userCreated!: boolean;
  @Prop({ required: true, ref: 'Type' })
  type!: Types.ObjectId;
}

export const createPokemonSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().min(2).max(30).trim().toLowerCase(),
  image: z
    .string()
    .trim()
    .default(
      'https://res.cloudinary.com/dsg5ofk4e/image/upload/v1709047835/pokewiki/60f684ec58ea6ded58112eac2324bfa8.webp',
    ),
  hp: z.number().int().min(1).max(999).default(1),
  attack: z.number().int().min(1).max(999).default(1),
  defense: z.number().int().min(1).max(999).default(1),
  speed: z.number().int().min(1).max(999).default(1),
  height: z.number().int().min(1).max(999).default(1),
  weight: z.number().int().min(1).max(999).default(1),
  userCreated: z.boolean().default(true),
  type: z.array(createTypeSchema).min(1).max(2),
});

export interface PokemonResponse {
  results: { name: string }[];
}

export interface PokemonApiResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: { home: { front_default: string } };
  };
  stats: [];
  types: [{ type: { name: string } }];
  height: number;
  weight: number;
}

export interface PokemonApi {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      home: {
        front_default: string;
      };
    };
  };
  stats: {
    base_stat: number;
  }[];
  types: {
    type: {
      name: string;
    };
  }[];
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
