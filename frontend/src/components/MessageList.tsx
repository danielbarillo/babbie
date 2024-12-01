import React, { useEffect, useRef } from "react";
import { useStore } from "../store/useStore";
import { ScrollArea } from "./ui/scroll-area";
import { format } from "date-fns";
import { Card } from "./ui/card";
import LoadingSpinner from "./LoadingSpinner";

export function MessageList() {
  const { messages = [], isLoading, currentChannel } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner />
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
    <div ref={scrollRef} className="flex-1 overflow-y-auto">
      <div className="p-2 md:p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <Card key={message._id} className="p-3 md:p-4 max-w-[85%] md:max-w-2xl mx-auto">
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-medium text-sm md:text-base">
                    {message.sender?.username || 'Unknown User'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(message.createdAt), "HH:mm")}
                  </span>
                </div>
                <p className="text-sm md:text-base break-words">{message.content}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
