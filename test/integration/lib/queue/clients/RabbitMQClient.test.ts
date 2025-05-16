import 'reflect-metadata';
import { RabbitMQClient } from '@/lib/queue/clients/RabbitMQClient';
import { QueueMessageType } from '@/lib/queue/types';
import { Config } from '@/lib/configuration';
import { container } from 'tsyringe';

describe.skip('RabbitMQClient', () => {
  let queueClient: RabbitMQClient;
  const testQueueName = 'test-queue';

  beforeAll(async () => {
    container.registerInstance(Config, new Config());
    queueClient = container.resolve(RabbitMQClient);
    await queueClient.waitForReady();
  });

  afterAll(async () => {
    await queueClient.close();
  });

  describe('connection', () => {
    it('should successfully connect to RabbitMQ', async () => {
      expect(queueClient).toBeDefined();
      expect(queueClient instanceof RabbitMQClient).toBe(true);
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
      await queueClient.sendMessage(testQueueName, testMessage);
      const messages = await queueClient.receiveMessages(testQueueName, 1);

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
        await queueClient.deleteMessage(testQueueName, messages[0].receiptHandle);
      }
    });

    it('should handle receiving messages from an empty queue', async () => {
      const messages = await queueClient.receiveMessages(testQueueName, 1);
      expect(messages).toHaveLength(0);
    });
  });
}); 