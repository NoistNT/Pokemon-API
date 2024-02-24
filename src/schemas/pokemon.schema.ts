import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { z } from 'zod';
import { createTypeSchema } from './type.schema';

@Schema({ timestamps: true })
export class Pokemon {
  @Prop({
    required: true,
    unique: true,
    trim: true,
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
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
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
  @Prop({ required: true, ref: 'Type' })
  type!: mongoose.Types.ObjectId;
}

export const createPokemonSchema = z.object({
  id: z
    .string()
    .trim()
    .default(() => crypto.randomUUID()),
  name: z.string().min(2).max(30).trim().toLowerCase(),
  image: z
    .string()
    .trim()
    .default(
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    ),
  hp: z.number().int().min(1).max(999).default(1),
  attack: z.number().int().min(1).max(999).default(1),
  defense: z.number().int().min(1).max(999).default(1),
  speed: z.number().int().min(1).max(999).default(1),
  height: z.number().int().min(1).max(999).default(1),
  weight: z.number().int().min(1).max(999).default(1),
  type: z.array(createTypeSchema).min(2),
});

export interface PokemonApiResponse {
  results: { name: string }[];
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
