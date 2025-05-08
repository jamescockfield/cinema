import { injectable } from 'tsyringe';
import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { QueueClient, QueueMessage } from './clients/QueueClient';

@injectable()
export class SQSQueueClient implements QueueClient {
  constructor(private readonly sqsClient: SQSClient) {}

  async sendMessage(queueUrl: string, message: any): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
    });

    await this.sqsClient.send(command);
  }

  async receiveMessages(queueUrl: string, maxMessages: number = 10, waitTimeSeconds: number = 20): Promise<QueueMessage[]> {
    const command = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: maxMessages,
      WaitTimeSeconds: waitTimeSeconds,
    });

    const response = await this.sqsClient.send(command);
    return (response.Messages || []).map(message => ({
      type: message.MessageAttributes?.type?.StringValue || '',
      body: JSON.parse(message.Body || '{}'),
      receiptHandle: message.ReceiptHandle,
    }));
  }

  async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
    const command = new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    });

    await this.sqsClient.send(command);
  }
} 