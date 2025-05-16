import {
  SendMessageCommand as AWSSendMessageCommand,
  ReceiveMessageCommand as AWSReceiveMessageCommand,
  DeleteMessageCommand as AWSDeleteMessageCommand,
  CreateQueueCommand as AWSCreateQueueCommand,
  ListQueuesCommand as AWSListQueuesCommand,
} from '@aws-sdk/client-sqs';
import { QueueMessage } from '@/lib/queue/types';

// Default configuration values
const DEFAULT_MAX_MESSAGES = 10;
// const DEFAULT_WAIT_TIME_SECONDS = 20;
const DEFAULT_WAIT_TIME_SECONDS = 0;
const DEFAULT_VISIBILITY_TIMEOUT = '30';
const DEFAULT_MESSAGE_RETENTION_PERIOD = '86400'; // 1 day

export class SendMessageCommand extends AWSSendMessageCommand {
  constructor(queueUrl: string, message: QueueMessage) {
    super({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message.body),
      MessageAttributes: message?.type ? {
        type: {
          DataType: 'String',
          StringValue: message.type
        }
      } : undefined
    });
  }
}

export class ReceiveMessageCommand extends AWSReceiveMessageCommand {
  constructor(queueUrl: string) {
    super({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: DEFAULT_MAX_MESSAGES,
      WaitTimeSeconds: DEFAULT_WAIT_TIME_SECONDS,
      MessageAttributeNames: ['All']
    });
  }
}

export class DeleteMessageCommand extends AWSDeleteMessageCommand {
  constructor(queueUrl: string, receiptHandle: string) {
    super({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle
    });
  }
}

export class CreateQueueCommand extends AWSCreateQueueCommand {
  constructor(queueName: string) {
    super({
      QueueName: queueName,
      Attributes: {
        VisibilityTimeout: DEFAULT_VISIBILITY_TIMEOUT,
        MessageRetentionPeriod: DEFAULT_MESSAGE_RETENTION_PERIOD
      }
    });
  }
}

export class ListQueuesCommand extends AWSListQueuesCommand {
  constructor() {
    super({});
  }
} 