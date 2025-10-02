import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateBookDto {
  @ApiProperty({ example: 'The Hobbit' })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({ example: 'A fantasy novel by J.R.R. Tolkien' })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({ example: ['64b64c4f5311236168a109ca'] })
  @IsNotEmpty({ message: 'Author is required' })
  @IsMongoId({
    each: true,
    message: 'each author must be a valid Mongo ID',
  })
  @IsArray({ message: 'Authors must be an array' })
  authors: mongoose.Schema.Types.ObjectId[];

  @ApiProperty({ example: '1937-09-21', required: false })
  @IsString({ message: 'PublishedAt must be a string' })
  @IsOptional()
  publishedAt?: string;
}
