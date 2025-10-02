import * as mongoose from 'mongoose';

export const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Author',
    },
  ],
  description: { type: String, required: true },
  publishedAt: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
