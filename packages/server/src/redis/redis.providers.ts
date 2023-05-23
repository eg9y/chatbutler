import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProviders: Provider[] = [
  {
    useFactory: (configService: ConfigService): Redis => {
      const devRedisPath = `redis://${configService.get<string>(
        'REDIS_HOST',
      )}:${configService.get<string>('REDIS_PORT')}`;

      const prodRedisPath = `redis://default:${configService.get<string>(
        'REDIS_PASSWORD',
      )}@${configService.get<string>('REDIS_HOST')}:${configService.get<string>(
        'REDIS_PORT',
      )}`;

      return new Redis(
        configService.get<string>('ENV') === 'prod'
          ? prodRedisPath
          : devRedisPath,
      );
    },
    provide: REDIS_CLIENT,
    inject: [ConfigService], // This line is important
  },
];
