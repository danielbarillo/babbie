import React, { useState } from "react";
import { useStore } from "../store/useStore";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "./ThemeProvider";
import { Sidebar } from "./Sidebar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Moon, Sun, LogIn, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export function MainLayout() {
  const { currentChannel, userState, fetchChannels } = useStore();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  React.useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!userState) {
    return null;
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
            {userState.type === 'authenticated' ? (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
              >
                Logout
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </div>
            )}
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
      </main>
    </div>
  );
}