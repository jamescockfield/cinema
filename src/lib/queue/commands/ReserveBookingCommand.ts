import { QueueMessageType } from '../types';
import { inject, injectable } from 'tsyringe';
import type { Config } from '../../configuration';
import type { QueueClient } from '../clients/QueueClient';

@injectable()
export class ReserveBookingCommand {
  constructor(
    @inject('QueueClient') private readonly queueClient: QueueClient,
    @inject('Config') private readonly config: Config
  ) {}

  async execute(screenId: string, seatId: string): Promise<void> {
    await this.queueClient.sendMessage(
      `${this.config.queue.endpoint}/queue/booking-queue`,
      {
        type: QueueMessageType.RESERVE_BOOKING,
        screenId,
        seatId,
      }
    );
  }
}
