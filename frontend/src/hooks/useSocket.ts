import { useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { useStore } from '../store/useStore';
import type { ServerToClientEvents, ClientToServerEvents } from '../types/socket';
import type { Message, DirectMessage } from '../types/store';
import { SOCKET_IO_URL } from '../config/constants';
import { toast } from 'sonner';
import { api } from '../services/api';

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;
const RECONNECT_DECAY = 1.5;

export function useSocket() {
  const socketRef = useRef<TypedSocket | null>(null);
  const { token, addMessage, setError, set } = useStore();
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const maxReconnectAttempts = 10;

  const sendMessage = (channelId: string, content: string, guestName?: string) => {
    socketRef.current?.emit('message', { channelId, content, guestName });
  };

  const sendDirectMessage = async (content: string, recipientId: string) => {
    try {
      const response = await api.post(`/dm/${recipientId}`, { content });
      set((state) => ({
        ...state,
        messages: [...state.messages, response.data],
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const reconnectWithBackoff = () => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      setError('Connection failed after maximum attempts. Please refresh the page.');
      return;
    }

    const delay = Math.min(
      INITIAL_RECONNECT_DELAY * Math.pow(RECONNECT_DECAY, reconnectAttemptsRef.current),
      MAX_RECONNECT_DELAY
    );

    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectAttemptsRef.current++;
      initializeSocket();
    }, delay);
  };

  const initializeSocket = () => {
    if (!token) return;

    // Clean up existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io(SOCKET_IO_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: INITIAL_RECONNECT_DELAY,
      reconnectionDelayMax: MAX_RECONNECT_DELAY,
      timeout: 10000,
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      reconnectAttemptsRef.current = 0;
      setError(null);
      toast.success('Connected to chat server');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError('Connection error. Retrying...');
      reconnectWithBackoff();
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, attempt reconnect
        socket.connect();
      } else if (reason === 'transport close' || reason === 'ping timeout') {
        reconnectWithBackoff();
      }
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
      setError(null);
      toast.success('Reconnected to chat server');
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      toast.info(`Attempting to reconnect (${attemptNumber}/${maxReconnectAttempts})`);
    });

    socket.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
      reconnectWithBackoff();
    });

    socket.on('message', (message: Message) => {
      addMessage(message);
    });

    socketRef.current = socket;
  };

  useEffect(() => {
    initializeSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  return {
    socket: socketRef.current,
    sendMessage,
    sendDirectMessage,
    isConnected: socketRef.current?.connected || false
  };
}