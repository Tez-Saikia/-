import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { socket } from "@/lib/socket";

export const useAdminChatStore = create((set, get) => ({
  messages: [],
  selectedUser: null,
  myChatPartners: [],
  isUserLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  toggleSound: () => {
    const newValue = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", newValue);
    set({ isSoundEnabled: newValue });
  },

  setSelectedUser: (user) => {
    set({
      selectedUser: user,
      messages: [],
      activeConversationId: user?.conversationId,
    });

    if (user?.conversationId) {
      socket.emit("join-conversation", {
        conversationId: user.conversationId,
      });

      get().getMessages(user.conversationId);
      get().markAsRead(user.conversationId);
    }
  },

  getAdminConversations: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/conversations/admin");

      const sortedConversations = (res.data.conversations || []).sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      );

      set({ myChatPartners: sortedConversations });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch conversations",
      );
      set({ myChatPartners: [] });
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (conversationId) => {
    set({ isMessagesLoading: true, messages: [] });
    try {
      const res = await axiosInstance.get(
        `/conversations/messages/${conversationId}`,
      );
      set({ messages: res.data.messages });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async ({ content, files }) => {
    const adminId = useAdminAuthStore.getState().adminData?._id;
    const selectedUser = get().selectedUser;
    if (!selectedUser) return;

    let conversationId = selectedUser.conversationId;

    try {
      if (!conversationId) {
        const createRes = await axiosInstance.post("/conversations/create", {
          userId: selectedUser._id,
        });

        conversationId = createRes.data.conversation._id;

        set({
          selectedUser: {
            ...selectedUser,
            conversationId,
          },
        });

        socket.emit("join-conversation", {
          conversationId,
        });

        await get().getAdminConversations();
      }

      const clientId = Date.now().toString();
      const tempId = clientId;

      const tempMessage = {
        _id: tempId,
        clientId,
        content,
        conversationId,
        senderModel: "Admin",
        senderId: adminId.toString(),
        sender: { _id: adminId },
        media: files?.map((file) => ({
          type: file.type.startsWith("video") ? "video" : "image",
          url: URL.createObjectURL(file),
        })),
        createdAt: new Date().toISOString(),
        status: "sending",
        progress: 0,
        isTemp: true,
      };

      set({
        messages: [...get().messages, tempMessage],
      });

      const formData = new FormData();
      formData.append("conversationId", conversationId);
      formData.append("content", content || "");
      formData.append("clientId", clientId);

      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("files", file);
        });
      }

      const res = await axiosInstance.post("/conversations/message", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;

          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );

          set({
            messages: get().messages.map((msg) =>
              msg._id === tempId ? { ...msg, progress: percent } : msg,
            ),
          });
        },
      });

      set({
        messages: get().messages.map((msg) =>
          msg._id === tempId ? res.data.message : msg,
        ),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");

      set({
        messages: get().messages.filter((msg) => msg._id !== tempId),
      });
    }
  },

  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/conversations/message/${messageId}/delete`);

      set({
        messages: get().messages.filter((msg) => msg._id !== messageId),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  },

  unreadCount: 0,

  getUnreadCount: async () => {
    try {
      const res = await axiosInstance.get(
        "/conversations/messages/unread-count",
      );
      set({ unreadCount: res.data.unreadCount || 0 });
    } catch {
      console.error("Unread count failed");
    }
  },

  markAsRead: async (conversationId) => {
    if (!conversationId) return;

    try {
      await axiosInstance.post(
        `/conversations/messages/${conversationId}/read`,
      );

      set({
        myChatPartners: get().myChatPartners.map((conv) =>
          conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv,
        ),
      });

      get().getUnreadCount();
    } catch {
      console.error("Mark as read failed");
    }
  },

  editMessage: async (messageId, content) => {
    try {
      const res = await axiosInstance.patch(
        `/conversations/message/${messageId}/edit`,
        { content },
      );

      set({
        messages: get().messages.map((msg) =>
          msg._id === messageId ? res.data.message : msg,
        ),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to edit message");
    }
  },

  typingUser: null,
  setTypingUser: (user) => set({ typingUser: user }),
}));
