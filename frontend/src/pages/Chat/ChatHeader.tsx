import { useChat } from '../../store/useStore';

export function ChatHeader() {
  const { currentChannel } = useChat();

  return (
    <div className="border-b p-4 flex items-center justify-between">
      <div>
        <h2 className="font-semibold">
          {currentChannel?.name || 'Select a channel'}
        </h2>
        {currentChannel?.description && (
          <p className="text-sm text-muted-foreground">
            {currentChannel.description}
          </p>
        )}
      </div>
    </div>
  );
}