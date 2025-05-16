import 'reflect-metadata';
import { ElasticMQClient } from '@/lib/queue/clients/ElasticMQClient';
import { QueueMessageType } from '@/lib/queue/types';
import { Config } from '@/lib/configuration';
import { container } from 'tsyringe';

describe('ElasticMQClient', () => {
  let queueClient: ElasticMQClient;
  const testQueueName = 'test-queue';

  beforeAll(async () => {
    container.registerInstance(Config, new Config());
    queueClient = container.resolve(ElasticMQClient);
    await queueClient.waitForReady();
    await queueClient.createQueue(testQueueName);
  });

  afterAll(async () => {
    await queueClient.close();
  });

  afterEach(async () => {
    // Clean up all messages by receiving and deleting them
    const messages = await queueClient.receiveMessages(testQueueName);
    await Promise.all(
      messages.map(msg => 
        msg.receiptHandle ? queueClient.deleteMessage(testQueueName, msg.receiptHandle) : Promise.resolve()
      )
    );
  });

  describe('connection', () => {
    it('should successfully connect to ElasticMQ', async () => {
      expect(queueClient).toBeDefined();
      expect(queueClient instanceof ElasticMQClient).toBe(true);
    });
  });

  describe('message operations', () => {
    it('should send and receive a message successfully', async () => {
      // Arrange
      const testMessage = {
        type: QueueMessageType.RESERVE_BOOKING,
        body: {
          screenId: 1,
          seatId: 1
        }
      };

      // Act
      await queueClient.sendMessage(testQueueName, testMessage);
      const messages = await queueClient.receiveMessages(testQueueName);

      // Assert
      expect(messages.length).toBeGreaterThan(0);
      expect(messages[0].receiptHandle).toBeDefined();
      expect(messages[0]).toMatchObject(testMessage);
    });

    it('should handle receiving messages from an empty queue', async () => {
      const messages = await queueClient.receiveMessages(testQueueName);
      expect(messages).toHaveLength(0);
    });
  });
}); 