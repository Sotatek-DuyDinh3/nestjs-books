import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Model } from 'mongoose';
import { Author } from './interfaces/author.interface';
import * as mongoose from 'mongoose';
import aqp from 'api-query-params';
import { AUTHOR_MODEL } from 'src/common/constants';

@Injectable()
export class AuthorsService {
  constructor(
    @Inject(AUTHOR_MODEL)
    private authorModel: Model<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    if (!createAuthorDto.name?.trim()) {
      throw new BadRequestException('Name is required');
    }
    return await this.authorModel.create({
      ...createAuthorDto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async findAll(
    currentPage: number,
    limit: number,
    query: string,
  ): Promise<{
    result: Author[];
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

    const totalItems = (await this.authorModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.authorModel
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

  async findOne(id: string) {
    this.validateObjectId(id);
    return await this.authorModel
      .findById(id)
      .populate({
        path: 'books',
        select: {
          title: 1,
          description: 1,
          publishedAt: 1,
        },
      })
      .exec();
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    this.validateObjectId(id);
    if (updateAuthorDto.name !== undefined && !updateAuthorDto.name?.trim()) {
      throw new BadRequestException('Name cannot be empty');
    }

    const author = await this.authorModel.findByIdAndUpdate(
      id,
      {
        ...updateAuthorDto,
        updatedAt: new Date().toISOString(),
      },
      { new: true },
    );

    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

  async remove(id: string) {
    this.validateObjectId(id);
    const author = await this.authorModel.findByIdAndDelete(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
  }

  private validateObjectId(id: string): void {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
  }
}
