

import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://bakbak-chat-application-frontend.onrender.com",
  },
});

const userSocketMap = {}; // userId -> socket.id

// Helper to get socket ID of a user
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  // Map user to socket
  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
  }

  // Notify all clients about current online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Typing event - forward to receiver
  socket.on("typing", ({ senderId, receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId });
    }
  });

  //  Stop typing event
  socket.on("stopTyping", ({ senderId, receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { senderId });
    }
  });

  //  Handle disconnect
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
