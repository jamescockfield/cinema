import type { Socket } from 'socket.io';

export enum SocketEvent {
  JOIN = 'join',
  LEAVE = 'leave',
  DISCONNECT = 'disconnect',
  ERROR = 'error',
}

export enum RoomType {
  SCREEN = 'screen',
}

export type SocketEventHandler = (room: string, socket: Socket) => Promise<void>;

export interface EventRegistration {
  event: SocketEvent;
  handler: SocketEventHandler;
}
