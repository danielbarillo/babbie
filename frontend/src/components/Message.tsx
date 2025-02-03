import { useUser } from '../store/useStore';
import { formatDistanceToNow } from 'date-fns';
import type { Message as MessageType } from '../types/messages';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const { user } = useUser();
  const isOwnMessage = message?.sender?._id === user?._id;

  // Add safety check for sender
  if (!message?.sender?.username) {
    return null; // or return a loading state
  }

  return (
    <div className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : ''}`}>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {message.sender.username[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{message.sender.username}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </span>
        </div>

        <div className={`
          mt-1 rounded-lg p-3 max-w-md
          ${isOwnMessage
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
          }
        `}>
          {message.content}
        </div>
      </div>
    </div>
  );
}