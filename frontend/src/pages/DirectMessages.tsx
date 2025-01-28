import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { ConversationList } from '../components/ConversationList';
import { DirectMessageList } from '../components/DirectMessageList';
import { DirectMessageInput } from '../components/DirectMessageInput';
import { ScrollArea } from '../components/ui/scroll-area';
import { Button } from '../components/ui/button';
import { MessageSquare, Users, ArrowLeft, Menu } from 'lucide-react';
import api from '../api/axios';
import { useSocket } from '../hooks/useSocket';
import { useParams } from 'react-router-dom';

interface User {
  _id: string;
  username: string;
  isOnline?: boolean;
}

export default function DirectMessages() {
  const { userId } = useParams<{ userId: string }>();
  const { socket, sendDirectMessage } = useSocket();
  const { fetchDirectMessages, currentConversation } = useStore();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'conversations' | 'users'>('conversations');
  const [showSidebar, setShowSidebar] = useState(true);

  // Automatiskt dölja sidebaren på mobil
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowSidebar(!currentConversation);
      } else {
        setShowSidebar(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentConversation]);

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

  useEffect(() => {
    if (userId) {
      fetchDirectMessages(userId);
    }
  }, [userId, fetchDirectMessages]);

  const startConversation = (user: User) => {
    // Implement the logic to start a conversation with the selected user
  };

  const handleBack = () => {
    // Implement the logic to go back to the previous conversation
  };

  if (!currentConversation) {
    return <div>Loading conversation...</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={`
        ${showSidebar ? 'flex' : 'hidden'}
        md:flex flex-col
        w-full md:w-72
        border-r
        absolute md:relative
        bg-background
        z-10
        h-full
      `}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">Messages</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <Button
            variant={activeTab === 'conversations' ? 'secondary' : 'ghost'}
            className="flex-1 rounded-none gap-2"
            onClick={() => setActiveTab('conversations')}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chats</span>
          </Button>
          <Button
            variant={activeTab === 'users' ? 'secondary' : 'ghost'}
            className="flex-1 rounded-none gap-2"
            onClick={() => setActiveTab('users')}
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {error && (
            <div className="p-4 text-sm text-red-500">
              {error}
            </div>
          )}

          {activeTab === 'conversations' ? (
            <div className="p-2 space-y-1">
              {/* Render conversation list */}
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {users.map((user) => (
                <Button
                  key={user._id}
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => startConversation(user)}
                >
                  <Users className="h-4 w-4" />
                  <span className="truncate">{user.username}</span>
                  {user.isOnline && (
                    <span className="w-2 h-2 bg-green-500 rounded-full ml-auto" />
                  )}
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </aside>

      {/* Main Chat Area */}
      <main className={`
        flex-1
        flex
        flex-col
        ${!showSidebar ? 'block' : 'hidden'}
        md:block
      `}>
        {currentConversation ? (
          <>
            <div className="p-4 border-b flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="md:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <h2 className="font-semibold">
                  {currentConversation.username}
                </h2>
                {currentConversation.isOnline && (
                  <p className="text-sm text-muted-foreground">Online</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setShowSidebar(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
            <DirectMessageList />
            <DirectMessageInput currentConversation={currentConversation} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-4">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <div className="text-center">
              <h3 className="font-medium">No conversation selected</h3>
              <p className="text-sm text-muted-foreground">
                Choose a user to start chatting or select an existing conversation
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}