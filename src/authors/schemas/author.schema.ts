import * as mongoose from 'mongoose';

export const AuthorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String, required: false },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Book',
    },
  ],
  birthDate: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
