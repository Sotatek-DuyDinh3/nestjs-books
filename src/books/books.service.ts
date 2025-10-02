import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
// import { generateBooks } from './seed';
import { ConfigService } from '@nestjs/config';
import mongoose, { Model } from 'mongoose';
import { Book } from './interfaces/book.interface';
import { BOOK_MODEL } from 'src/common/constants';
import aqp from 'api-query-params';

@Injectable()
export class BooksService {
  constructor(
    private configService: ConfigService,
    @Inject(BOOK_MODEL) private bookModel: Model<Book>,
  ) {
    const countBooks = this.configService.get<number>('COUNT_BOOKS') || 8;
    // this.books = generateBooks(countBooks);
  }
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
        currentPage: currentPage,
        pageSize: limit,
        totalPages: totalPages,
        totalItems: totalItems,
      },
    };
  }

  async findOne(id: string) {
    this.validateObjectId(id);
    return await this.bookModel
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

  async update(id: string, updateBookDto: UpdateBookDto) {
    this.validateObjectId(id);
    if (updateBookDto.title !== undefined && !updateBookDto.title?.trim()) {
      throw new BadRequestException('Title cannot be empty');
    }
    // if (updateBookDto.author !== undefined && !updateBookDto.author?.trim()) {
    //   throw new BadRequestException('Author cannot be empty');
    // }
    return await this.bookModel
      .updateOne(
        { _id: id },
        { ...updateBookDto, updatedAt: new Date().toISOString() },
      )
      .exec();
  }

  async remove(id: string) {
    this.validateObjectId(id);
    return await this.bookModel.deleteOne({ _id: id }).exec();
  }

  private validateObjectId(id: string): void {
    if (!id?.trim() || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
  }
}
