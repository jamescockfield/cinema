import type { Socket } from 'socket.io';

export type SocketEventHandler = (room: string, socket: Socket) => Promise<void>;

export interface EventRegistration {
  event: string;
  handler: SocketEventHandler;
}
