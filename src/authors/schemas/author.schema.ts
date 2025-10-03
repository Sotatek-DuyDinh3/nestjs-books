import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Book } from 'src/books/schemas/book.schema';

export type AuthorDocument = HydratedDocument<Author>;
@Schema({ timestamps: true })
export class Author {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  bio: string;

  @Prop()
  birthDate: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] })
  books?: mongoose.Schema.Types.ObjectId[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  isDeleted?: boolean;

  @Prop()
  deletedAt?: Date;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
