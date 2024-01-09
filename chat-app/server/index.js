const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors({
  origin:["https://chat-app-frontend-gold-nine.vercel.app"],
  methods:["POST","GET"],
  credentials:true
  
} ));

app.use(express.json());

mongoose
  .connect("mongodb+srv://arpitgoyal841:chatapibackend@cluster0.70d8dwg.mongodb.net/mern-chat?retryWrites=true&w=majority")
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(5000, () =>
  console.log(`Server started on ${5000}`)
);
const io = socket(server, {
  cors: {
    origin: "https://chat-app-frontend-gold-nine.vercel.app",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
