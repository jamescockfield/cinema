import { injectable, inject, singleton } from 'tsyringe';
import { ReserveBookingHandler } from './handlers/ReserveBookingHandler';
import { QueueMessageType } from './types';
import type { Config } from '../configuration';
import type { QueueClient } from './clients/QueueClient';

@injectable()
@singleton()
export class QueueManager {
  private readonly queueUrl: string;
  private isPolling: boolean = false;

  constructor(
    @inject('QueueClient') private readonly queueClient: QueueClient,
    @inject(ReserveBookingHandler) private readonly reserveBookingHandler: ReserveBookingHandler,
    @inject('Config') config: Config
  ) {
    this.queueUrl = `${config.queue.endpoint}/queue/booking-queue`;
  }

  async startPolling(): Promise<void> {
    if (this.isPolling) return;
    this.isPolling = true;

    while (this.isPolling) {
      try {
        const messages = await this.queueClient.receiveMessages(this.queueUrl);

        for (const message of messages) {
          if (!message.body || !message.receiptHandle) continue;

          try {
            if (message.type === QueueMessageType.RESERVE_BOOKING) {
              await this.reserveBookingHandler.handleReserveBooking(
                parseInt(message.body.screenId),
                parseInt(message.body.seatId)
              );
            } else {
              console.warn(`Unknown message type received: ${message.type}`);
              continue;
            }

            await this.queueClient.deleteMessage(this.queueUrl, message.receiptHandle);
          } catch (error) {
            console.error('Error processing message:', error);
          }
        }
      } catch (error) {
        console.error('Error polling messages:', error);
        // Wait a bit before retrying on error
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  stopPolling(): void {
    this.isPolling = false;
  }
}
