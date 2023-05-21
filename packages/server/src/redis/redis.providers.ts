import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProviders: Provider[] = [
  {
    useFactory: (): Redis => {
      return new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      });
    },
    provide: REDIS_CLIENT,
  },
];
