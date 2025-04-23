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
        await Promise.all(handlers.map((handler) => handler(room, socket)));
      });

      socket.on(SocketEvent.LEAVE, (room: string) => {
        socket.leave(room);
        console.log(`Client left room: ${room}`);
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
