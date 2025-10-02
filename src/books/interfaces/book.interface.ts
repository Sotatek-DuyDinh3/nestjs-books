import { Document } from 'mongoose';

export interface Book extends Document {
  title: string;
  description: string;
  author: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
