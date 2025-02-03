import { useUser } from "../../store/useStore";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import type { Message as MessageType } from "../../types/messages";

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const { user } = useUser();
  const isOwnMessage = message.userId === user?._id;

  return (
    <div className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.avatar} />
        <AvatarFallback>{message.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className={`flex flex-col ${isOwnMessage ? "items-end" : ""}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{message.username}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(message.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        <div
          className={`
          mt-1 rounded-lg p-3 max-w-md
          ${isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"}
        `}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
