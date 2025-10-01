import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';
import { DATABASE_CONNECTION } from 'src/common/constants';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (
      configService: ConfigService,
    ): Promise<typeof mongoose> => {
      const mongoUrl =
        configService.get<string>('MONGO_URL') || 'mongodb://localhost/nest';
      return mongoose.connect(mongoUrl);
    },
    inject: [ConfigService],
  },
];
