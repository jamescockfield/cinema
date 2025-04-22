import { Seat } from '../../types/types.d';
import { RedisClient } from '../redis/RedisClient';
import { injectable, inject } from 'tsyringe';
import { RoomType } from '../websocket/RoomType';

@injectable()
export class ScreenAvailabilityCache {
  constructor(@inject(RedisClient) private readonly redisClient: RedisClient) {}

  private getKey(screenId: number): string {
    return `${RoomType.SCREEN}:${screenId}:availability`;
  }

  async getSeatAvailability(screenId: number): Promise<Seat[]> {
    const key = this.getKey(screenId);
    const cachedAvailability = await this.redisClient.get(key);

    if (cachedAvailability) {
      return JSON.parse(cachedAvailability);
    }
    return [];
  }

  async setSeatAvailability(screenId: number, seats: Seat[]): Promise<void> {
    const key = this.getKey(screenId);
    await this.redisClient.set(key, JSON.stringify(seats));
  }
}
