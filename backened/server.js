require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const app = require("./src/app");
const { initSocket } = require("./src/socket/socketHandler");

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/expert-booking";

const server = http.createServer(app);

// Initialise Socket.io and attach to app for controllers to use
const io = initSocket(server);
app.set("io", io);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅  MongoDB connected");
    server.listen(PORT, () =>
      console.log(`🚀  Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌  MongoDB connection error:", err.message);
    process.exit(1);
  });
