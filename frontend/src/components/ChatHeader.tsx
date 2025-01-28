import { useChat } from '../store/useStore';
import { Button } from './ui/button';
import { Users } from 'lucide-react';

export function ChatHeader() {
  const { currentChannel } = useChat();

  return (
    <div className="border-b p-4 flex items-center justify-between">
      <div>
        <h2 className="font-semibold">
          {currentChannel?.name || 'Select a channel'}
        </h2>
        {currentChannel?.description && (
          <p className="text-sm text-muted-foreground">
            {currentChannel.description}
          </p>
        )}
      </div>

      {currentChannel && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Users className="h-4 w-4 mr-2" />
            {currentChannel.members?.length || 0} members
          </Button>
        </div>
      )}
    </div>
  );
}