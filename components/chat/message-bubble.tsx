import { Bot, User } from "lucide-react";
import { MessageContent } from "./message-content";

interface MessageBubbleProps {
  role: string;
  content: string;
  closeChat: () => void;
}

export function MessageBubble({
  role,
  content,
  closeChat,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center ${
          isUser ? "bg-foreground" : "bg-secondary"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-background" />
        ) : (
          <Bot className="h-4 w-4 text-accent" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`max-w-[80%] px-4 py-2 text-sm ${
          isUser
            ? "bg-foreground text-background"
            : "bg-secondary text-foreground"
        }`}
      >
        <MessageContent
          content={content}
          closeChat={closeChat}
          isUser={isUser}
        />
      </div>
    </div>
  );
}
