import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'The Hobbit' })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({ example: 'A fantasy novel by J.R.R. Tolkien' })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({ example: 'J.R.R. Tolkien' })
  @IsNotEmpty({ message: 'Author is required' })
  @IsString({ message: 'Author must be a string' })
  author: string;

  @ApiProperty({ example: '1937-09-21', required: false })
  @IsString({ message: 'PublishedAt must be a string' })
  @IsOptional()
  publishedAt?: string;
}
