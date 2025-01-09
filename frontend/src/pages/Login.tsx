import React, { useState } from "react";
import { useStore } from "../store/useStore";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import LoadingSpinner from "../components/LoadingSpinner";
import { GuestNameDialog } from "../components/GuestNameDialog";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [guestName, setGuestName] = useState("");
  const navigate = useNavigate();
  const { login, loginAsGuest, isLoading, error } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleGuestLogin = () => {
    setShowGuestDialog(true);
  };

  const handleGuestNameSubmit = async (name: string) => {
    try {
      const { setGuestName } = useStore.getState();
      setGuestName(name);
      await loginAsGuest();
      setShowGuestDialog(false);
      navigate("/");
    } catch (error) {
      console.error("Guest login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md p-4 md:p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold">Welcome to Chappy</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Sign in to continue to your account
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="w-full"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !username || !password}
          >
            {isLoading ? <LoadingSpinner /> : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGuestLogin}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : "Continue as Guest"}
        </Button>

        {showGuestDialog && (
          <GuestNameDialog
            onSubmit={handleGuestNameSubmit}
            onClose={() => setShowGuestDialog(false)}
          />
        )}

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
