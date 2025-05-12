import 'dotenv/config';

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
    rabbitmq: {
      url: string;
    };
    sqs: {
      endpoint: string;
      region: string;
    };
    elasticmq: {
      url: string;
    };
  };
}

export const config: Config = {
  isDevelopment: process.env.ENVIRONMENT === 'development',
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
    rabbitmq: {
      url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
    },
    sqs: {
      endpoint: process.env.SQS_ENDPOINT || 'http://localhost:4566',
      region: process.env.AWS_REGION || 'us-east-1',
    },
    elasticmq: {
      url: process.env.ELASTICMQ_URL || 'http://localhost:9324',
    },
  },
};
