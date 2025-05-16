import { injectable, inject } from 'tsyringe';
import { SQSClient, Message } from '@aws-sdk/client-sqs';
import { QueueClient } from './QueueClient';
import { Config } from '@/lib/configuration';
import {
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  CreateQueueCommand
} from '@/lib/queue/commands/sqs';
import { QueueMessage, QueueMessageType } from '@/lib/queue/types';

@injectable()
export class ElasticMQClient implements QueueClient {
  private client: SQSClient;
  private isReady: boolean = false;

  constructor(
    @inject(Config) private readonly config: Config
  ) {
    this.client = new SQSClient({
      endpoint: config.queue.elasticmq.url,
      region: 'us-east-1', // ElasticMQ doesn't care about region
      credentials: {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy'
      }
    });
  }

  private getQueueUrl(queueName: string): string {
    return `${this.config.queue.elasticmq.url}/queue/${queueName}`;
  }

  async waitForReady(): Promise<void> {
    if (this.isReady) return;

    // Use createQueue as a health check - it will handle QueueNameExists internally
    await this.createQueue('health-check');
    this.isReady = true;
  }

  async createQueue(queueName: string): Promise<void> {
    try {
      const command = new CreateQueueCommand(queueName);
      await this.client.send(command);
    } catch (error: any) {
      // If queue already exists, that's fine
      if (error.name !== 'QueueNameExists') {
        throw error;
      }
    }
  }

  async sendMessage(queueName: string, message: QueueMessage): Promise<void> {
    const command = new SendMessageCommand(this.getQueueUrl(queueName), message);
    try {
      await this.client.send(command);
    } catch (error: any) {
      console.error('Error sending message to queue. Response:', queueName, error.$response);
      throw error;
    }
  }

  async receiveMessages(queueName: string): Promise<QueueMessage[]> {
    const command = new ReceiveMessageCommand(this.getQueueUrl(queueName));
    const response = await this.client.send(command);

    return ((response.Messages || []) as Message[]).map(msg => ({
      type: msg.MessageAttributes?.type?.StringValue as QueueMessageType,
      body: JSON.parse(msg.Body || '{}'),
      receiptHandle: msg.ReceiptHandle || ''
    }));
  }

  async deleteMessage(queueName: string, receiptHandle: string): Promise<void> {
    const command = new DeleteMessageCommand(this.getQueueUrl(queueName), receiptHandle);
    await this.client.send(command);
  }

  async close(): Promise<void> {
    // No cleanup needed for ElasticMQ client
  }
} 