import type { Message, DirectMessage } from './store';

export interface ServerToClientEvents {
  message: (message: Message) => void;
  direct_message: (message: DirectMessage) => void;
  user_status: (data: { userId: string; status: string }) => void;
  typing: (data: { userId: string; username: string; channelId: string }) => void;
  error: (message: string) => void;
  connect: () => void;
  disconnect: () => void;
  connect_error: (error: Error) => void;
  reconnect: (attemptNumber: number) => void;
  reconnect_attempt: (attemptNumber: number) => void;
}

export interface ClientToServerEvents {
  join_channel: (channelId: string) => void;
  leave_channel: (channelId: string) => void;
  message: (data: { channelId: string; content: string; guestName?: string }) => void;
  direct_message: (data: { recipientId: string; content: string }) => void;
  typing: (data: { channelId: string }) => void;
  status_change: (status: string) => void;
}

export interface SocketAuth {
  token?: string;
}
