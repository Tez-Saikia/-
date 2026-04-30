import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

export const useRegisterAdminOnline = () => {
  const adminId = useAdminAuthStore((s) => s.adminData?._id);
  const hasRegistered = useRef(false); 

  useEffect(() => {
    if (!adminId) return;

    const register = () => {
      if (hasRegistered.current) return;

      console.log("✅ Admin registering online:", adminId);

      socket.emit("join-conversation", {
        conversationId: "global-admin-room",
        userId: adminId,
      });

      hasRegistered.current = true;
    };

    if (socket.connected) {
      register();
    }

    socket.on("connect", () => {
      hasRegistered.current = false; 
      register();
    });

    return () => {
      socket.off("connect");
    };
  }, [adminId]);
};