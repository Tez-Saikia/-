import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useAuthStore } from "@/store/useAuthStore";

export const useRegisterUserOnline = () => {
  const authUser = useAuthStore((state) => state.authUser);

  useEffect(() => {
    if (!authUser?._id) return;

    const registerUser = () => {
      console.log("✅ User registering online:", authUser._id);

      socket.emit("join-conversation", {
        conversationId: "global-admin-room",
        userId: authUser._id,
      });
    };

    if (socket.connected) {
      registerUser();
    }

    socket.on("connect", registerUser);

    return () => {
      socket.off("connect", registerUser);
    };
  }, [authUser]);
};