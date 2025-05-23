import { APIGatewayProxyHandler } from 'aws-lambda';
import { ConnectionRepository } from '../repositories/ConnectionRepository';

const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE!;
// const connectionRepository = new ConnectionRepository(CONNECTIONS_TABLE);

export const handler: APIGatewayProxyHandler = async (event) => {
  const connectionId = event.requestContext.connectionId!;
  
  try {
    // await connectionRepository.storeConnection(connectionId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Connected' }),
    };
  } catch (error) {
    console.error('Error storing connection:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to connect' }),
    };
  }
}; 