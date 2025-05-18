import { ApiGatewayManagementApi } from 'aws-sdk';
import { injectable, inject } from 'tsyringe';
import { Config } from '@/lib/configuration';

@injectable()
export class ApiGatewayClient {
  private api: ApiGatewayManagementApi;

  constructor(@inject(Config) private readonly config: Config) {
    this.api = new ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: process.env.WEBSOCKET_API_ENDPOINT,
    });
  }

  async postToConnection(connectionId: string, data: any): Promise<void> {
    try {
      await this.api.postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(data),
      }).promise();
    } catch (error: any) {
      // If the connection is stale, we can ignore the error
      if (error.statusCode === 410) {
        console.log(`Connection ${connectionId} is stale`);
        return;
      }
      throw error;
    }
  }

  async broadcast(connectionIds: string[], event: string, data: any): Promise<void> {
    const message = { event, data };
    await Promise.all(
      connectionIds.map(connectionId => this.postToConnection(connectionId, message))
    );
  }
} 