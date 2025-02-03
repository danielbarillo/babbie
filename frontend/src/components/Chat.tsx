import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useChatFeatures, useAuth } from "../store/useStore";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ScrollArea } from "./ui/scroll-area";
import { Hash, Lock, Users } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import type { Message } from "../types/messages";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import type { Channel } from "../types/channels";

export default function Chat() {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const {
    currentChannel,
    fetchMessages,
    fetchChannels,
    sendMessage,
    channels = [],
    error,
    isLoading,
    clearState,
  } = useChatFeatures();
  const { logout } = useAuth();
  const { userState } = useUser();

  const handleLogout = async () => {
    try {
      // Clean up socket connections
      if (socket) {
        socket.disconnect();
      }

      // Clear chat state first
      if (typeof clearState === "function") {
        clearState();
      }

      // Logout from auth
      await logout();

      // Navigate to login page
      navigate("/login", { replace: true });

      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out");
    }
  };

  useEffect(() => {
    // Only fetch if we don't have channels already and we're not currently loading
    if (!isLoading && (!channels || channels.length === 0)) {
      fetchChannels().catch((err) => {
        console.error("Failed to fetch channels:", err);
        toast.error("Failed to load channels");
      });
    }
  }, [fetchChannels, channels, isLoading]);

  useEffect(() => {
    // Fetch messages when channel changes
    if (currentChannel?._id) {
      fetchMessages(currentChannel._id).catch((err) => {
        console.error("Failed to fetch messages:", err);
        toast.error("Failed to load messages");
      });
    }
  }, [currentChannel?._id, fetchMessages]);

  useEffect(() => {
    if (!socket) return;

    // Handle incoming messages
    socket.on("message", (message: Message) => {
      console.log("Received message:", message);
      if (message.channelId === currentChannel?._id) {
        sendMessage(message.content, currentChannel._id);
      }
    });

    // Handle channel updates by refreshing the channel list, but only if needed
    socket.on("user_status", () => {
      console.log("User status changed, refreshing channels");
      // Only fetch if we have channels and we're not in a loading state
      if (!isLoading && channels && channels.length > 0) {
        fetchChannels().catch(console.error);
      }
    });

    const handleReconnect = (attemptNumber: number) => {
      toast.success(`Reconnected after ${attemptNumber} attempts!`);
      if (currentChannel?._id) {
        fetchMessages(currentChannel._id);
      }
      // Only fetch channels if we have some already and we're not loading
      if (!isLoading && channels && channels.length > 0) {
        fetchChannels().catch(console.error);
      }
    };

    socket.on("connect_error", (error: Error) => {
      console.error("Connection error:", error);
      toast.warning("Lost connection. Reconnecting...");
    });

    socket.on("reconnect", handleReconnect);

    return () => {
      socket.off("message");
      socket.off("user_status");
      socket.off("connect_error");
      socket.off("reconnect");
    };
  }, [
    socket,
    currentChannel,
    fetchMessages,
    fetchChannels,
    channels,
    isLoading,
    sendMessage,
  ]);

  const canSendMessage = (channel: Channel) => {
    // For private channels, only authenticated users can send messages
    if (channel?.isPrivate) {
      return userState?.type === "authenticated";
    }

    // For restricted channels, require authentication
    if (channel?.isRestricted) {
      return userState?.type === "authenticated";
    }

    // For public channels, anyone can send messages
    return true;
  };

  if (isLoading) {
    return <div>Loading channels...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-[#1f1f1f] p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-200">
          {currentChannel ? (
            <>
              {currentChannel.isPrivate ? (
                <Lock className="h-5 w-5" />
              ) : (
                <Hash className="h-5 w-5" />
              )}
              <span className="font-medium">{currentChannel.name}</span>
              {currentChannel.isRestricted && (
                <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full">
                  LOGIN REQUIRED
                </span>
              )}
            </>
          ) : (
            <>
              <Users className="h-5 w-5" />
              <span className="font-medium">Select a channel</span>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:bg-[#1f1f1f] hover:text-gray-100"
          onClick={handleLogout}
        >
          Logga ut
        </Button>
      </div>

      {/* Error Display */}
      {error && <div className="p-4 bg-red-500/10 text-red-500">{error}</div>}

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            {currentChannel ? (
              <MessageList />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-4">
                <Users className="h-12 w-12 opacity-50" />
                <div className="text-center">
                  <h3 className="font-medium">Select a channel</h3>
                  <p className="text-sm text-gray-500">
                    Choose a channel to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      {currentChannel && (
        <div className="mt-auto border-t border-[#1f1f1f]">
          {canSendMessage(currentChannel) ? (
            <MessageInput />
          ) : (
            <div className="p-4 text-center text-yellow-500 bg-yellow-500/10">
              You need to be logged in to send messages in this channel
            </div>
          )}
        </div>
      )}
    </div>
  );
}
