import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { GuestNameDialog } from "../components/GuestNameDialog";
import { useAuth } from "../store/useStore";
import { toast } from "sonner";
import { LoadingOverlay } from "../components/ui/LoadingOverlay";
import { Loader2 } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const { login, error, isLoading: authLoading, guestLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      await login(formData.username, formData.password);
      toast.success("Welcome back!");
      navigate("/chat");
    } catch (error) {
      // Error is already handled by the auth slice
      // and displayed in the form
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setShowGuestDialog(true);
  };

  const handleGuestNameSubmit = async (name: string) => {
    try {
      setIsLoading(true);
      guestLogin(name);
    } catch (error) {
      toast.error("Guest login failed");
    } finally {
      setIsLoading(false);
      setShowGuestDialog(false);
    }
  };

  if (authLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Welcome to Chappy</h1>
          <p className="text-sm text-muted-foreground text-center">
            Sign in to continue to your account
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Enter your username"
                required
                autoComplete="username"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                {error}
              </p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGuestLogin}
              disabled={isLoading}
            >
              Continue as Guest
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Don't have an account?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => navigate("/register")}
                disabled={isLoading}
              >
                Create one
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>

      <GuestNameDialog
        open={showGuestDialog}
        onOpenChange={setShowGuestDialog}
        onSubmit={handleGuestNameSubmit}
      />
    </div>
  );
}
