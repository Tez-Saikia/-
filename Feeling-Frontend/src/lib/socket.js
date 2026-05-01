import { io } from "socket.io-client";

const API = import.meta.env.VITE_API_URL.replace("/api/v1", "");

export const socket = io(API, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});