import { NextRequest } from 'next/server';
import type { NextApiResponseWithSocket } from '@/types/next';
import { WebSocketServer } from '@/services/WebSocketServer';

export async function GET(req: NextRequest, res: NextApiResponseWithSocket) {
    if (!res.socket?.server?.io) {
        res.socket.server.io = WebSocketServer.getInstance().getIO();
    }

    return new Response(null, { status: 200 });
}