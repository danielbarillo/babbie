import { useEffect } from "react";
import { useChat, useUser } from "../store/useStore";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Hash, Lock, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Channel } from "../types/channel";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const {
    channels = [],
    currentChannel,
    setCurrentChannel,
    error,
    isLoading,
    fetchChannels,
  } = useChat();
  const { userState, logout } = useUser();

  const isAuthenticated = userState?.type === "authenticated";

  useEffect(() => {
    // Only fetch if we don't have channels and we're not currently loading
    if (!isLoading && (!channels || channels.length === 0)) {
      fetchChannels().catch((err) => {
        console.error("Failed to fetch channels:", err);
      });
    }

    // Set up periodic refresh
    const intervalId = setInterval(() => {
      if (!isLoading) {
        fetchChannels().catch((err) => {
          console.error("Failed to refresh channels:", err);
        });
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, [fetchChannels, channels, isLoading]);

  const handleChannelClick = (channel: Channel) => {
    if (setCurrentChannel) {
      setCurrentChannel(channel);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); // Wait for the logout to complete
      navigate("/login"); // Navigate to login after successful logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, show an error message to the user
    }
  };

  const canAccessChannel = (channel: Channel) => {
    // If channel is not private, everyone can access
    if (!channel.isPrivate) return true;

    // If user is authenticated, they can access private channels
    if (userState?.type === "authenticated") return true;

    // Otherwise, check if user is a member
    return channel.members?.some((m) => m._id === userState?._id);
  };

  return (
    <div className="hidden md:flex w-64 flex-col border-r border-[#1f1f1f] bg-[#0C0C0C]">
      {/* Header */}
      <div className="p-4 font-semibold text-lg text-gray-200">Chappy</div>
      <Separator className="bg-[#1f1f1f]" />

      {/* Channels and DMs */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {error && (
            <div className="p-2 text-sm text-red-500 bg-red-500/10 rounded">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center text-gray-400 py-4">
              Loading channels...
            </div>
          ) : !channels || channels.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              No channels available
            </div>
          ) : (
            /* Channels Section */
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-400 px-2">
                Channels
              </div>
              {channels.map((channel) => {
                const isSelected = currentChannel?._id === channel._id;

                return (
                  <Button
                    key={channel._id}
                    variant={isSelected ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-2 text-gray-300 hover:bg-[#1f1f1f] ${
                      isSelected ? "bg-[#1f1f1f] text-gray-200" : ""
                    }`}
                    onClick={() => handleChannelClick(channel)}
                    disabled={!canAccessChannel(channel)}
                  >
                    {channel.isPrivate ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Hash className="h-4 w-4" />
                    )}
                    {channel.name}
                    {!canAccessChannel(channel) && (
                      <span className="ml-auto text-xs text-yellow-500">
                        Login Required
                      </span>
                    )}
                    {channel.unreadCount > 0 && (
                      <span className="ml-auto bg-[#1f1f1f] text-gray-300 rounded-full px-2 py-0.5 text-xs">
                        {channel.unreadCount}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          )}

          {/* Direct Messages Section */}
          {isAuthenticated && (
            <>
              <Separator className="bg-[#1f1f1f]" />
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-400 px-2">DM</div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:bg-[#1f1f1f]"
                  onClick={() => navigate("/messages")}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Messages
                </Button>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {isAuthenticated && (
        <div className="p-4">
          <Button variant="ghost" onClick={handleLogout} className="w-full">
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}
