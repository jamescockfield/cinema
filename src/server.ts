import 'reflect-metadata';
import { createServer } from 'http';
import next from 'next';
import { container } from './container';
import { ScreenAvailabilityCache } from './lib/availability/ScreenAvailabilityCache';
import { getSocketIoServer } from './lib/websocket/getSocketIoServer';
import { WebSocketServer } from './lib/websocket/WebSocketServer';
import { ScreenAvailabilityService } from './lib/availability/ScreenAvailabilityService';
import { SocketServer } from './lib/websocket/types';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

async function startServer() {
  const server = createServer(async (req, res) => {
    if (!server.io) {
      console.log('Initializing Socket.IO server for this instance');
      server.io = await getSocketIoServer(server);
      container.registerInstance(WebSocketServer, new WebSocketServer(server.io));
      container.resolve(ScreenAvailabilityService); // register availability broadcasts over socket
    }

    return app.getRequestHandler()(req, res);
  }) as SocketServer;

  const port = parseInt(process.env.PORT || '3000', 10);
  server.listen(port, () => {
    console.log(`Server ready on http://localhost:${port}`);
  });

  await seedScreenAvailability();
}

const seedScreenAvailability = async () => {
  const cache = container.resolve(ScreenAvailabilityCache);

  await cache.setSeatAvailability(1, [
    { id: 1, available: true },
    { id: 2, available: true },
    { id: 3, available: true },
    { id: 4, available: true },
    { id: 5, available: true },
    { id: 6, available: true },
    { id: 7, available: false },
    { id: 8, available: false },
    { id: 9, available: true },
    { id: 10, available: true },
    { id: 11, available: true },
    { id: 12, available: true },
    { id: 13, available: true },
    { id: 14, available: true },
    { id: 15, available: true },
    { id: 16, available: true },
  ]);
};

app.prepare().then(startServer);
