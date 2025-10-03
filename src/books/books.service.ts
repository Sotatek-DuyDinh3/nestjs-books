import {
  BadRequestException,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import type { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: SoftDeleteModel<BookDocument>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    if (!createBookDto.title?.trim()) {
      throw new BadRequestException('Title is required and cannot be empty');
    }
    return await this.bookModel.create({
      ...createBookDto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async findAll(
    currentPage: number,
    limit: number,
    query: string,
    user?: IUser,
  ): Promise<{
    result: Book[];
    meta: {
      currentPage: number;
      pageSize: number;
      totalPages: number;
      totalItems: number;
    };
  }> {
    const { filter, sort, population, projection } = aqp(query);

    delete filter.current;
    delete filter.pageSize;

    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;

    if (!user) {
      filter.isPremium = false;
    }

    const totalItems = (await this.bookModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.bookModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      result,
      meta: {
        currentPage,
        pageSize: limit,
        totalPages,
        totalItems,
      },
    };
  }

  async findOne(id: string, user?: IUser): Promise<Book> {
    this.validateObjectId(id);
    const book = await this.bookModel
      .findById(id)
      .populate({
        path: 'authors',
        select: {
          name: 1,
          bio: 1,
          birthDate: 1,
        },
      })
      .exec();

    if (!book) {
      throw new BadRequestException('Book not found');
    }

    if (book.isPremium && !user) {
      throw new ForbiddenException(
        'This book is premium. Please login to view.',
      );
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    this.validateObjectId(id);
    if (updateBookDto.title !== undefined && !updateBookDto.title?.trim()) {
      throw new BadRequestException('Title cannot be empty');
    }
    return await this.bookModel
      .updateOne(
        { _id: id },
        { ...updateBookDto, updatedAt: new Date().toISOString() },
      )
      .exec();
  }

  async remove(id: string) {
    this.validateObjectId(id);
    return this.bookModel.softDelete({ _id: id });
  }

  private validateObjectId(id: string): void {
    if (!id?.trim() || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
  }
}
