import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export function ConversationList() {
  const navigate = useNavigate();
  const {
    conversations = [],
    currentConversation,
    setCurrentConversation,
    fetchConversations,
    clearMessages,
    fetchDirectMessages,
    error,
    isLoading
  } = useStore();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleConversationClick = async (conversation) => {
    clearMessages();
    const userData = {
      _id: conversation.user._id,
      username: conversation.user.username,
      isOnline: conversation.user.isOnline
    };
    setCurrentConversation(userData);
    navigate(`/messages/${userData._id}`);
    await fetchDirectMessages(userData._id);
    
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  // Sort conversations by lastMessage timestamp
  const sortedConversations = [...conversations].sort((a, b) => {
    const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
    const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
    return timeB - timeA; // Sort in descending order (newest first)
  });

  return (
    <div className="space-y-4">
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
          sortedConversations.map((conversation) => (
            <Button
              key={conversation._id}
              variant={currentConversation?._id === conversation.user._id ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => handleConversationClick(conversation)}
            >
              <MessageSquare className="h-4 w-4" />
              <div className="flex-1 text-left">
                <div className="font-medium">{conversation.user.username}</div>
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
  );
}