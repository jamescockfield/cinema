import { Seat } from '@/types/types';
import { injectable, inject, singleton } from 'tsyringe';
import { RoomType } from '@/lib/websocket/types';
import { Redis } from 'ioredis';

@injectable()
@singleton()
export class ScreenAvailabilityCache {
  constructor(@inject(Redis) private readonly redis: Redis) {}

  private getKey(screenId: number): string {
    return `${RoomType.SCREEN}:${screenId}:availability`;
  }

  async getScreenAvailability(screenId: number): Promise<Seat[]> {
    const key = this.getKey(screenId);
    const cachedAvailability = await this.redis.get(key);

    if (cachedAvailability) {
      return JSON.parse(cachedAvailability);
    }
    return [];
  }

  async setScreenAvailability(screenId: number, seats: Seat[]): Promise<void> {
    const key = this.getKey(screenId);
    await this.redis.set(key, JSON.stringify(seats));
  }

  async getSeatAvailability(screenId: number, seatId: number): Promise<Seat | undefined> {
    const seats = await this.getScreenAvailability(screenId);
    return seats.find((seat: Seat) => seat.id === seatId);
  }

  async setSeatAvailability(screenId: number, seatId: number, available: boolean): Promise<void> {
    const seats = await this.getScreenAvailability(screenId);
    const seat = seats.find((seat: Seat) => seat.id === seatId);
    if (seat) {
      seat.available = available;
      await this.setScreenAvailability(screenId, seats);
    } else {
      throw new Error('Seat not found');
    }
  }
}
