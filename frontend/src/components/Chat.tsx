import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Sidebar } from './Sidebar';

export default function Chat() {
  const { currentChannel, fetchChannels, error } = useStore();

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive">
            {error}
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {currentChannel ? (
            <MessageList />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a channel to start chatting
            </div>
          )}
        </div>
        {currentChannel && <MessageInput />}
      </main>
    </div>
  );
}