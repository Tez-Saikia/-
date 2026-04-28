import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { socket } from "@/lib/socket";
import { useAuthStore } from "@/store/useAuthStore";

export const useUserChatStore = create((set, get) => ({
  messages: [],
  conversation: null,
  myChatPartners: [],
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  toggleSound: () => {
    const newValue = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", newValue);
    set({ isSoundEnabled: newValue });
  },

  getUserConversation: async () => {
    set({ isMessagesLoading: true, messages: [] });

    try {
      let res = await axiosInstance.get("/conversations/my");
      let conversations = res.data.conversations || [];
      let conversation = conversations[0] || null;

      if (!conversation) {
        const createRes = await axiosInstance.post("/conversations/create");
        conversation = createRes.data.conversation;
      }

      set({ conversation });

      if (conversation) {
        socket.emit("join-conversation", {
          conversationId: conversation._id,
        });

        get().getMessages(conversation._id);
        get().markAsRead(conversation._id);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch conversation",
      );
      set({ conversation: null });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getMessages: async (conversationId) => {
    set({ isMessagesLoading: true, messages: [] });
    try {
      const res = await axiosInstance.get(
        `/conversations/messages/${conversationId}`,
      );
      set((state) => {
        const existingIds = new Set((state.messages || []).map((m) => m._id));

        const newMessages = (res.data.messages || []).filter(
          (m) => !existingIds.has(m._id),
        );

        return {
          messages: [...(state.messages || []), ...newMessages],
        };
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async ({ content, files }) => {
    const conversation = get().conversation;
    if (!conversation) {
      console.log("❌ NO CONVERSATION FOUND");
      return;
    }

    console.log("🚀 Sending message:", {
      conversationId: conversation._id,
      content,
    });

    const conversationId = conversation._id;

    const clientId = Date.now().toString();
    const tempId = clientId;

    try {
      const authUser = useAuthStore.getState().authUser;
      const tempMessage = {
        _id: tempId,
        clientId,
        content,
        senderModel: "User",

        senderId: authUser._id.toString(),
        sender: { _id: authUser._id },

        media: files?.map((file) => ({
          type: file.type.startsWith("video") ? "video" : "image",
          url: URL.createObjectURL(file),
        })),

        createdAt: new Date().toISOString(),
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
        },
      });

      set({
        messages: get().messages.map((msg) =>
          msg._id === tempId ? { ...res.data.message, readBy: [] } : msg,
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
        messages: get().messages.map((msg) =>
          msg._id === messageId
            ? { ...msg, content: "deleted", media: [], deleted: true }
            : msg,
        ),
      });
    } catch (error) {
      toast.error("Failed to delete message");
    }
  },

  unreadCount: 0,

  getUnreadCount: async () => {
    try {
      const res = await axiosInstance.get(
        "/conversations/messages/unread-count",
      );

      set({ unreadCount: res.data.unreadCount || 0 });
    } catch (error) {
      console.error("Unread count failed");
    }
  },

  markAsRead: async (conversationId) => {
    if (!conversationId) return;

    try {
      await axiosInstance.post(
        `/conversations/messages/${conversationId}/read`,
      );

      get().getUnreadCount();
    } catch (error) {
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
}));
