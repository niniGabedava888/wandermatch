import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private chatService: ChatService,
    private jwtService: JwtService
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      client.data.user = payload;
      console.log(`Client connected: userId=${payload.id}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: userId=${client.data.user?.id}`);
  }

  // when client joins and emits joinRoom
  @SubscribeMessage('joinRoom')
  async handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { interestId: number }) {
    try {
      const userId = client.data.user?.id;
      if (!userId) return;

      await this.chatService.verifyAccess(data.interestId, userId);
      const room = `chat_${data.interestId}`;
      client.join(room);

      client.emit('joinedRoom', { interestId: data.interestId });
    } catch (error: any) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { interestId: number; content: string }
  ) {
    try {
      const userId = client.data.user?.id;
      if (!userId) return;

      if (!data.content.trim()) return;

      await this.chatService.verifyAccess(data.interestId, userId);

      const message = await this.chatService.saveMessage(
        data.interestId,
        userId,
        data.content.trim()
      );

      const room = `chat_${data.interestId}`;
      this.server.to(room).emit('newMessage', {
        id: message.id,
        content: message.content,
        senderId: userId,
        interestId: data.interestId,
        createdAt: message.createdAt,
      });
    } catch (error: any) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { interestId: number }
  ) {
    const room = `chat_${data.interestId}`;
    client.leave(room);
  }
}
