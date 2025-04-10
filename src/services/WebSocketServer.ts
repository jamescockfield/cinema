import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { Socket } from 'socket.io';
import { ScreenAvailabilityService } from './ScreenAvailabilityService';

export class WebSocketServer {
    private static instance: WebSocketServer;
    private io: SocketIOServer;

    private constructor(httpServer: HTTPServer) {
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

            // Handle room joining/leaving
            socket.on('join', (room: string) => {
                socket.join(room);
                const screenId = parseInt(room.split(':')[1]);
                this.broadcastSeatUpdate(screenId, ScreenAvailabilityService.getInstance().getSeatAvailability(screenId));
                console.log(`Client joined room: ${room}`);
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

    static getInstance(httpServer: HTTPServer | null = null): WebSocketServer {
        if (!WebSocketServer.instance) {
            if (!httpServer) {
                throw new Error('httpServer is required to init the WebSocketServer');
            }
            WebSocketServer.instance = new WebSocketServer(httpServer);
        }
        return WebSocketServer.instance;
    }

    getIO(): SocketIOServer {
        return this.io;
    }

    // Method to broadcast seat updates to a specific screen room
    broadcastSeatUpdate(screenId: number, seats: any[]): void {
        this.io.to(`screen:${screenId}`).emit('seatUpdate', { seats });
    }
} 