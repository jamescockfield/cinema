import { QueueMessage } from '../types';

export interface QueueClient {
  waitForReady(): Promise<void>;
  createQueue(queueName: string): Promise<void>;
  sendMessage(queueName: string, message: QueueMessage): Promise<void>;
  receiveMessages(queueName: string): Promise<QueueMessage[]>;
  deleteMessage(queueName: string, receiptHandle: string): Promise<void>;
  close(): Promise<void>;
} 