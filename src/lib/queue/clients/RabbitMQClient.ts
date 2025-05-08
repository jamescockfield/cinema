import { injectable } from 'tsyringe';
import * as amqp from 'amqp-connection-manager';
import { Message } from 'amqplib';
import { QueueClient, QueueMessage } from './QueueClient';

@injectable()
export class RabbitMQClient implements QueueClient {
  private connectionManager: amqp.AmqpConnectionManager;
  private channel: amqp.ChannelWrapper;

  constructor(private readonly url: string) {
    this.connectionManager = amqp.connect([url]);
    this.channel = this.connectionManager.createChannel();
  }

  async sendMessage(queueUrl: string, message: any): Promise<void> {
    const queueName = this.getQueueNameFromUrl(queueUrl);
    await this.channel.assertQueue(queueName);
    await this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  }

  async receiveMessages(queueUrl: string, maxMessages: number = 10, waitTimeSeconds: number = 20): Promise<QueueMessage[]> {
    const queueName = this.getQueueNameFromUrl(queueUrl);
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

  async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
    const queueName = this.getQueueNameFromUrl(queueUrl);
    const msg = { fields: { deliveryTag: parseInt(receiptHandle) } } as Message;
    await this.channel.ack(msg);
  }

  private getQueueNameFromUrl(queueUrl: string): string {
    // Extract queue name from URL (e.g., http://localhost:5672/queue/booking-queue -> booking-queue)
    const parts = queueUrl.split('/');
    return parts[parts.length - 1];
  }

  async close(): Promise<void> {
    await this.connectionManager.close();
  }
} 