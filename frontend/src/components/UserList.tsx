import { useChat, useUser } from "../store/useStore";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Users, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/user";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import api from "../api/axios";

interface MemberListProps {
  members: User[];
  showDirectMessageButton?: boolean;
}

export function MemberList({ members, showDirectMessageButton }: MemberListProps) {
  const navigate = useNavigate();
  const { userState } = useUser();

  if (members.length === 0) {
    return <div className="p-3 text-gray-400 text-center">No members</div>;
  }

  const handleDirectMessage = async (userId: string, username: string) => {
    try {
      // Check if there's an existing conversation
      const response = await api.get(`/api/conversations/${userId}`);
      const conversation = response.data;
      
      if (conversation) {
        // If conversation exists, navigate to it
        navigate(`/messages/${userId}`);
      } else {
        // If no conversation exists, create one
        const newConversation = await api.post('/api/conversations', {
          recipientId: userId
        });
        
        navigate(`/messages/${userId}`);
      }
    } catch (error) {
      console.error('Error handling direct message:', error);
      // If there's an error, still navigate to messages
      navigate(`/messages/${userId}`);
    }
  };

  const getInitial = (username: string | undefined) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  return (
    <ul className="p-3 space-y-2">
      {members.map((member, index) => {
        // Don't show DM button for the current user
        const isCurrentUser = userState?.type === 'authenticated' && 
          userState._id === member._id;

        return (
          <li
            key={member._id || member.username || `member-${index}`}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 hover:bg-[#1f1f1f]"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className={member.avatarColor || "bg-blue-500"}>
                {getInitial(member.username)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-200">
                {member.username || 'Unknown User'}
                {isCurrentUser && " (you)"}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {member.isOnline ? (
                  <span className="text-green-500">● Online</span>
                ) : (
                  <span>Offline</span>
                )}
              </div>
            </div>

            {showDirectMessageButton && member._id && !isCurrentUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDirectMessage(member._id, member.username)}
                className="ml-auto shrink-0"
                title="Send Direct Message"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function UserList() {
  const { currentChannel } = useChat();
  const members = currentChannel?.members || [];

  if (!currentChannel) return null;

  return (
    <div className="hidden lg:flex w-64 flex-col border-l border-[#1f1f1f] bg-[#0C0C0C]">
      <div className="p-4 flex items-center gap-2 text-gray-200">
        <Users className="h-5 w-5" />
        <h2 className="font-semibold">Members</h2>
        <span className="text-sm text-gray-400 ml-auto">
          {members.length}
        </span>
      </div>

      <Separator className="bg-[#1f1f1f]" />

      <ScrollArea className="flex-1">
        <MemberList members={members} />
      </ScrollArea>
    </div>
  );
}