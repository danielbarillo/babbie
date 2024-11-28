import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Hash, Lock, Plus, MessageSquare, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Sidebar() {
  const {
    channels,
    currentChannel,
    joinChannel,
    createChannel,
    error,
    isLoading,
    userState,
    conversations,
    fetchConversations
  } = useStore();
  const navigate = useNavigate();

  const [isCreating, setIsCreating] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (userState?.type === 'authenticated') {
      fetchConversations();
    }
  }, [userState, fetchConversations]);

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    try {
      await createChannel({
        name: newChannelName,
        isPrivate,
        description: description.trim()
      });
      setNewChannelName('');
      setDescription('');
      setIsPrivate(false);
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create channel:', error);
    }
  };

  return (
    <aside className="w-64 border-r bg-muted/40">
      <ScrollArea className="h-screen">
        {/* Channels Section */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Channels
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCreating(true)}
              className="rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {error && (
            <div className="p-2 text-sm text-destructive bg-destructive/10 rounded">
              {error}
            </div>
          )}

          {isCreating && (
            <form onSubmit={handleCreateChannel} className="space-y-2">
              <Input
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="New channel name"
                className="text-sm"
              />
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Channel description (optional)"
                className="text-sm"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isPrivate" className="text-sm">
                  Private channel
                </label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="flex-1">
                  Create
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsCreating(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-1">
            {isLoading ? (
              <div className="text-sm text-muted-foreground p-2">Loading channels...</div>
            ) : channels.length === 0 ? (
              <div className="text-sm text-muted-foreground p-2">No channels yet</div>
            ) : (
              channels.map((channel) => (
                <Button
                  key={channel._id}
                  variant={currentChannel?._id === channel._id ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => joinChannel(channel._id)}
                >
                  {channel.isPrivate ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Hash className="h-4 w-4" />
                  )}
                  {channel.name}
                </Button>
              ))
            )}
          </div>
        </div>

        {/* Direct Messages Section */}
        {userState?.type === 'authenticated' && (
          <>
            <div className="p-4 border-y">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Direct Messages
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/messages')}
                  className="rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-1">
              {conversations.length === 0 ? (
                <div className="text-sm text-muted-foreground p-2">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conversation) => (
                  <Button
                    key={conversation._id}
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => navigate(`/messages/${conversation._id}`)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    {conversation.username}
                  </Button>
                ))
              )}
            </div>
          </>
        )}
      </ScrollArea>
    </aside>
  );
}