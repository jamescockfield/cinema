import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketServer } from './services/WebSocketServer';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

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

    const wsServer = WebSocketServer.getInstance(server);

    const port = parseInt(process.env.PORT || '3000', 10);
    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
}); 