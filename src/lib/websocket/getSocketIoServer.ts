import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server } from 'socket.io';

export const getSocketIoServer = (httpServer: any) => {
  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();

  return new Server(httpServer, {
    path: '/ws',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket'],
    allowEIO3: true,
    adapter: createAdapter(pubClient, subClient),
  });
};
