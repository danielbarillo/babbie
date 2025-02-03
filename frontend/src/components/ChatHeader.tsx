import { useState, useEffect } from 'react';
import { useChat } from '../store/useStore';
import { Button } from './ui/button';
import { Users } from 'lucide-react';
import { UserListDialog } from './UserListDialog';
import api from '../api/axios';
import type { User } from '../types/user';

export function ChatHeader() {
  const { currentChannel } = useChat();
  const [showMembers, setShowMembers] = useState(false);
  const [memberDetails, setMemberDetails] = useState<User[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (!currentChannel?._id) return;
      
      try {
        setIsLoadingMembers(true);
        const response = await api.get(`/api/channels/${currentChannel._id}/users`);
        setMemberDetails(response.data);
      } catch (error) {
        console.error('Error fetching member details:', error);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    if (currentChannel?.members?.length) {
      fetchMemberDetails();
    } else {
      setMemberDetails([]);
    }
  }, [currentChannel?._id, currentChannel?.members]);

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
        <>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setShowMembers(true)}
              disabled={isLoadingMembers}
            >
              <Users className="h-4 w-4 mr-2" />
              {isLoadingMembers ? 'Loading...' : `${memberDetails.length} members`}
            </Button>
          </div>

          <UserListDialog
            isOpen={showMembers}
            onClose={() => setShowMembers(false)}
            members={memberDetails}
            isLoading={isLoadingMembers}
          />
        </>
      )}
    </div>
  );
}