import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProviders: Provider[] = [
  {
    useFactory: (configService: ConfigService): Redis => {
      return new Redis(
        configService.get<string>('ENV') === 'prod'
          ? configService.get<string>('REDIS_PROD_URL')
          : configService.get<string>('REDIS_URL'),
      );
    },
    provide: REDIS_CLIENT,
    inject: [ConfigService], // This line is important
  },
];
