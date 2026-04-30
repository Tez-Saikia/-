import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useAuthStore } from "@/store/useAuthStore";

export const useSocketMessages = (store) => {
  useEffect(() => {
    const getConvId = (conv) =>
      typeof conv === "object" ? conv?._id?.toString() : conv?.toString();

    const handleReceiveMessage = (message) => {
      const normalizedMessage = {
        ...message,

        senderId:
          typeof message.senderId === "object"
            ? message.senderId?._id
            : message.senderId,

        senderModel: message.senderModel,
      };

      const state = store.getState();

      console.log("📩 Incoming message:", normalizedMessage);

      const messageConvId = getConvId(normalizedMessage.conversationId);

      const currentConversationId = getConvId(
        state.selectedUser?.conversationId ||
          state.activeConversationId ||
          state.conversation?._id,
      );

      const isActiveChat =
        currentConversationId &&
        String(messageConvId) === String(currentConversationId);

      const partners = Array.isArray(state.myChatPartners)
        ? [...state.myChatPartners]
        : [];

      const index = partners.findIndex(
        (c) => String(c._id) === String(messageConvId),
      );

      const adminId = useAdminAuthStore.getState().adminData?._id;
      const userId = useAuthStore.getState().authUser?._id;

      const myId = adminId || userId;

      const isIncomingForMe =
        String(normalizedMessage.senderId) !== String(myId);

      if (index !== -1) {
        const existing = partners[index];

        partners[index] = {
          ...existing,

          userId:
            normalizedMessage.senderModel === "User"
              ? normalizedMessage.senderId
              : existing.userId,

          adminId:
            normalizedMessage.senderModel === "Admin"
              ? normalizedMessage.senderId
              : existing.adminId,

          lastMessage: normalizedMessage,
          updatedAt: new Date().toISOString(),

          unreadCount:
            isIncomingForMe && !isActiveChat
              ? (existing.unreadCount || 0) + 1
              : existing.unreadCount,
        };
      } else {
        partners.unshift({
          _id: messageConvId,

          userId:
            normalizedMessage.senderModel === "User"
              ? normalizedMessage.senderId
              : null,

          adminId:
            normalizedMessage.senderModel === "Admin"
              ? normalizedMessage.senderId
              : null,

          lastMessage: normalizedMessage,
          updatedAt: new Date().toISOString(),

          unreadCount: isIncomingForMe && !isActiveChat ? 1 : 0,
        });
      }

      partners.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      store.setState((state) => {
        const messages = state.messages || [];

        const index = messages.findIndex(
          (m) =>
            String(m._id) === String(normalizedMessage._id) ||
            (m.clientId && m.clientId === normalizedMessage.clientId),
        );

        let updatedMessages = messages;

        if (index !== -1) {
          updatedMessages = [...messages];
          updatedMessages[index] = normalizedMessage;
        } else if (isActiveChat) {
          updatedMessages = [...messages, normalizedMessage];
        }

        return {
          myChatPartners: partners,
          messages: updatedMessages,
        };
      });
    };

    const handleOnlineUsers = (users) => {
      store.getState().setOnlineUsers(users);
    };

    const handleMessagesRead = ({ userId, userModel }) => {
      store.setState((state) => ({
        messages: (state.messages || []).map((msg) => {
          const getSenderId = (id) => (typeof id === "object" ? id?._id : id);

          if (String(getSenderId(msg.senderId)) !== String(userId)) return msg;

          const alreadyRead = msg.readBy?.some(
            (r) => String(r.userId) === String(userId),
          );

          if (alreadyRead) return msg;

          return {
            ...msg,
            readBy: [...(msg.readBy || []), { userId, userModel }],
          };
        }),
      }));
    };

    // ✅ SOCKET LISTENERS
    socket.on("receive-message", handleReceiveMessage);
    socket.on("online-users", handleOnlineUsers);
    socket.on("messages-read", handleMessagesRead);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("online-users", handleOnlineUsers);
      socket.off("messages-read", handleMessagesRead);
    };
  }, [store]);
};
