import { Redis } from 'ioredis';
import { injectable, inject } from 'tsyringe';

@injectable()
export class RedisClient {
  constructor(@inject(Redis) private readonly redis: Redis) {}

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.redis.expire(key, seconds);
  }
}
