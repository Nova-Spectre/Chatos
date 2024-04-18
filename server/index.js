import express from "express";
import http from "http";
import { Server as socketIo } from "socket.io";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import Conversation from "./Model/Conversation.js"; 
import routes from "./Routes/routes.js";



const app = express();
const server = http.createServer(app);
const io = new socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"], // Add more HTTP methods if needed
  },
});
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
const port = process.env.PORT || 3000;

//middlewares
app.use(express.static(path.dirname(__dirname, "public")));
app.use(cors());
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

//Mongo Setup
mongoose
  .connect(process.env.MONGO_URL, {
    useNewURLParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`MongoDB connected`))
  .catch((err) => console.log(err));



//Sockets
io.use((socket, next) => {
  socket.request.headers.origin = "*"; // Allow requests from any origin
  next();
});

io.on("connection", (socket) => {
  console.log(`User Connected`, socket.id);
  socket.status = "online";
  socket.broadcast.emit("userStatus", { id: socket.id, status: socket.status });

  //listen for status
  socket.on("statusUpdate", (status) => {
    socket.status = status;
    socket.broadcast.emit("userStatus", {
      id: socket.id,
      status: socket.status,
    });
  });

socket.on("sendMessage", async (message) => {
    console.log(`Message Received from ${socket.id} : `, message);
    try {
      // Create a new message document
      const newMessage = {
        sender: message.sender,
        receiver: message.receiver,
        content: message.content,
      };

      // Find or create a conversation between sender and receiver
      let conversation = await Conversation.findOne({
        members: { $all: [message.sender, message.receiver] },
      });

      if (!conversation) {
        conversation = new Conversation({
          members: [message.sender, message.receiver],
          messages: [],
        });
      }

      // Add the message to the conversation
      conversation.messages.push(newMessage);

      // Save the conversation
      await conversation.save();

      // Emit the message to all connected clients
      io.emit("message", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });


  //handle disconnect
  socket.on("disconnect", () => {
    console.log(`User Disconnected`, socket.id);
    socket.status = "offline";
    socket.broadcast.emit("userStatus", {
      id: socket.id,
      status: socket.status,
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

//Routes
app.use('/chatos', routes);

server.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
