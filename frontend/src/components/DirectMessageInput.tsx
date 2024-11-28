import { useState, FormEvent } from 'react';
import { useStore } from '../store/useStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send } from 'lucide-react';

export function DirectMessageInput() {
  const { sendDirectMessage, currentConversation, error } = useStore();
  const [content, setContent] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentConversation) return;

    try {
      await sendDirectMessage(content.trim(), currentConversation._id);
      setContent('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
      {error && (
        <div className="mb-2 p-2 text-sm text-destructive bg-destructive/10 rounded">
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!content.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}