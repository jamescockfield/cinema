import { injectable, inject } from 'tsyringe';
import * as amqp from 'amqp-connection-manager';
import { Message } from 'amqplib';
import { QueueClient } from './QueueClient';
import { QueueMessage } from '@/lib/queue/types';
import { Config } from '@/lib/configuration';

@injectable()
export class RabbitMQClient implements QueueClient {
  private connectionManager: amqp.AmqpConnectionManager;
  private channel: amqp.ChannelWrapper;
  private isReady: boolean = false;

  constructor(
    @inject(Config) private readonly config: Config
  ) {
    console.log(config.queue.rabbitmq.url);
    this.connectionManager = amqp.connect([config.queue.rabbitmq.url]);
    this.channel = this.connectionManager.createChannel();
  }

  async waitForReady(): Promise<void> {
    if (this.isReady) return;

    let timeoutId: NodeJS.Timeout;
    const timeout = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('Timeout waiting for RabbitMQ connection and channel')), 30000);
    });

    const connect = new Promise<void>((resolve, reject) => {
      this.connectionManager.on('connect', async () => {
        try {
          await this.channel.waitForConnect();
          clearTimeout(timeoutId);
          this.isReady = true;
          resolve();
        } catch (err) {
          clearTimeout(timeoutId);
          reject(err);
        }
      });
      this.connectionManager.on('error', (err) => {
        clearTimeout(timeoutId);
        reject(err);
      });
    });

    await Promise.race([connect, timeout]);
  }

  async sendMessage(queueName: string, message: any): Promise<void> {
    await this.channel.assertQueue(queueName);
    await this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  }

  async receiveMessages(queueName: string, maxMessages: number = 10, waitTimeSeconds: number = 20): Promise<QueueMessage[]> {
    await this.channel.assertQueue(queueName);

    const messages: QueueMessage[] = [];
    for (let i = 0; i < maxMessages; i++) {
      const msg = await this.channel.get(queueName);
      if (!msg) break;

      messages.push({
        type: msg.properties.type || '',
        body: JSON.parse(msg.content.toString()),
        receiptHandle: msg.fields.deliveryTag.toString(),
      });
    }

    return messages;
  }

  async deleteMessage(queueName: string, receiptHandle: string): Promise<void> {
    const msg = { fields: { deliveryTag: parseInt(receiptHandle) } } as Message;
    await this.channel.ack(msg);
  }

  async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    await this.connectionManager.close();
  }

  async createQueue(queueName: string): Promise<void> {
    await this.channel.assertQueue(queueName, {
      durable: true,
      arguments: {
        'x-message-ttl': 86400000 // 1 day in milliseconds
      }
    });
  }
} 