import { useEffect } from "react";
import { useAdminChatStore } from "@/store/useAdminChatStore.js";
import ChatWindow from "@/components/ChatStructure/Chats/ChatWindow.jsx";

function AdminChatPage() {
  const {
    myChatPartners,
    selectedUser,
    setSelectedUser,
    messages,
    getAdminConversations,
    sendMessage,
    isMessagesLoading,
    isUserLoading,
  } = useAdminChatStore();

  useEffect(() => {
    getAdminConversations();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-900 p-2 overflow-y-auto">
        {isUserLoading ? (
          <p className="text-white">Loading users...</p>
        ) : myChatPartners.length === 0 ? (
          <p className="text-white text-center mt-4">No conversations yet</p>
        ) : (
          myChatPartners.map((c) => (
            <div
              key={c._id}
              className={`p-2 cursor-pointer rounded ${
                selectedUser?._id === c.userId._id ? "bg-gray-700" : ""
              }`}
              onClick={() =>
                setSelectedUser({ ...c.userId, conversationId: c._id })
              }
            >
              {c.userId.username}
            </div>
          ))
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-gray-800">
        {selectedUser ? (
          <ChatWindow
            messages={messages}
            onSend={sendMessage}
            isLoading={isMessagesLoading}
          />
        ) : (
          <p className="text-white p-4">Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
}

export default AdminChatPage;
