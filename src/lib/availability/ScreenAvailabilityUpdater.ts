import { injectable, inject, singleton } from 'tsyringe';
import { ScreenAvailabilityCache } from './ScreenAvailabilityCache';
import { ConnectionRepository } from '@/aws/repositories/ConnectionRepository';
import { ApiGatewayClient } from '@/aws/websocket/ApiGatewayClient';

@injectable()
@singleton()
export class ScreenAvailabilityUpdater {
  constructor(
    @inject(ConnectionRepository) private readonly connectionRepository: ConnectionRepository,
    @inject(ApiGatewayClient) private readonly apiGateway: ApiGatewayClient,
    @inject(ScreenAvailabilityCache) private readonly cache: ScreenAvailabilityCache
  ) {}

  async updateSeatAvailability(screenId: number, seatId: number, available: boolean): Promise<void> {
    await this.cache.setSeatAvailability(screenId, seatId, available);

    const seats = await this.cache.getScreenAvailability(screenId);
    const connectionIds = await this.connectionRepository.getAllConnections();

    // Broadcast to all connections
    await this.apiGateway.broadcast(
      connectionIds,
      'seatUpdate',
      { seats, screenId }
    );
  }
}
