import React, { useEffect } from "react";
import { useAdminChatStore } from "@/store/useAdminChatStore.js";
import ChatWindow from "@/components/ChatStructure/Chats/ChatWindow.jsx";
import { useSocketMessages } from "@/hooks/useSocketMessages";
import UsersLoadingSkeleton from "../Chats/UsersLoadingSkeleton";
import NoChatsFound from "../Chats/NoChatsFound";
import { useRegisterAdminOnline } from "@/hooks/useRegisterAdminOnline";
import NoConversationPlaceholder from "../Chats/NoConversationPlaceholder";

import { LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import avatar from "@/assets/pp.png";
import { socket } from "@/lib/socket";

import AdminChatHeader from "@/components/ChatStructure/Chats/AdminChatHeader";

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
    deleteMessage,
    onlineUsers,
    markAsRead,
    editMessage,
  } = useAdminChatStore();

  const { logout, adminData } = useAdminAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useSocketMessages(useAdminChatStore);
  useRegisterAdminOnline();

  useEffect(() => {
    getAdminConversations();
  }, []);

  useEffect(() => {
    if (selectedUser?.conversationId) {
      markAsRead(selectedUser.conversationId);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser?.conversationId || !adminData?._id) return;

    socket.emit("join-conversation", {
      conversationId: selectedUser.conversationId,
      userId: adminData._id,
    });
  }, [selectedUser, adminData]);

  useEffect(() => {
    if (!selectedUser?.conversationId) return;
  }, [selectedUser]);

  return (
    <div className="flex h-screen">
      {/* SIDEBAR */}
      <div
        className={`${
          selectedUser ? "hidden" : "custom-xsm:w-full sm:w-[35%]"
        } bg-gray-900 p-2 overflow-y-auto`}
      >
        {/* ADMIN HEADER */}
        <div className="flex items-start gap-3 px-5 py-5 border-b border-slate-700 -mx-2">
          <div className="relative">
            <img
              src={adminData?.avatar || avatar}
              alt="Admin"
              className="size-[3.6rem] custom-xxl:size-[4.5rem] rounded-full object-cover"
              onError={(e) => (e.currentTarget.src = avatar)}
            />
            <div className="absolute top-0 right-0 w-3.5 h-3.5 custom-xxl:top-1 rounded-full border-2 border-[#2d2f4a] bg-green-500" />
          </div>

          <div>
            <h3 className="text-slate-50 font-medium text-base custom-xxl:text-xl custom-xxl:mt-2 truncate">
              {adminData?.name || "Admin"}
            </h3>
            <p className="text-slate-400 text-xs custom-xxl:text-lg">
              {onlineUsers?.includes(String(adminData?._id))
                ? "Online"
                : "Offline"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-slate-200 transition-colors ml-auto mt-2"
          >
            <LogOutIcon className="size-5 custom-xxl:size-6" />
          </button>
        </div>

        {/*  USERS */}
        {isUserLoading ? (
          <UsersLoadingSkeleton />
        ) : myChatPartners.length === 0 ? (
          <NoChatsFound />
        ) : (
          myChatPartners.map((c) => {
            if (!c.userId) return null;

            const isOnline = onlineUsers
              ?.map(String)
              .includes(String(c.userId._id));

            const unreadCount = c.unreadCount || 0;

            return (
              <div
                key={c._id}
                className={`p-4 mb-2 rounded-lg cursor-pointer transition-colors mt-3 ${
                  selectedUser?._id === c.userId?._id
                    ? "bg-gray-700"
                    : "bg-cyan-500/10 hover:bg-cyan-500/20"
                }`}
                onClick={() => {
                  if (!c.userId) return;

                  setSelectedUser({
                    ...c.userId,
                    conversationId: c._id,
                  });
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={c.userId?.avatar || "/avatar.png"}
                      alt={c.userId?.username || "User"}
                      className="w-12 h-12 custom-xxl:w-16 custom-xxl:h-16 rounded-full object-cover"
                      onError={(e) => (e.currentTarget.src = "/avatar.png")}
                    />
                    <span
                      className={`absolute top-0 right-0 w-3 h-3 custom-xxl:top-1 rounded-full border-2 border-[#2d2f4a] ${
                        isOnline ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <h4 className="text-slate-200 custom-xxl:text-xl font-medium truncate">
                      {c.userId?.username || "Deleted User"}
                    </h4>

                    <p className="text-xs text-gray-400 custom-xxl:text-lg truncate max-w-[160px]">
                      {c.lastMessage?.content
                        ? c.lastMessage.content
                        : c.lastMessage?.media?.length > 0
                          ? "📎 Media"
                          : "No messages yet"}
                    </p>

                    {unreadCount > 0 && (
                      <div className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs bg-green-500 text-white rounded-full">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CHAT AREA */}
      <div className={`${selectedUser ? "w-full" : " sm:w-[75%]"} bg-gray-800`}>
        {selectedUser ? (
          isMessagesLoading ? (
            <div className="flex items-center justify-center h-full">
              <UsersLoadingSkeleton />
            </div>
          ) : (
            <ChatWindow
              messages={messages}
              conversation={selectedUser?.conversationId}
              onSend={sendMessage}
              deleteMessage={deleteMessage}
              editMessage={editMessage}
              HeaderComponent={AdminChatHeader}
              isAdmin={true}
            />
          )
        ) : (
          <NoConversationPlaceholder />
        )}
      </div>
    </div>
  );
}

export default AdminChatPage;
