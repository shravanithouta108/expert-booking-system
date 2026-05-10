const { Server } = require("socket.io");

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌  Client connected: ${socket.id}`);

    // Client joins a room specific to the expert they're viewing
    socket.on("join-expert", (expertId) => {
      socket.join(`expert-${expertId}`);
      console.log(`   -> ${socket.id} joined room expert-${expertId}`);
    });

    // Client leaves when navigating away
    socket.on("leave-expert", (expertId) => {
      socket.leave(`expert-${expertId}`);
      console.log(`   -> ${socket.id} left room expert-${expertId}`);
    });

    socket.on("disconnect", (reason) => {
      console.log(`🔌  Client disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialised");
  return io;
};

module.exports = { initSocket, getIO };
