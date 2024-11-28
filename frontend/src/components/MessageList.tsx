import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';

export function MessageList() {
  const { messages, currentChannel, fetchMessages } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentChannel?._id) {
      fetchMessages(currentChannel._id);
    }
  }, [currentChannel?._id, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
      {messages.map((message) => (
        <div
          key={message._id}
          className="flex flex-col space-y-1 max-w-2xl mx-auto"
        >
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">
              {message.sender.username}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(message.createdAt), 'HH:mm')}
            </span>
          </div>
          <div className="bg-muted/40 rounded-lg p-3">
            {message.content}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
