import { Server as SocketIOServer } from 'socket.io';
import type { Socket } from 'socket.io';
import { injectable, singleton } from 'tsyringe';
import { EventRegistration, SocketEventHandler, SocketEvent } from './types';

@injectable()
@singleton()
export class WebSocketServer {
  private eventHandlers: Map<SocketEvent, SocketEventHandler[]> = new Map();

  constructor(private io: SocketIOServer) {
    this.setupSocketEvents();
  }

  private setupSocketEvents(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected');

      socket.on(SocketEvent.JOIN, async (room: string) => {
        await socket.join(room);
        console.log(`Client joined room: ${room}`);

        const handlers = this.eventHandlers.get(SocketEvent.JOIN) || [];
        for (const handler of handlers) {
          try {
            await handler(room, socket);
          } catch (error) {
            console.error('Error in join handler:', error);
          }
        }
      });

      socket.on(SocketEvent.LEAVE, (room: string) => {
        socket.leave(room);
        console.log(`Client left room: ${room}`);
      });

      socket.on(SocketEvent.DISCONNECT, () => {
        console.log('Client disconnected');
      });

      socket.on(SocketEvent.ERROR, (err: Error) => {
        console.error('Socket error:', err);
      });
    });
  }

  public registerEventHandler(registration: EventRegistration): void {
    const handlers = this.eventHandlers.get(registration.event) || [];
    handlers.push(registration.handler);
    this.eventHandlers.set(registration.event, handlers);
  }

  public broadcast(room: string, event: string, data: any): void {
    this.io.to(room).emit(event, data);
  }
}
