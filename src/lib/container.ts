import 'reflect-metadata';
import { container } from 'tsyringe';
import { Redis } from 'ioredis';
import { SQSClient } from '@aws-sdk/client-sqs';
import { config } from './configuration';
import { QueueClient } from './queue/clients/QueueClient';
import { SQSQueueClient } from './queue/clients/SQSQueueClient';
import { ElasticMQClient } from './queue/clients/ElasticMQClient';

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
  queueClient = new ElasticMQClient(config);
} else {
  const sqsClient = new SQSClient({
    endpoint: config.queue.sqs.endpoint,
    region: config.queue.sqs.region,
    credentials: {
      accessKeyId: 'dummy',
      secretAccessKey: 'dummy',
    },
  });
  queueClient = new SQSQueueClient(config, sqsClient);
}

appContainer.registerInstance<QueueClient>('QueueClient', queueClient);

export { appContainer as container };
