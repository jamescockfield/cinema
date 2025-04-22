import 'reflect-metadata';
import { container } from 'tsyringe';
import { Redis } from 'ioredis';
import { RedisClient } from './lib/redis/RedisClient';
import { ScreenAvailabilityService } from './lib/availability/ScreenAvailabilityService';
import { WebSocketServer } from './lib/websocket/WebSocketServer';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

container.registerInstance(RedisClient, new RedisClient(redis));

container.registerSingleton(ScreenAvailabilityService);

container.registerSingleton(WebSocketServer);

export { container };
