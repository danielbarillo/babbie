import { useEffect, useRef } from 'react';
import { useChat } from '../store/useStore';
import { Message } from './Message';
import { Loader2 } from 'lucide-react';

export function MessageList() {
  const { messages, isLoading, currentChannel } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!currentChannel) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a channel to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <Message key={message._id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
