import { Document } from 'mongoose';
import mongoose from 'mongoose';

export interface Author extends Document {
  name: string;
  bio?: string;
  books: mongoose.Schema.Types.ObjectId[];
  birthDate?: string;
  createdAt: Date;
  updatedAt: Date;
}
