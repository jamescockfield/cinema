import { Redis } from 'ioredis';
import { RedisConfig, RedisClient } from './services/RedisClient';
import { ScreenAvailabilityService } from './services/ScreenAvailabilityService';
import { WebSocketServer } from './services/WebSocketServer';
import { Server } from 'http';

export interface AppServices {
  redis: Redis;
  redisClient: RedisClient;
  screenAvailability: ScreenAvailabilityService;
  webSocketServer: WebSocketServer;
}

export class Container {
  private services: Partial<AppServices> = {};

  constructor() {}

  public initializeRedis(config: RedisConfig): Redis {
    const redis = new Redis(config);
    this.services.redis = redis;
    return redis;
  }

  public initializeRedisClient(redis: Redis): RedisClient {
    const client = new RedisClient(redis);
    this.services.redisClient = client;
    return client;
  }

  public initializeScreenAvailability(redisClient: RedisClient): ScreenAvailabilityService {
    const service = new ScreenAvailabilityService(redisClient);
    this.services.screenAvailability = service;
    return service;
  }

  public initializeWebSocketServer(server: Server, screenAvailabilityService: ScreenAvailabilityService): WebSocketServer {
    const wsServer = new WebSocketServer(server, screenAvailabilityService);
    this.services.webSocketServer = wsServer;
    return wsServer;
  }

  public getRedis(): Redis {
    if (!this.services.redis) {
      throw new Error('Redis not initialized');
    }
    return this.services.redis;
  }

  public getRedisClient(): RedisClient {
    if (!this.services.redisClient) {
      throw new Error('RedisClient not initialized');
    }
    return this.services.redisClient;
  }

  public getScreenAvailability(): ScreenAvailabilityService {
    if (!this.services.screenAvailability) {
      throw new Error('ScreenAvailabilityService not initialized');
    }
    return this.services.screenAvailability;
  }

  public getWebSocketServer(): WebSocketServer {
    if (!this.services.webSocketServer) {
      throw new Error('WebSocketServer not initialized');
    }
    return this.services.webSocketServer;
  }
}

// Export a singleton instance
export const container = new Container(); 