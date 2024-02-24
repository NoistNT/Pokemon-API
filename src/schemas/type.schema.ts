import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Type {
  @Prop({ required: true, unique: true })
  id!: number;
  @Prop({
    required: true,
    unique: true,
    trim: true,
    index: true,
    lowercase: true,
    maxlength: 30,
  })
  name!: string;
  @Prop({ required: true, trim: true, lowercase: true })
  url!: string;
}

export const TypeSchema = SchemaFactory.createForClass(Type);
