import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { QueueMessageType } from '../types';

export class ReserveBookingCommand {
  private readonly queueUrl: string;

  constructor(private readonly sqsClient: SQSClient) {
    this.queueUrl = process.env.ELASTICMQ_QUEUE_URL || 'http://localhost:9324/queue/booking-queue';
  }

  async execute(screenId: string, seatId: string): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify({
        type: QueueMessageType.RESERVE_BOOKING,
        screenId,
        seatId,
      }),
    });

    await this.sqsClient.send(command);
  }
}
