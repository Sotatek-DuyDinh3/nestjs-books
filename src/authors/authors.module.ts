import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { authorsProviders } from './authors.providers';
import { DatabasesModule } from 'src/databases/databases.module';

@Module({
  imports: [DatabasesModule],
  controllers: [AuthorsController],
  providers: [AuthorsService, ...authorsProviders],
})
export class AuthorsModule {}
