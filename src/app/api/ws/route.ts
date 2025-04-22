import { NextRequest } from 'next/server';
import type { NextApiResponseWithSocket } from '@/types/next';
import { container } from '@/container';
import { WebSocketServer } from '@/lib/websocket/WebSocketServer';

export async function GET(req: NextRequest, res: NextApiResponseWithSocket) {
    if (!res.socket?.server?.io) {
        const wsServer = container.resolve(WebSocketServer);
        res.socket.server.io = wsServer.getIO();
    }

    return new Response(null, { status: 200 });
}