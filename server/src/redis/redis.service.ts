import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.providers';

@Injectable()
export class RedisService {
  public constructor(
    @Inject(REDIS_CLIENT)
    public readonly redisClient: Redis,
  ) {}
}
