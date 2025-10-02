import { Connection } from 'mongoose';
import { AuthorSchema } from './schemas/author.schema';
import { AUTHOR_MODEL, DATABASE_CONNECTION } from 'src/common/constants';

export const authorsProviders = [
  {
    provide: AUTHOR_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Author', AuthorSchema),
    inject: [DATABASE_CONNECTION],
  },
];
