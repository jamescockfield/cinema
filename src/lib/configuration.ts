export interface Config {
  isDevelopment: boolean;
  aws: {
    region: string;
  };
  http: {
    host: string;
    port: number;
  };
  socket: {
    port: number;
  };
  redis: {
    host: string;
    port: number;
  };
  queue: {
    endpoint: string;
    region: string;
  };
}

export const config: Config = {
  isDevelopment: process.env.NODE_ENV === 'development',
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
  },
  http: {
    host: process.env.HTTP_HOST || 'localhost',
    port: parseInt(process.env.HTTP_PORT || '3000'),
  },
  socket: {
    port: parseInt(process.env.SOCKET_PORT || '3001'),
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  queue: {
    endpoint: process.env.QUEUE_ENDPOINT || 'http://localhost:9324',
    region: process.env.AWS_REGION || 'us-east-1',
  },
};
