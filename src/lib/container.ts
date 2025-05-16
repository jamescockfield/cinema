import 'reflect-metadata';
import { container } from 'tsyringe';
import { Redis } from 'ioredis';
import { SQSClient } from '@aws-sdk/client-sqs';
import { Config } from './configuration';
import { QueueClient } from './queue/clients/QueueClient';
import { SQSQueueClient } from './queue/clients/SQSQueueClient';
import { ElasticMQClient } from './queue/clients/ElasticMQClient';

const appContainer = container.createChildContainer();

// Define type-safe token for QueueClient
const QueueClientToken = Symbol('QueueClient');

const config = new Config();
appContainer.registerInstance(Config, config);

// Register Redis as a singleton with lazy initialization
let redisInstance: Redis | null = null;
appContainer.register(Redis, {
  useFactory: () => {
    if (!redisInstance) {
      redisInstance = new Redis({
        host: config.redis.host,
        port: config.redis.port,
      });
    }
    return redisInstance;
  }
});

// Register QueueClient as a singleton with lazy initialization
let queueInstance: QueueClient | null = null;
appContainer.register(QueueClientToken, {
  useFactory: () => {
    if (!queueInstance) {
      if (config.isDevelopment) {
        queueInstance = new ElasticMQClient(config);
      } else {
        const sqsClient = new SQSClient({
          endpoint: config.queue.sqs.endpoint,
          region: config.queue.sqs.region,
          credentials: {
            accessKeyId: 'dummy',
            secretAccessKey: 'dummy',
          },
        });
        queueInstance = new SQSQueueClient(config, sqsClient);
      }
    }
    return queueInstance;
  }
});

export { appContainer as container, QueueClientToken };
