import { injectable, inject } from 'tsyringe';
import { SQSClient, Message } from '@aws-sdk/client-sqs';
import { QueueClient } from './QueueClient';
import type { Config } from '../../configuration';
import {
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  CreateQueueCommand,
  ListQueuesCommand
} from '../commands/sqs';
import { QueueMessage, QueueMessageType } from '../types';

@injectable()
export class SQSQueueClient implements QueueClient {
  private isReady: boolean = false;

  constructor(
    @inject('Config') private readonly config: Config,
    private readonly sqsClient: SQSClient
  ) {}

  async waitForReady(): Promise<void> {
    if (this.isReady) return;

    let timeoutId: NodeJS.Timeout;
    const timeout = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('Timeout waiting for SQS connection')), 30000);
    });

    const connect = new Promise<void>(async (resolve, reject) => {
      try {
        // Try to list queues as a health check
        const command = new ListQueuesCommand();
        await this.sqsClient.send(command);
        clearTimeout(timeoutId);
        this.isReady = true;
        resolve();
      } catch (err) {
        clearTimeout(timeoutId);
        reject(err);
      }
    });

    await Promise.race([connect, timeout]);
  }

  private getQueueUrl(queueName: string): string {
    return `${this.config.queue.sqs.endpoint}/${queueName}`;
  }

  async sendMessage(queueName: string, message: any): Promise<void> {
    const command = new SendMessageCommand(this.getQueueUrl(queueName), message);
    await this.sqsClient.send(command);
  }

  async receiveMessages(queueName: string): Promise<QueueMessage[]> {
    const command = new ReceiveMessageCommand(this.getQueueUrl(queueName));
    const response = await this.sqsClient.send(command);
    return ((response.Messages || []) as Message[]).map(message => ({
      type: message.MessageAttributes?.type?.StringValue as QueueMessageType,
      body: JSON.parse(message.Body || '{}'),
      receiptHandle: message.ReceiptHandle || ''
    }));
  }

  async deleteMessage(queueName: string, receiptHandle: string): Promise<void> {
    const command = new DeleteMessageCommand(this.getQueueUrl(queueName), receiptHandle);
    await this.sqsClient.send(command);
  }

  async createQueue(queueName: string): Promise<void> {
    try {
      const command = new CreateQueueCommand(queueName);
      await this.sqsClient.send(command);
    } catch (error: any) {
      // If queue already exists, that's fine
      if (error.name !== 'QueueNameExists') {
        throw error;
      }
    }
  }

  async close(): Promise<void> {
    // No cleanup needed for SQS client
  }
} 