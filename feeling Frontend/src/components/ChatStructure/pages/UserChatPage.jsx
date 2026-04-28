import { useEffect } from "react";
import { useUserChatStore } from "@/store/useUserChatStore.js";
import ChatWindow from "@/components/ChatStructure/Chats/ChatWindow.jsx";
import { useSocketMessages } from "@/hooks/useSocketMessages";
import { useRegisterUserOnline } from "@/hooks/useRegisterUserOnline";

function UserChatPage() {
  const {
    messages,
    getUserConversation,
    sendMessage,
    isMessagesLoading,
    deleteMessage,
    toggleSound,
    isSoundEnabled,
    editMessage,
  } = useUserChatStore();

  useRegisterUserOnline();

  useEffect(() => {
    getUserConversation();
  }, []);

  const { conversation } = useUserChatStore();

  useSocketMessages(useUserChatStore);

  return (
    <div className="h-screen bg-gray-800">
<ChatWindow
  messages={messages}
  conversation={conversation}
  onSend={sendMessage}
  isLoading={isMessagesLoading}
  deleteMessage={deleteMessage}
  toggleSound={toggleSound}
  isSoundEnabled={isSoundEnabled}
  editMessage={editMessage}
  isAdmin={false} 
/>
    </div>
  );
}

export default UserChatPage;
