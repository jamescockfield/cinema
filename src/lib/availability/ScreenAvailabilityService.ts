import { Seat } from '../../types/types.d';
import { RedisClient } from '../redis/RedisClient';
import { injectable, inject } from 'tsyringe';
import { WebSocketServer } from '../websocket/WebSocketServer';
import { RoomType } from '../websocket/RoomType';
import { ScreenAvailabilityCache } from './ScreenAvailabilityCache';

@injectable()
export class ScreenAvailabilityService {
  constructor(
    @inject(RedisClient) private readonly redisClient: RedisClient,
    @inject(WebSocketServer) private readonly wsServer: WebSocketServer,
    @inject(ScreenAvailabilityCache) private readonly cache: ScreenAvailabilityCache
  ) {
    this.registerSocketHandlers();
  }

  private registerSocketHandlers(): void {
    this.wsServer.registerEventHandler({
      event: 'join',
      handler: async (room: string) => {
        const [roomType, screenIdStr] = room.split(':');
        if (roomType === RoomType.SCREEN) {
          const screenId = parseInt(screenIdStr);
          const seats = await this.cache.getSeatAvailability(screenId);
          this.wsServer.broadcast(room, 'seatUpdate', { seats });
        }
      },
    });
  }

  async getSeatAvailability(screenId: number): Promise<Seat[]> {
    return this.cache.getSeatAvailability(screenId);
  }

  async updateSeatAvailability(screenId: number, seatId: number, available: boolean): Promise<void> {
    const availability = await this.cache.getSeatAvailability(screenId);
    const seat = availability.find((seat) => seat.id === seatId);
    if (seat) {
      seat.available = available;
    } else {
      availability.push({ id: seatId, available });
    }
    await this.cache.setSeatAvailability(screenId, availability);

    // Broadcast update to all clients in the screen room
    this.wsServer.broadcast(`${RoomType.SCREEN}:${screenId}`, 'seatUpdate', { seats: availability });
  }
}
