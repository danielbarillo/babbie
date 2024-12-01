import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import LoadingSpinner from "../components/LoadingSpinner";
import { useStore } from "../store/useStore";

export function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const { isLoading } = useStore();
  const navigate = useNavigate();
  const store = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      console.log('Attempting login with username:', username);
      await store.login({ username, password });
      console.log('Login successful, navigating to home');
      navigate("/");
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || "Invalid username or password");
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    try {
      console.log('Attempting guest login');
      await store.loginAsGuest();
      console.log('Guest login successful, navigating to home');
      navigate("/");
    } catch (err: any) {
      console.error('Guest login error:', err);
      setError("Failed to login as guest");
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

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGuestLogin}
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : "Continue as Guest"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
