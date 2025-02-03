import { useEffect, useRef } from "react";
import { useStore, useUser } from "../store/useStore";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { DirectMessage } from "../types/messages";

interface DirectMessageListProps {
  currentConversation: {
    _id: string;
    username: string;
  } | null;
}

export function DirectMessageList({
  currentConversation,
}: DirectMessageListProps) {
  const { messages = [], isLoading } = useStore();
  const { userState } = useUser();
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

  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {messages && messages.length > 0 ? (
            messages.map((message: DirectMessage) => {
              const isOwnMessage = message.sender._id === userState?._id;
              return (
                <Card
                  key={message._id}
                  className={`p-4 max-w-md ${
                    isOwnMessage 
                      ? "bg-[#1f2d33] border-[#1f1f1f] ml-auto" 
                      : "bg-[#1a2733] border-[#1f1f1f]"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className={`font-medium ${
                      isOwnMessage ? "text-green-300" : "text-blue-300"
                    }`}>
                      {message.sender.username}
                    </div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(message.createdAt), "HH:mm")}
                    </div>
                  </div>
                  <div className="text-gray-200 mt-1">
                    {message.content}
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground">
              No messages yet
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
