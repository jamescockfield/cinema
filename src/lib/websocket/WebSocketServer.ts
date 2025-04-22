import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { Socket } from 'socket.io';
import { injectable, inject } from 'tsyringe';
import { EventRegistration, SocketEventHandler } from './types';

@injectable()
export class WebSocketServer {
  private io: SocketIOServer | null = null;
  private eventHandlers: Map<string, SocketEventHandler[]> = new Map();

  constructor(@inject('httpServer') private httpServer: HTTPServer) {}

  public initialize(): void {
    if (!this.io) {
      this.io = new SocketIOServer(this.httpServer, {
        path: '/ws',
        addTrailingSlash: false,
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
        transports: ['websocket'],
        allowEIO3: true,
      });

      this.setupSocketEvents();
    }
  }

  public registerEventHandler(registration: EventRegistration): void {
    const handlers = this.eventHandlers.get(registration.event) || [];
    handlers.push(registration.handler);
    this.eventHandlers.set(registration.event, handlers);
  }

  private setupSocketEvents(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected');

      socket.on('join', async (room: string) => {
        await socket.join(room);
        console.log(`Client joined room: ${room}`);

        const handlers = this.eventHandlers.get('join') || [];
        for (const handler of handlers) {
          try {
            await handler(room, socket);
          } catch (error) {
            console.error('Error in join handler:', error);
          }
        }
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

  public broadcast(room: string, event: string, data: any): void {
    if (!this.io) return;
    this.io.to(room).emit(event, data);
  }
}
