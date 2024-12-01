import React, { useEffect } from "react";
import { useStore } from "../store/useStore";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Plus, Hash, Lock, MessageSquare, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const {
    channels = [],
    currentChannel,
    conversations = [],
    joinChannel,
    error,
    isLoading,
    userState,
    fetchChannels,
    fetchConversations
  } = useStore();

  const navigate = useNavigate();
  const isAuthenticated = userState?.type === 'authenticated';

  useEffect(() => {
    // Fetch initial data
    const loadData = async () => {
      try {
        await fetchChannels();
        if (isAuthenticated) {
          await fetchConversations();
        }
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    loadData();
  }, [fetchChannels, fetchConversations, isAuthenticated]);

  return (
    <aside className="w-full h-full border-r bg-background flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h1 className="font-bold text-xl">Chappy</h1>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {error && (
            <div className="p-2 text-sm text-destructive bg-destructive/10 rounded">
              {error}
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Channels
              </h2>
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/channels/new')}
                  className="rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

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
                    onClick={() => {
                      joinChannel(channel._id);
                      onClose?.();
                    }}
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
          {isAuthenticated && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Direct Messages
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigate('/messages');
                    onClose?.();
                  }}
                  className="rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-1">
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
                      onClick={() => {
                        navigate(`/messages/${conversation._id}`);
                        onClose?.();
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                      {conversation.username}
                    </Button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}