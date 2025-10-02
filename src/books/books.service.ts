import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
// import { generateBooks } from './seed';
import { ConfigService } from '@nestjs/config';
import mongoose, { Model } from 'mongoose';
import { Book } from './interfaces/book.interface';
import { BOOK_MODEL } from 'src/common/constants';

@Injectable()
export class BooksService {
  constructor(
    private configService: ConfigService,
    @Inject(BOOK_MODEL) private bookModel: Model<Book>,
  ) {
    const countBooks = this.configService.get<number>('COUNT_BOOKS') || 8;
    // this.books = generateBooks(countBooks);
  }
  create(createBookDto: CreateBookDto): Promise<Book> {
    if (!createBookDto.title?.trim()) {
      throw new BadRequestException('Title is required and cannot be empty');
    }
    return this.bookModel.create({
      ...createBookDto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  findAll(): Promise<Book[]> {
    return this.bookModel
      .find()
      .populate({
        path: 'authors',
        select: {
          name: 1,
          bio: 1,
          birthDate: 1,
        },
      })
      .exec();
  }

  findOne(id: string) {
    this.validateObjectId(id);
    return this.bookModel
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
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    this.validateObjectId(id);
    if (updateBookDto.title !== undefined && !updateBookDto.title?.trim()) {
      throw new BadRequestException('Title cannot be empty');
    }
    // if (updateBookDto.author !== undefined && !updateBookDto.author?.trim()) {
    //   throw new BadRequestException('Author cannot be empty');
    // }
    return this.bookModel
      .updateOne(
        { _id: id },
        { ...updateBookDto, updatedAt: new Date().toISOString() },
      )
      .exec();
  }

  remove(id: string) {
    this.validateObjectId(id);
    return this.bookModel.deleteOne({ _id: id }).exec();
  }

  private validateObjectId(id: string): void {
    if (!id?.trim() || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
  }
}
