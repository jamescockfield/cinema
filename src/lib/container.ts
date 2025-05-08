import 'reflect-metadata';
import { container } from 'tsyringe';
import { Redis } from 'ioredis';
import { SQSClient } from '@aws-sdk/client-sqs';
import { config } from './configuration';
import { QueueClient } from './queue/clients/QueueClient';
import { SQSQueueClient } from './queue/clients/SQSQueueClient';
import { RabbitMQClient } from './queue/clients/RabbitMQClient';

const appContainer = container.createChildContainer();

appContainer.registerInstance('Config', config);

appContainer.registerInstance(
  Redis,
  new Redis({
    host: config.redis.host,
    port: config.redis.port,
  })
);

let queueClient: QueueClient;
if (config.isDevelopment) {
  queueClient = new RabbitMQClient(config.queue.endpoint);
} else {
  const sqsClient = new SQSClient({
    endpoint: config.queue.endpoint,
    region: config.queue.region,
    credentials: {
      accessKeyId: 'dummy',
      secretAccessKey: 'dummy',
    },
  });
  queueClient = new SQSQueueClient(sqsClient);
}

appContainer.registerInstance<QueueClient>('QueueClient', queueClient);

export { appContainer as container };
