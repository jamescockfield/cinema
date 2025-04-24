import 'reflect-metadata';
import { createServer } from 'http';
import next from 'next';
import { container } from './lib/container';
import { ScreenAvailabilityCache } from './lib/availability/ScreenAvailabilityCache';
import { getSocketIoServer } from './lib/websocket/getSocketIoServer';
import { WebSocketServer } from './lib/websocket/WebSocketServer';
import { ScreenAvailabilityUpdater } from './lib/availability/ScreenAvailabilityUpdater';
import { QueueManager } from './lib/queue/QueueManager';
import { config } from './lib/configuration';

const app = next({ dev: config.isDevelopment });

async function startServer() {
  const server = createServer(app.getRequestHandler());

  const io = await getSocketIoServer(server);
  container.registerInstance(WebSocketServer, new WebSocketServer(io));
  container.resolve(ScreenAvailabilityUpdater); // register availability broadcasts over socket

  // Start the booking message subscriber
  const queueManager = container.resolve(QueueManager);
  await queueManager.startPolling();

  server.listen(config.http.port, () => {
    console.log(`Server ready on http://${config.http.host}:${config.http.port}`);
  });

  await seedScreenAvailability();
}

const seedScreenAvailability = async () => {
  const cache = container.resolve(ScreenAvailabilityCache);

  await cache.setScreenAvailability(1, [
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
