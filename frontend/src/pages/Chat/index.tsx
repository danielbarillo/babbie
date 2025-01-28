import { ChatHeader } from '../../components/ChatHeader';
import { MessageList } from '../../components/MessageList';
import { MessageInput } from '../../components/MessageInput';

export function Chat() {
  return (
    <div className="h-full flex flex-col">
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </div>
  );
}