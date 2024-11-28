interface MessagePart {
  type: 'text' | 'code';
  content: string;
  language?: string;
}

export function parseMessage(message: string): MessagePart[] {
  const parts: MessagePart[] = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(message)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: message.slice(lastIndex, match.index)
      });
    }

    // Add code block
    parts.push({
      type: 'code',
      language: match[1] || 'plaintext',
      content: match[2].trim()
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < message.length) {
    parts.push({
      type: 'text',
      content: message.slice(lastIndex)
    });
  }

  return parts;
}