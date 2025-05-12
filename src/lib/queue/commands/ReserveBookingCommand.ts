import { QueueMessageType } from '../types';
import { inject, injectable } from 'tsyringe';
import type { QueueClient } from '../clients/QueueClient';
import { QueueManager } from '../QueueManager';

@injectable()
export class ReserveBookingCommand {
  constructor(
    @inject('QueueClient') private readonly queueClient: QueueClient
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
