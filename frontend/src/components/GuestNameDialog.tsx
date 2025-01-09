import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useStore } from '../store/useStore';

interface GuestNameDialogProps {
  onSubmit: (name: string) => void;
  onClose: () => void;
}

export function GuestNameDialog({ onSubmit, onClose }: GuestNameDialogProps) {
  const [inputValue, setInputValue] = useState('');
  const { setGuestName } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setGuestName(inputValue.trim());
      onSubmit(inputValue.trim());
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to Chappy!</DialogTitle>
          <DialogDescription>
            Choose a display name to start chatting
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter your display name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
            minLength={2}
            maxLength={20}
            autoFocus
          />
          <Button type="submit" className="w-full" disabled={!inputValue.trim()}>
            Start Chatting
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}