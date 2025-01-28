import { io, Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '../types/socket';

export const createSocket = (token: string): Socket<ServerToClientEvents, ClientToServerEvents> => {
  return io(import.meta.env.VITE_WS_URL, {
    auth: { token },
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });
};