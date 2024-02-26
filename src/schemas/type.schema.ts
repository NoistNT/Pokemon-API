import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { z } from 'zod';

@Schema({ timestamps: true })
export class Type {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    index: true,
    lowercase: true,
    maxlength: 20,
  })
  name!: string;
  @Prop({ required: true, trim: true, lowercase: true })
  url!: string;
}

export const createTypeSchema = z.object({
  name: z.string().min(2).max(20).trim().toLowerCase(),
  url: z.string().url().trim(),
});

export interface TypeApiResponse {
  results: Type[];
}

export const TypeSchema = SchemaFactory.createForClass(Type);
