import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { ConversationList } from "../components/ConversationList";
import { DirectMessageList } from "../components/DirectMessageList";
import { DirectMessageInput } from "../components/DirectMessageInput";
import { ScrollArea } from "../components/ui/scroll-area";
import { Button } from "../components/ui/button";
import { MessageSquare, Users, ArrowLeft, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import api from "../api/axios";
import { useSocket } from "../hooks/useSocket";
import { useParams, useNavigate } from "react-router-dom";

interface User {
  _id: string;
  username: string;
  isOnline?: boolean;
  avatarColor?: string;
}

export default function DirectMessages() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { fetchDirectMessages, currentConversation, setCurrentConversation, clearMessages } = useStore();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"conversations" | "users">("conversations");
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentConversation]);

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await api.get("/api/users"); // Adjust the endpoint as necessary
      if (response.status === 200 && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
      setUsers([]); // Reset to empty array on error
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (userId && userId !== 'undefined') {
      fetchDirectMessages(userId);
    }
  }, [userId, fetchDirectMessages]);

  useEffect(() => {
    if (currentConversation?._id) {
      fetchDirectMessages(currentConversation._id);
    }
  }, [currentConversation, fetchDirectMessages]);

  const startConversation = async (user: User) => {
    try {
      // Clear existing messages first
      clearMessages();
      
      // Attempt to fetch the existing conversation
      const response = await api.get(`/api/dm/${user._id}`);
      if (response.data) {
        setCurrentConversation({
          _id: user._id,
          username: user.username,
          isOnline: user.isOnline
        });
        navigate(`/messages/${user._id}`);
        
        if (window.innerWidth < 768) {
          setShowSidebar(false);
        }
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const getInitial = (username: string) => username.charAt(0).toUpperCase();

  const renderUserList = () => {
    if (isLoadingUsers) {
      return (
        <div className="flex justify-center items-center p-4">
          <span className="text-sm text-muted-foreground">Loading users...</span>
        </div>
      );
    }

    if (users.length === 0) {
      return (
        <div className="p-4 text-sm text-muted-foreground text-center">
          No users found
        </div>
      );
    }

    return users.map((user) => (
      <Button
        key={user._id}
        variant="ghost"
        className="w-full justify-start gap-2 px-2 py-3"
        onClick={() => startConversation(user)}
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback className={user.avatarColor || "bg-blue-500"}>
            {getInitial(user.username)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-left">
          <div className="font-medium">{user.username}</div>
          <div className="text-xs text-muted-foreground">
            {user.isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
        {user.isOnline && (
          <span className="w-2 h-2 bg-green-500 rounded-full" />
        )}
      </Button>
    ));
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`
        ${showSidebar ? "flex" : "hidden"}
        md:flex flex-col
        w-full md:w-72
        border-r
        absolute md:relative
        bg-background
        z-10
        h-full
      `}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">Messages</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <Button
            variant={activeTab === "conversations" ? "secondary" : "ghost"}
            className="flex-1 rounded-none gap-2"
            onClick={() => setActiveTab("conversations")}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chats</span>
          </Button>
          <Button
            variant={activeTab === "users" ? "secondary" : "ghost"}
            className="flex-1 rounded-none gap-2"
            onClick={() => setActiveTab("users")}
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {error && <div className="p-4 text-sm text-red-500">{error}</div>}

          {activeTab === "conversations" ? (
            <ConversationList />
          ) : (
            <div className="p-2 space-y-1">
              {renderUserList()}
            </div>
          )}
        </ScrollArea>
      </aside>

      {/* Main Chat Area */}
      <main
        className={`
        flex-1
        flex
        flex-col
        ${!showSidebar ? "block" : "hidden"}
        md:block
      `}
      >
        {currentConversation ? (
          <>
            <div className="p-4 border-b flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentConversation(null)}
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
            <DirectMessageList currentConversation={currentConversation} />
            <DirectMessageInput currentConversation={currentConversation} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-4">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <div className="text-center">
              <h3 className="font-medium">No conversation selected</h3>
              <p className="text-sm text-muted-foreground">
                Choose a user to start chatting or select an existing
                conversation
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
