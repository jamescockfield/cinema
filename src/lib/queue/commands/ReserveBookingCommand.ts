import { QueueMessageType } from '@/lib/queue/types';
import { inject, injectable } from 'tsyringe';
import { QueueClientToken } from '@/lib/container';
import type { QueueClient } from '@/lib/queue/clients/QueueClient';
import { QueueManager } from '@/lib/queue/QueueManager';

@injectable()
export class ReserveBookingCommand {
  constructor(
    @inject(QueueClientToken) private readonly queueClient: QueueClient
  ) {}

  async execute(screenId: string, seatId: string): Promise<void> {
    await this.queueClient.sendMessage(
      QueueManager.BOOKING_QUEUE_NAME,
      {
        type: QueueMessageType.RESERVE_BOOKING,
        body: {
          screenId,
          seatId,
        },
      }
    );
  }
}
