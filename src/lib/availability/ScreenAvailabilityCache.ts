import { Seat } from '../../types/types.d';
import { injectable, inject, singleton } from 'tsyringe';
import { RoomType } from '../websocket/types';
import { Redis } from 'ioredis';

@injectable()
@singleton()
export class ScreenAvailabilityCache {
  constructor(@inject(Redis) private readonly redis: Redis) {}

  private getKey(screenId: number): string {
    return `${RoomType.SCREEN}:${screenId}:availability`;
  }

  async getSeatAvailability(screenId: number): Promise<Seat[]> {
    const key = this.getKey(screenId);
    const cachedAvailability = await this.redis.get(key);

    if (cachedAvailability) {
      return JSON.parse(cachedAvailability);
    }
    return [];
  }

  async setSeatAvailability(screenId: number, seats: Seat[]): Promise<void> {
    const key = this.getKey(screenId);
    await this.redis.set(key, JSON.stringify(seats));
  }
}
