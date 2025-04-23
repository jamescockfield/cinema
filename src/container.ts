import 'reflect-metadata';
import { container } from 'tsyringe';
import { Redis } from 'ioredis';

const appContainer = container.createChildContainer();

appContainer.registerInstance(
  Redis,
  new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  })
);

export { appContainer as container };
