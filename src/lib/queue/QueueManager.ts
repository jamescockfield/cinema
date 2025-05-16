import { injectable, inject, singleton } from 'tsyringe';
import { QueueClientToken } from '../container';
import { ReserveBookingHandler } from './handlers/ReserveBookingHandler';
import { QueueMessageType } from './types';
import type { QueueClient } from './clients/QueueClient';

@injectable()
@singleton()
export class QueueManager {
  public static readonly BOOKING_QUEUE_NAME = 'booking-queue';
  private isPolling: boolean = false;

  // TODO: consider push-based with RabbitMQ and SNS

  constructor(
    @inject(QueueClientToken) private readonly queueClient: QueueClient,
    @inject(ReserveBookingHandler) private readonly reserveBookingHandler: ReserveBookingHandler,
  ) {}

  async startPolling(): Promise<void> {
    if (this.isPolling) return;

    await this.queueClient.createQueue(QueueManager.BOOKING_QUEUE_NAME);

    this.isPolling = true;

    while (this.isPolling) {
      try {
        const messages = await this.queueClient.receiveMessages(QueueManager.BOOKING_QUEUE_NAME);

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

            await this.queueClient.deleteMessage(QueueManager.BOOKING_QUEUE_NAME, message.receiptHandle);
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
