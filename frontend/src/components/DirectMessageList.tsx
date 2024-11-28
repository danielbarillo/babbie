import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';

export function DirectMessageList() {
  const { directMessages, userState, isLoading } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [directMessages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading messages...
      </div>
    );
  }

  if (!directMessages.length) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No messages yet. Start a conversation!
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {directMessages.map((message) => {
        const isCurrentUser = userState?.type === 'authenticated' && message.sender._id === userState._id;

        return (
          <div
            key={message._id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                isCurrentUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">
                  {message.sender.username}
                </span>
                <span className="text-xs opacity-70">
                  {format(new Date(message.createdAt), 'HH:mm')}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}