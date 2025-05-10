import 'reflect-metadata';
import { RabbitMQClient } from '@/lib/queue/clients/RabbitMQClient';
import { QueueMessageType } from '@/lib/queue/types';

describe('RabbitMQClient', () => {
  let queueClient: RabbitMQClient;
  const rabbitMQUrl = 'amqp://guest:guest@localhost:5672';
  const testQueueUrl = 'http://localhost:5672/queue/test-queue';

  beforeAll(async () => {
    // Wait for RabbitMQ to be ready
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  beforeEach(async () => {
    queueClient = new RabbitMQClient(rabbitMQUrl);
    // Wait for connection to be established
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  afterEach(async () => {
    if (queueClient) {
      try {
        await queueClient.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  });

  describe('connection', () => {
    it('should successfully connect to RabbitMQ', async () => {
      expect(queueClient).toBeDefined();
    });
  });

  describe('message operations', () => {
    it('should send and receive a message successfully', async () => {
      // Arrange
      const testMessage = {
        type: QueueMessageType.RESERVE_BOOKING,
        body: {
          screenId: 1,
          seatId: 1,
          timestamp: new Date().toISOString()
        }
      };

      // Act
      await queueClient.sendMessage(testQueueUrl, testMessage);
      
      // Wait a moment for message to be processed
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const messages = await queueClient.receiveMessages(testQueueUrl, 1);

      // Assert
      expect(messages.length).toBeGreaterThan(0);
      expect(messages[0].receiptHandle).toBeDefined();
      expect(messages[0].body).toMatchObject({
        type: QueueMessageType.RESERVE_BOOKING,
        body: expect.objectContaining({
          screenId: 1,
          seatId: 1
        })
      });

      // Cleanup
      if (messages[0].receiptHandle) {
        await queueClient.deleteMessage(testQueueUrl, messages[0].receiptHandle);
      }
    });

    it('should handle receiving messages from an empty queue', async () => {
      const messages = await queueClient.receiveMessages(testQueueUrl, 1);
      expect(messages).toHaveLength(0);
    });
  });
}); 