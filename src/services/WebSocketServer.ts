import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { Socket } from 'socket.io';
import { ScreenAvailabilityService } from './ScreenAvailabilityService';

export class WebSocketServer {
    private io: SocketIOServer;

    constructor(
        httpServer: HTTPServer,
        private screenAvailabilityService: ScreenAvailabilityService
    ) {
        this.io = new SocketIOServer(httpServer, {
            path: '/api/ws',
            addTrailingSlash: false,
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        this.setupSocketEvents();
    }

    private setupSocketEvents(): void {
        this.io.on('connection', (socket: Socket) => {
            console.log('Client connected');

            socket.on('join', async (room: string) => {
                await socket.join(room);
                console.log(`Client joined room: ${room}`);
                const screenId = parseInt(room.split(':')[1]);
                this.broadcastSeatUpdate(screenId, await this.screenAvailabilityService.getSeatAvailability(screenId));
            });

            socket.on('leave', (room: string) => {
                socket.leave(room);
                console.log(`Client left room: ${room}`);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });

            socket.on('error', (err: Error) => {
                console.error('Socket error:', err);
            });
        });
    }

    getIO(): SocketIOServer {
        return this.io;
    }

    broadcastSeatUpdate(screenId: number, seats: any[]): void {
        this.io.to(`screen:${screenId}`).emit('seatUpdate', { seats });
    }
} 