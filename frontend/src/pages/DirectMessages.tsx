import { ConversationList } from '../components/ConversationList';
import { DirectMessageList } from '../components/DirectMessageList';
import { DirectMessageInput } from '../components/DirectMessageInput';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export function DirectMessages() {
  const { currentConversation } = useStore();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-background">
      <ConversationList />
      <main className="flex-1 flex flex-col">
        <header className="border-b p-4 flex justify-between items-center bg-background">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="mr-2"
              title="Back to channels"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-lg">
              {currentConversation ? `@${currentConversation.username}` : 'Select a conversation'}
            </h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {currentConversation ? (
            <DirectMessageList />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a conversation to start chatting
            </div>
          )}
        </div>
        {currentConversation && <DirectMessageInput />}
      </main>
    </div>
  );
}