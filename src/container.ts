import 'reflect-metadata';
import { container } from 'tsyringe';
import { Redis } from 'ioredis';
import { SQSClient } from '@aws-sdk/client-sqs';

const appContainer = container.createChildContainer();

appContainer.registerInstance(
  Redis,
  new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  })
);

appContainer.registerInstance(
  SQSClient,
  new SQSClient({
    endpoint: process.env.ELASTICMQ_ENDPOINT || 'http://localhost:9324',
    region: 'us-east-1', // ElasticMQ doesn't care about the region
    credentials: {
      accessKeyId: 'dummy',
      secretAccessKey: 'dummy',
    },
  })
);

export { appContainer as container };
