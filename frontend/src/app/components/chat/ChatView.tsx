import { useParams } from "react-router";
import { useApp } from "../../contexts/AppContext";
import { MessageList, MessageListRef } from "../message/MessageList";
import { MessageInput } from "../message/MessageInput";
import { ChatHeader } from "./ChatHeader";
import { PinnedMessagesBanner } from "../message/PinnedMessagesBanner";
import { WelcomeScreen } from "./WelcomeScreen";
import { MembersSidebar } from "./MembersSidebar";
import { useRef } from "react";

export function ChatView() {
  const { channelId, serverId } = useParams();
  const { channels, messages } = useApp();
  const messageListRef = useRef<MessageListRef>(null);

  // Show welcome screen if no channel is selected
  if (!channelId) {
    return <WelcomeScreen />;
  }

  const channel = channels.find((c) => c.id === channelId);
  const channelMessages = messages.filter((m) => m.channelId === channelId);

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <p>Select a channel to start chatting</p>
      </div>
    );
  }

  const handleJumpToMessage = (messageId: string) => {
    messageListRef.current?.scrollToMessage(messageId);
  };

  return (
    <div className="flex-1 flex h-full">
      <div className="flex-1 flex flex-col">
        <ChatHeader channel={channel} onJumpToMessage={handleJumpToMessage} />
        <PinnedMessagesBanner />
        <MessageList ref={messageListRef} messages={channelMessages} />
        <MessageInput channelId={channelId!} channelName={channel.name} />
      </div>
      <MembersSidebar />
    </div>
  );
}