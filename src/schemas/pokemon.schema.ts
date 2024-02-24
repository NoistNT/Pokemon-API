import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Pokemon {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    default: crypto.randomUUID(),
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

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
