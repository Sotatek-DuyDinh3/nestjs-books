import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { DatabasesModule } from 'src/databases/databases.module';
import { booksProviders } from './books.providers';

@Module({
  imports: [DatabasesModule],
  controllers: [BooksController],
  providers: [BooksService, ...booksProviders],
})
export class BooksModule {}
