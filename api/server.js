const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const Message = require("./models/messageModel");
const asyncHandler = require("express-async-handler");
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
const bcrypt = require("bcrypt");
const router = require("./routes/userRoute");
const salt = bcrypt.genSaltSync(10);
const PORT = 4000;
const secret = "daoewuer8elxnkdsfjdfhakvn";
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
try {
  mongoose.connect("mongodb://localhost:27017/chat_app");
  console.log("connection successful");
} catch (err) {
  console.log("connetction error");
}

// Socket.io Connection
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("get-previous-data", async () => {
    const history = await Message.find();
    if (history) {
      // console.log(history);
      socket.emit("prev-chat-history", history);
    }
  });
  socket.on("send-message", async (payload) => {
    const messageInfo = await Message.create({
      message: payload.message,
      author: payload.username,
    });
    io.emit("receive-message", messageInfo);
  });
});

// routes
app.use(router);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
