import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { generateBooks } from './seed';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BooksService {
  private books: Book[] = [];

  constructor(private configService: ConfigService) {
    const countBooks = this.configService.get<number>('COUNT_BOOKS') || 8;
    this.books = generateBooks(countBooks);
  }
  create(createBookDto: CreateBookDto): Book {
    const newBook: Book = {
      id: Date.now().toString(),
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
    const book = this.books.find((book) => book.id === id);
    if (!book) throw new BadRequestException(`Not found book with id: ${id}`);
    return book;
  }

  update(id: string, updateBookDto: UpdateBookDto) {
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
    const idx = this.books.findIndex((book) => book.id === id);
    if (idx === -1)
      throw new BadRequestException(`Not found book with id: ${id}`);
    this.books.splice(idx, 1);
  }
}
