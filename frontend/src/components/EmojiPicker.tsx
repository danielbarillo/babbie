import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return (
    <div className="rounded-lg shadow-lg">
      <Picker
        data={data}
        onEmojiSelect={(emoji: any) => onEmojiSelect(emoji.native)}
        theme="light"
        previewPosition="none"
        skinTonePosition="none"
        maxFrequentRows={0}
        perLine={8}
      />
    </div>
  );
}