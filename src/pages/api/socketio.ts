import { container } from '../../container';
import { getSocketIoServer } from '../../lib/websocket/SocketIoServerFactory';
import { WebSocketServer } from '../../lib/websocket/WebSocketServer';

export default function SocketIO(req: any, res: any) {
  if (!res.socket.server.io) {
    res.socket.server.io = getSocketIoServer(res.socket.server);

    container.registerInstance(WebSocketServer, new WebSocketServer(res.socket.server.io));
  }
  res.end();
}
