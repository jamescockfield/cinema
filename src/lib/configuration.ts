import 'dotenv/config';

export class Config {
  public readonly isDevelopment = process.env.ENVIRONMENT === 'development';
  
  public readonly aws = {
    region: process.env.AWS_REGION || 'us-east-1',
  } as const;
  
  public readonly http = {
    host: process.env.HTTP_HOST || 'localhost',
    port: parseInt(process.env.HTTP_PORT || '3000'),
  } as const;
  
  public readonly socket = {
    port: parseInt(process.env.SOCKET_PORT || '3001'),
  } as const;
  
  public readonly redis = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  } as const;
  
  public readonly queue = {
    rabbitmq: {
      url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
    } as const,
    sqs: {
      endpoint: process.env.SQS_ENDPOINT || 'http://localhost:4566',
      region: process.env.AWS_REGION || 'us-east-1',
    } as const,
    elasticmq: {
      url: process.env.ELASTICMQ_URL || 'http://localhost:9324',
    } as const,
  } as const;
}