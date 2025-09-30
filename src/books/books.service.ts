import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { generateBooks } from './seed';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker';

@Injectable()
export class BooksService {
  private books: Book[] = [];

  constructor(private configService: ConfigService) {
    const countBooks = this.configService.get<number>('COUNT_BOOKS') || 8;
    this.books = generateBooks(countBooks);
  }
  create(createBookDto: CreateBookDto): Book {
    if (!createBookDto.title?.trim()) {
      throw new BadRequestException('Title is required and cannot be empty');
    }
    if (!createBookDto.author?.trim()) {
      throw new BadRequestException('Author is required and cannot be empty');
    }
    const newBook: Book = {
      id: faker.string.uuid(),
      ...createBookDto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.books.push(newBook);
    return newBook;
  }

  findAll(): Book[] {
    return this.books;
  }

  findOne(id: string) {
    this.validateID(id);
    const book = this.books.find((book) => book.id === id);
    if (!book) throw new BadRequestException(`Not found book with id: ${id}`);
    return book;
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    this.validateID(id);
    if (updateBookDto.title !== undefined && !updateBookDto.title?.trim()) {
      throw new BadRequestException('Title cannot be empty');
    }
    if (updateBookDto.author !== undefined && !updateBookDto.author?.trim()) {
      throw new BadRequestException('Author cannot be empty');
    }
    const book = this.findOne(id);
    const updated: Book = {
      ...book,
      ...updateBookDto,
      updatedAt: new Date().toISOString(),
    };
    const idx = this.books.findIndex((book) => book.id === id);
    this.books[idx] = updated;
    return updated;
  }

  remove(id: string) {
    this.validateID(id);
    const idx = this.books.findIndex((book) => book.id === id);
    if (idx === -1)
      throw new BadRequestException(`Not found book with id: ${id}`);
    this.books.splice(idx, 1);
  }

  private validateID(id: string) {
    if (!id?.trim()) {
      throw new BadRequestException('ID is required');
    }
  }
}
