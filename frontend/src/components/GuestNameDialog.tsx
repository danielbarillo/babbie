import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface GuestNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => Promise<void>;
}

export function GuestNameDialog({ open, onOpenChange, onSubmit }: GuestNameDialogProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit(name);
      onOpenChange(false);
      /* setName(''); */
    } catch (error) {
      console.error('Failed to submit guest name:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Guest Name</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            minLength={2}
            maxLength={30}
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting || !name.trim()}>
            {isSubmitting ? 'Loading...' : 'Continue as Guest'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}