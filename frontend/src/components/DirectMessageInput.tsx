import { useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface DirectMessageInputProps {
  currentConversation: {
    _id: string;
    username: string;
  };
}

export function DirectMessageInput({ currentConversation }: DirectMessageInputProps) {
  const [message, setMessage] = useState('');
  const { sendDirectMessage } = useSocket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendDirectMessage(message.trim(), currentConversation._id);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button
        type="submit"
        disabled={!message.trim()}
        variant="default"
      >
        Send
      </Button>
    </form>
  );
}