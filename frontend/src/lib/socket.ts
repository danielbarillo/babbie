import { io, Socket } from 'socket.io-client';
import { Message } from '../types/messages';

export class SocketService {
  private socket: Socket | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];

  connect(token: string) {
    this.socket = io(import.meta.env.VITE_WS_URL, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('message', (message: Message) => {
      this.messageHandlers.forEach(handler => handler(message));
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onMessage(handler: (message: Message) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  sendMessage(channelId: string, content: string) {
    if (!this.socket) return;
    this.socket.emit('message', { channelId, content });
  }

  joinChannel(channelId: string) {
    if (!this.socket) return;
    this.socket.emit('join_channel', channelId);
  }

  leaveChannel(channelId: string) {
    if (!this.socket) return;
    this.socket.emit('leave_channel', channelId);
  }
}

export const socketService = new SocketService();