export interface QueueMessage {
  type: string;
  body: any;
  receiptHandle?: string;
}

export interface QueueClient {
  sendMessage(queueUrl: string, message: any): Promise<void>;
  receiveMessages(queueUrl: string, maxMessages?: number, waitTimeSeconds?: number): Promise<QueueMessage[]>;
  deleteMessage(queueUrl: string, receiptHandle: string): Promise<void>;
} 