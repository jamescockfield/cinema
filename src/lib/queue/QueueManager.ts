import { injectable, inject, singleton } from 'tsyringe';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { ReserveBookingHandler } from './handlers/ReserveBookingHandler';
import { QueueMessageType } from './types';
import type { Config } from '../configuration';
@injectable()
@singleton()
export class QueueManager {
  private readonly queueUrl: string;
  private isPolling: boolean = false;

  constructor(
    @inject(SQSClient) private readonly sqsClient: SQSClient,
    @inject(ReserveBookingHandler) private readonly reserveBookingHandler: ReserveBookingHandler,
    @inject('Config') config: Config
  ) {
    this.queueUrl = `${config.elasticmq.endpoint}/queue/booking-queue`;
  }

  async startPolling(): Promise<void> {
    if (this.isPolling) return;
    this.isPolling = true;

    while (this.isPolling) {
      try {
        const command = new ReceiveMessageCommand({
          QueueUrl: this.queueUrl,
          MaxNumberOfMessages: 10,
          WaitTimeSeconds: 20,
        });

        const response = await this.sqsClient.send(command);
        const messages = response.Messages || [];

        for (const message of messages) {
          if (!message.Body || !message.ReceiptHandle) continue;

          try {
            const body = JSON.parse(message.Body);
            if (body.type === QueueMessageType.RESERVE_BOOKING) {
              await this.reserveBookingHandler.handleReserveBooking(parseInt(body.screenId), parseInt(body.seatId));
            } else {
              console.warn(`Unknown message type received: ${body.type}`);
              continue;
            }

            await this.sqsClient.send(
              new DeleteMessageCommand({
                QueueUrl: this.queueUrl,
                ReceiptHandle: message.ReceiptHandle,
              })
            );
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
