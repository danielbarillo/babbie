import { useEffect, useRef } from "react";
import { useChat, useUser } from "../store/useStore";
import { format } from "date-fns";
import { Card } from "./ui/card";
import type { DirectMessage } from "../types/messages";
import type { AuthenticatedUser } from "../types";

interface DirectMessageListProps {
  currentConversation: {
    _id: string;
    username: string;
  } | null;
}

export function DirectMessageList({
  currentConversation,
}: DirectMessageListProps) {
  const { directMessages } = useChat();
  const { userState } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredMessages = directMessages.filter((msg: DirectMessage) => {
    if (!userState || userState.type !== 'authenticated') return false;
    const authenticatedUser = userState as AuthenticatedUser;

    const isOwnMessage = msg.sender._id === authenticatedUser._id;
    const isRecipient = msg.recipientId === currentConversation?._id;
    const isSender = msg.sender._id === currentConversation?._id;

    return (isOwnMessage && isRecipient) || (!isOwnMessage && isSender);
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [directMessages]);

  if (!currentConversation) return null;

  return (
    <div ref={messagesEndRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {filteredMessages.map((message) => (
        <Card key={message._id} className="p-4">
          <div className="flex justify-between items-start">
            <span className="font-medium">{message.sender.username}</span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(message.createdAt), "HH:mm")}
            </span>
          </div>
          <p className="mt-1">{message.content}</p>
        </Card>
      ))}
    </div>
  );
}
