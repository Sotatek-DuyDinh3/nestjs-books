import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateAuthorDto {
  @ApiProperty({ example: 'J.R.R. Tolkien' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    example: 'An English writer and philologist...',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  bio?: string;

  @ApiProperty({ example: ['64b64c4f5311236168a109ca'] })
  @IsArray({ message: 'Books must be an array' })
  @IsMongoId({
    each: true,
    message: 'Each book must be a valid Mongo ID',
  })
  books: mongoose.Schema.Types.ObjectId[];

  @ApiProperty({
    example: '1892-01-03',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Birth date must be a string' })
  birthDate?: string;
}
