import { Document } from 'mongoose';

export interface Book extends Document {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  createdAt: Date;
  updatedAt: Date;
}
