import { v4 as uuidv4 } from 'uuid';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { RedisService } from 'src/redis/redis.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly redisService: RedisService) {}

  private clients = new Map<string, WebSocket>();
  private clientIds = new Map<WebSocket, string>();

  async handleConnection(client: WebSocket) {
    const id = uuidv4();
    this.clientIds.set(client, id);
    this.clients.set(id, client);

    client.on('message', (data: string) => {
      try {
        const payload = JSON.parse(data);
        const sessionId = payload.sessionId;
        if (sessionId) {
          this.clients.set(sessionId, client);
          this.clientIds.set(client, sessionId);
        } else {
          throw new Error('No sessionId provided');
        }
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    });
  }

  async handleDisconnect(client: WebSocket) {
    const sessionId = this.clientIds.get(client);
    if (sessionId || sessionId === null) {
      this.clients.delete(sessionId);
      this.clientIds.delete(client);
      this.redisService.redisClient.del(`chat_session:${sessionId}`);
      console.log('disconnected client with sessionId', sessionId);
    }
  }

  async sendUpdate(sessionId: string, update: any) {
    const client = this.clients.get(sessionId);
    if (update.error) {
      console.error('Error in update:', update.error);
      return;
    }
    if (client) {
      client.send(JSON.stringify(update));
    } else {
      console.error('No client found for sessionId', sessionId);
    }
  }
}
