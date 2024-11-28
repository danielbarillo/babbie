import React from "react";
import { useStore } from "../store/useStore";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "./ThemeProvider";
import { Sidebar } from "./Sidebar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Moon, Sun, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export function MainLayout() {
  const { currentChannel, userState, fetchChannels } = useStore();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

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
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="border-b p-4 flex justify-between items-center bg-background">
          <div className="flex items-center gap-4">
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