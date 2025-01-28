import { useState } from 'react';
import { useChat } from '../../store/useStore';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { SendHorizontal } from 'lucide-react';

export function MessageInput() {
  const { sendMessage, currentChannel, isLoading } = useChat();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !currentChannel) return;

    try {
      await sendMessage(message, currentChannel._id);
      setMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          disabled={isLoading || !currentChannel}
          className="min-h-[20px] max-h-[200px]"
          rows={1}
        />
        <Button
          type="submit"
          disabled={isLoading || !message.trim() || !currentChannel}
          size="icon"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}