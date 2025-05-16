import { injectable, inject, singleton } from 'tsyringe';
import { WebSocketServer } from '@/lib/websocket/WebSocketServer';
import { RoomType, SocketEvent } from '@/lib/websocket/types';
import { ScreenAvailabilityCache } from './ScreenAvailabilityCache';

@injectable()
@singleton()
export class ScreenAvailabilityUpdater {
  constructor(
    @inject(WebSocketServer) private readonly wsServer: WebSocketServer,
    @inject(ScreenAvailabilityCache) private readonly cache: ScreenAvailabilityCache
  ) {
    this.registerSocketHandlers();
  }

  private registerSocketHandlers(): void {
    this.wsServer.registerEventHandler({
      event: SocketEvent.JOIN,
      handler: async (room: string) => {
        const [roomType, screenIdStr] = room.split(':');
        if (roomType === RoomType.SCREEN) {
          const screenId = parseInt(screenIdStr);

          const seats = await this.cache.getScreenAvailability(screenId);

          this.wsServer.broadcast(room, 'seatUpdate', { seats });
        }
      },
    });
  }

  async updateSeatAvailability(screenId: number, seatId: number, available: boolean): Promise<void> {
    await this.cache.setSeatAvailability(screenId, seatId, available);

    const seats = await this.cache.getScreenAvailability(screenId);

    this.wsServer.broadcast(`${RoomType.SCREEN}:${screenId}`, 'seatUpdate', { seats });
  }
}
