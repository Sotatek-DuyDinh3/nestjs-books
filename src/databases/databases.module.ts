import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { databaseProviders } from './database.providers';

@Module({
  controllers: [DatabasesController],
  providers: [DatabasesService, ...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabasesModule {}
