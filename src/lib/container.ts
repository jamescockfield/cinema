import 'reflect-metadata';
import { container } from 'tsyringe';
import { Redis } from 'ioredis';
import { SQSClient } from '@aws-sdk/client-sqs';
import { config } from './configuration';

const appContainer = container.createChildContainer();

appContainer.registerInstance('Config', config);

appContainer.registerInstance(
  Redis,
  new Redis({
    host: config.redis.host,
    port: config.redis.port,
  })
);

appContainer.registerInstance(
  SQSClient,
  new SQSClient({
    endpoint: config.elasticmq.endpoint,
    region: config.elasticmq.region,
    credentials: {
      accessKeyId: 'dummy',
      secretAccessKey: 'dummy',
    },
  })
);

export { appContainer as container };
