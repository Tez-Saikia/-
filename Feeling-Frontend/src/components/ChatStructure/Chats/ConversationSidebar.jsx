import React from "react";
import { useAdminChatStore } from "@/store/useAdminChatStore";

function ConversationSidebar() {
  const {
    myChatPartners,
    selectedUser,
    setSelectedUser,
    isUserLoading,
    onlineUsers,
  } = useAdminChatStore();

  return (
    <div className="w-1/4 bg-gray-900 p-2 overflow-y-auto">
      {isUserLoading ? (
        <p className="text-white text-center mt-4">Loading users...</p>
      ) : myChatPartners.length === 0 ? (
        <p className="text-white text-center mt-4">No conversations yet</p>
      ) : (
        myChatPartners.map((conversation) => {
          const isOnline = onlineUsers?.includes(
            String(conversation.userId?._id),
          );
          const unreadCount = conversation.unreadCount || 0;

          return (
            <div
              key={conversation._id}
              className={`p-3 mb-2 rounded cursor-pointer flex items-center gap-2 ${
                selectedUser?.conversationId === conversation._id
                  ? "bg-gray-700"
                  : "hover:bg-gray-800"
              }`}
              onClick={() =>
                setSelectedUser({
                  ...conversation.userId,
                  conversationId: conversation._id,
                })
              }
            >
              <div className="relative">
                <img
                  src={conversation.userId?.avatar || "/avatar.png"}
                  alt={conversation.userId?.username || "User"}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => (e.currentTarget.src = "/avatar.png")}
                />

                <span
                  className={`absolute top-0 right-0 w-3.5 h-3.5 border-2 border-gray-900 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>

              <div className="flex flex-col flex-1">
                <p className="text-white text-sm font-medium">
                  {conversation.userId?.username || "User"}
                </p>
                <p className="text-xs text-gray-400">
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>

              {/*  UNREAD COUNT  */}
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default ConversationSidebar;
