import { useState, FormEvent } from 'react';
import { useStore } from '../store/useStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send } from 'lucide-react';

export function MessageInput() {
  const [content, setContent] = useState('');
  const { sendMessage, isLoading } = useStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    try {
      await sendMessage(content);
      setContent('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-background">
      <div className="flex gap-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !content.trim()}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
