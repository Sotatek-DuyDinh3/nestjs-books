import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorator/customize';

@ApiTags('Books APIs')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new book',
    description:
      'Create a new book with the following information: title, description, author, publishedYear, ...',
  })
  @ApiCreatedResponse({ type: Object, description: 'Create book' })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  @ResponseMessage('Create book')
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get list of books',
    description: 'Get list of books',
  })
  @ApiOkResponse({ description: 'Success' })
  @ApiOkResponse({ description: 'List of books', type: [Object] })
  @ApiQuery({
    name: 'current',
    required: false,
    type: Number,
    description: 'Current page number',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ResponseMessage('List of books')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() query: string,
  ) {
    return this.booksService.findAll(+currentPage, +limit, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get book detail',
    description: 'Get details of a book by ID',
  })
  @ApiOkResponse({ description: 'Book detail', type: Object })
  @ApiNotFoundResponse({ description: 'Book not found' })
  @ResponseMessage('Book detail')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update book',
    description: 'Update information of a book by ID',
  })
  @ApiOkResponse({ description: 'Update book', type: Object })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  @ResponseMessage('Update book')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete book',
    description: 'Delete a book by ID',
  })
  @ApiOkResponse({ description: 'Delete book' })
  @ApiNotFoundResponse({ description: 'Book not found' })
  @ResponseMessage('Delete book successfully')
  remove(@Param('id') id: string) {
    this.booksService.remove(id);
    return;
  }
}
