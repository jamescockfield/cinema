import { DynamoDB } from 'aws-sdk';

export class ConnectionRepository {
  private readonly dynamoDB: DynamoDB.DocumentClient;
  private readonly tableName: string;

  constructor(tableName: string) {
    this.dynamoDB = new DynamoDB.DocumentClient();
    this.tableName = tableName;
  }

  async storeConnection(connectionId: string): Promise<void> {
    await this.dynamoDB.put({
      TableName: this.tableName,
      Item: {
        connectionId,
        timestamp: Date.now(),
        ttl: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours TTL
      },
    }).promise();
  }

  async removeConnection(connectionId: string): Promise<void> {
    await this.dynamoDB.delete({
      TableName: this.tableName,
      Key: {
        connectionId,
      },
    }).promise();
  }

  async getAllConnections(): Promise<string[]> {
    const result = await this.dynamoDB.scan({
      TableName: this.tableName,
      ProjectionExpression: 'connectionId',
    }).promise();

    return (result.Items || []).map(item => item.connectionId);
  }
} 