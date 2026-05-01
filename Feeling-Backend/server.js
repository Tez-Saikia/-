import dbConnection from "./db/dbConnection.js";
import dotenv from "dotenv";
import app from "./app.js";
import debug from "debug";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

dotenv.config({ path: "./.env" });

const log = debug("development:server");
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://feelingphotography.vercel.app",
];

const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global.io = io;

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("✅ New socket connected:", socket.id);

  socket.on("join-conversation", ({ conversationId, userId }) => {
    socket.join(conversationId);

    if (userId) {
      onlineUsers.set(socket.id, userId.toString());

      io.emit("online-users", [
        ...new Set(Array.from(onlineUsers.values()).map((id) => id.toString())),
      ]);
    }
  });


  socket.on("read-messages", ({ conversationId, readerId }) => {
    socket
      .to(conversationId)
      .emit("messages-read", { conversationId, readerId });
  });

  socket.on("message-edited", ({ conversationId, updatedMessage }) => {
    socket.to(conversationId).emit("message-edited", updatedMessage);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);

    onlineUsers.delete(socket.id);

    io.emit("online-users", [
      ...new Set(Array.from(onlineUsers.values()).map((id) => id.toString())),
    ]);
  });

  socket.on("typing", ({ conversationId, user }) => {
    socket.to(conversationId).emit("typing", { user });
  });

  socket.on("stop-typing", ({ conversationId }) => {
    socket.to(conversationId).emit("stop-typing");
  });
});

dbConnection()
  .then(() => {
    app.on("error", (error) => {
      log("ERROR:", error);
      throw error;
    });

    server.listen(PORT, () => {
      log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => log("❌ MongoDB connection failed:", err));
