import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useStore } from "../store/useStore";
import { SendHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Input } from "./ui/input";

interface DirectMessageInputProps {
  currentConversation: {
    _id: string;
    username: string;
  } | null;
}

export function DirectMessageInput({ currentConversation }: DirectMessageInputProps) {
  const [message, setMessage] = useState("");
  const { sendDirectMessage, fetchConversations } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentConversation) return;

    try {
      await sendDirectMessage(message.trim(), currentConversation._id);
      setMessage("");
      await fetchConversations();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-[#1f1f1f]">
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" disabled={!message.trim()}>
          Send
        </Button>
      </div>
    </form>
  );
}
