import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export function ConversationList() {
  const {
    conversations = [],
    currentConversation,
    setCurrentConversation,
    fetchConversations,
    error,
    isLoading
  } = useStore();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <aside className="w-64 border-r bg-muted/40">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Messages</h2>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-4 space-y-4">
          {error && (
            <div className="p-2 text-sm text-destructive bg-destructive/10 rounded">
              {error}
            </div>
          )}

          <div className="space-y-1">
            {isLoading ? (
              <div className="text-sm text-muted-foreground p-2">
                Loading conversations...
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-sm text-muted-foreground p-2">
                No conversations yet
              </div>
            ) : (
              conversations.map((conversation) => (
                <Button
                  key={conversation._id}
                  variant={currentConversation?._id === conversation._id ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => setCurrentConversation(conversation)}
                >
                  <MessageSquare className="h-4 w-4" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{conversation.username}</div>
                    {conversation.lastMessage && (
                      <div className="text-xs text-muted-foreground truncate">
                        <span className="opacity-70">
                          {format(new Date(conversation.lastMessage.createdAt), 'HH:mm')}
                        </span>
                        {' · '}
                        {conversation.lastMessage.content}
                      </div>
                    )}
                  </div>
                </Button>
              ))
            )}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}