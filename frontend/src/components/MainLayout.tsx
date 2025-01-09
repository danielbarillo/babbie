import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { useTheme } from "./ThemeProvider";
import { Sidebar } from "./Sidebar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { UserList } from './UserList';
import { GuestNameDialog } from './GuestNameDialog';

export function MainLayout() {
  const { currentChannel, userState, logout, fetchChannels, guestName, setGuestName } = useStore();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch channels when component mounts
    fetchChannels().catch(console.error);
  }, [fetchChannels]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAuthenticated = userState?.type === 'authenticated';

  const handleGuestNameSubmit = (name: string) => {
    setGuestName(name);
  };

  if (!userState) {
    return null;
  }

  if (userState?.type === 'guest' && !guestName) {
    return (
      <GuestNameDialog
        onSubmit={handleGuestNameSubmit}
        onClose={() => {}}
      />
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:relative md:flex w-64 h-full z-30 transform transition-transform duration-200 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <main className="flex-1 flex flex-col w-full md:w-[calc(100%-16rem)]">
        <header className="border-b p-4 flex justify-between items-center bg-background">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-lg">
              {currentChannel ? `#${currentChannel.name}` : 'Welcome to Chappy'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-full"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
            >
              Logout
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {currentChannel && <MessageList />}
          {!currentChannel && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a channel to start chatting
            </div>
          )}
        </div>
        {currentChannel && <MessageInput />}

        {isAuthenticated && (
          <div className="mt-4">
            <UserList />
          </div>
        )}
      </main>
    </div>
  );
}