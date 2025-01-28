import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Card } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';

export function CreateChannel() {
  const navigate = useNavigate();
  const { createChannel, userState, fetchChannels } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    isPrivate: false,
  });

  // Check authentication
  useEffect(() => {
    if (!userState || userState.type !== 'authenticated') {
      navigate('/chat');
    }
  }, [userState, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await createChannel(formData);
      await fetchChannels(); // Refresh the channels list
      navigate('/chat');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create channel');
      setIsLoading(false);
    }
  };

  // If not authenticated, don't render anything
  if (!userState || userState.type !== 'authenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/chat')}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Create Channel</h1>
        </div>

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Channel Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter channel name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPrivate"
              checked={formData.isPrivate}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isPrivate: checked as boolean })
              }
              disabled={isLoading}
            />
            <Label htmlFor="isPrivate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Make this channel private
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !formData.name.trim()}>
            {isLoading ? 'Creating...' : 'Create Channel'}
          </Button>
        </form>
      </Card>
    </div>
  );
}