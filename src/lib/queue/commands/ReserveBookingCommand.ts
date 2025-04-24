import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { QueueMessageType } from '../types';
import { inject, injectable } from 'tsyringe';
import type { Config } from '../../configuration';

@injectable()
export class ReserveBookingCommand {
  constructor(
    @inject(SQSClient) private readonly sqsClient: SQSClient,
    @inject('Config') private readonly config: Config
  ) {}

  async execute(screenId: string, seatId: string): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: `${this.config.elasticmq.endpoint}/queue/booking-queue`,
      MessageBody: JSON.stringify({
        type: QueueMessageType.RESERVE_BOOKING,
        screenId,
        seatId,
      }),
    });

    await this.sqsClient.send(command);
  }
}
