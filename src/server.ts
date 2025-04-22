import 'reflect-metadata';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { container } from './container';
import { ScreenAvailabilityService } from './lib/availability/ScreenAvailabilityService';
import { WebSocketServer } from './lib/websocket/WebSocketServer';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

async function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling request:', err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });

  container.registerInstance('httpServer', server);

  const wsServer = container.resolve(WebSocketServer);
  wsServer.initialize();
  console.log('WebSocket server ready on http://localhost:3000/ws');

  const port = parseInt(process.env.PORT || '3000', 10);
  server.listen(port, () => {
    console.log(`Server ready on http://localhost:${port}`);
  });

  await seedScreenAvailability();
}

const seedScreenAvailability = async () => {
  const service = container.resolve(ScreenAvailabilityService);

  await service.updateSeatAvailability(1, 1, true);
  await service.updateSeatAvailability(1, 2, true);
  await service.updateSeatAvailability(1, 3, true);
  await service.updateSeatAvailability(1, 4, true);
  await service.updateSeatAvailability(1, 5, true);
  await service.updateSeatAvailability(1, 6, true);
  await service.updateSeatAvailability(1, 7, false);
  await service.updateSeatAvailability(1, 8, false);
  await service.updateSeatAvailability(1, 9, true);
  await service.updateSeatAvailability(1, 10, true);
  await service.updateSeatAvailability(1, 11, true);
  await service.updateSeatAvailability(1, 12, true);
  await service.updateSeatAvailability(1, 13, true);
  await service.updateSeatAvailability(1, 14, true);
  await service.updateSeatAvailability(1, 15, true);
  await service.updateSeatAvailability(1, 16, true);
};

app.prepare().then(startServer);
