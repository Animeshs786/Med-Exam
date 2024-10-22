process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  console.log(err.stack); // Log full stack trace
  process.exit(1);
});

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = require("./src/app");
const ChatMessage = require("./src/models/chatMessage");

dotenv.config({ path: "config.env" });

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connection created successfully."))
  .catch((err) => console.log(err));

const Port = process.env.PORT || 7000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000,
});

// app.use(
//   cors({
//     origin: "https://admin.medexamsprep.in", // Allow only your frontend domain
//     methods: ["GET", "POST"], // Specify allowed methods
//     credentials: true, // Allow cookies if needed
//   })
// );

const users = {};

// Attach io instance and users object to app locals
app.locals.io = io;
app.locals.users = users;

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    if (userData && userData._id) {
      users[userData._id] = socket.id;
      console.log(`${userData._id} joined`);
      socket.emit("connected");
    }
  });

  socket.on("joinClass", ({ userId, classId = "668cdb92433d0ebad62fb2dc" }) => {
    console.log(`${userId} joined class ${classId}`);
    socket.join(classId);
  });

  socket.on(
    "sendMessage",
    async ({ userId, classId = "668cdb92433d0ebad62fb2dc", message = "z" }) => {
      const chatMessage = await ChatMessage.create({
        userId,
        classId,
        message,
      });
      const findChatMessage = await ChatMessage.findById(
        chatMessage._id
      ).populate("userId", "name profileImage");
      io.to(classId).emit("newMessage", findChatMessage);
    }
  );

  socket.on("disconnect", () => {
    for (const [userId, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});

server.listen(Port, () => console.log(`Server running on port: ${Port}`));

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  console.log(err.stack); // Log full stack trace
  server.close(() => {
    process.exit(1);
  });
});
