import 'reflect-metadata';
import { container } from 'tsyringe';
import { Redis } from 'ioredis';
import { RedisClient } from './lib/redis/RedisClient';
import { ScreenAvailabilityService } from './lib/availability/ScreenAvailabilityService';
import { WebSocketServer } from './lib/websocket/WebSocketServer';

const appContainer = container.createChildContainer();

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});
appContainer.registerInstance(Redis, redis);

appContainer.register<RedisClient>(RedisClient, {
  useClass: RedisClient,
});

appContainer.register<ScreenAvailabilityService>(ScreenAvailabilityService, {
  useClass: ScreenAvailabilityService,
});

appContainer.register<WebSocketServer>(WebSocketServer, {
  useClass: WebSocketServer,
});

appContainer.registerInstance('httpServer', {});

export { appContainer as container };
