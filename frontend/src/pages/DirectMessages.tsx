import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { ConversationList } from '../components/ConversationList';
import { DirectMessageList } from '../components/DirectMessageList';
import { DirectMessageInput } from '../components/DirectMessageInput';
import { ScrollArea } from '../components/ui/scroll-area';
import { Button } from '../components/ui/button';
import { MessageSquare } from 'lucide-react';
import api from '../api/axios';

interface User {
  _id: string;
  username: string;
  isOnline?: boolean;
}

export function DirectMessages() {
  const { currentConversation, setCurrentConversation } = useStore();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Hämta alla användare
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const startConversation = (user: User) => {
    setCurrentConversation({
      _id: user._id,
      username: user.username,
      isOnline: user.isOnline
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Messages</h2>
        </div>

        {/* Flikar för Conversations och Users */}
        <div className="flex border-b">
          <Button
            variant="ghost"
            className="flex-1 rounded-none"
            onClick={() => setCurrentConversation(null)}
          >
            Conversations
          </Button>
          <Button
            variant="ghost"
            className="flex-1 rounded-none"
            onClick={() => setCurrentConversation(null)}
          >
            Users
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {error && (
            <div className="p-4 text-sm text-red-500">
              {error}
            </div>
          )}

          {/* Lista över alla användare */}
          <div className="p-2 space-y-1">
            {users.map((user) => (
              <Button
                key={user._id}
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => startConversation(user)}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="truncate">{user.username}</span>
                {user.isOnline && (
                  <span className="w-2 h-2 bg-green-500 rounded-full ml-auto" />
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            <div className="p-4 border-b">
              <h2 className="font-semibold">
                Chat with {currentConversation.username}
              </h2>
            </div>
            <DirectMessageList />
            <DirectMessageInput />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a user to start chatting
          </div>
        )}
      </main>
    </div>
  );
}