import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { RedisConfig } from './services/RedisClient';
import { container } from './container';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const redisConfig: RedisConfig = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
};

app.prepare().then(async () => {
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

    // Initialize services
    const redis = container.initializeRedis(redisConfig);
    const redisClient = container.initializeRedisClient(redis);
    const screenAvailabilityService = container.initializeScreenAvailability(redisClient);
    const wsServer = container.initializeWebSocketServer(server, screenAvailabilityService);

    await seedScreenAvailability(screenAvailabilityService);

    const port = parseInt(process.env.PORT || '3000', 10);
    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
}); 

const seedScreenAvailability = async (service: any) => {
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
}
