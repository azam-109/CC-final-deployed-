import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv"; // For loading env vars from .env file
import { createServer } from "http";            // ← NEW
import { Server } from "socket.io";             // ← NEW


// Load env vars
dotenv.config();


// Import custom files
import connectToMongodb from "./connect.js";
import userRoute from "./routes/user.js";
import questionRoutes from "./routes/question.js";
import answerRoutes from "./routes/answer.js";
import blogRoutes from "./routes/blogRoutes.js";
import aiRoutes from "./routes/aiRoutes.js"; 
import chatRoutes from "./routes/chatRoutes.js"; // ← NEW
import Message from "./models/Message.js";       // ← NEW
import Conversation from "./models/Conversation.js"; // ← NEW
import presignRoutes from "./routes/presignRoutes.js";

// Create app
const app = express();
const httpServer = createServer(app); // // ← NEW: wrap express in http server



// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});


// Middleware
app.use(express.urlencoded({ extended: false }));  //
app.use(cookieParser()); // For parsing cookies
app.use(express.json()); //

// CORS: allow frontend in both dev & prod
// const allowedOrigins = [
//   "http://localhost:5173", // dev
//   process.env.FRONTEND_URL  // prod (Vercel URL)
// ];  


app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Routes
app.use("/user", userRoute);
app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);
app.use("/blogs", blogRoutes);
app.use("/ai", aiRoutes);
app.use("/chat", chatRoutes);  
app.use("/upload", presignRoutes);

// MongoDB connection
connectToMongodb(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Health check route (optional, useful for Render)
app.get('/',(req,res)=>{
  res.send('daksh is great');
})
app.get("/healthz", (req, res) => {
  res.send("ok");
});

// Socket.io event handlers
io.on("connection", (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Join a conversation room
  socket.on("join_room", (conversationId) => {
    socket.join(conversationId);
    console.log(`👤 User joined room: ${conversationId}`);
  });

  // Send message
  socket.on("send_message", async (data) => {
    const { conversationId, senderId, content } = data;

    try {
      // Save message to database
      const newMessage = await Message.create({
        conversation: conversationId,
        sender: senderId,
        content,

        // sender already read own message
        readBy: [senderId],
      });

      // Populate sender info
      await newMessage.populate("sender", "name role");

      // Update conversation latest message preview
      await Conversation.findByIdAndUpdate(
        conversationId,
        {
          lastMessage: content,
          lastMessageAt: new Date(),
        },
        { new: true }
      );

      // Emit to room
      io.to(conversationId).emit("receive_message", newMessage);

    } catch (err) {
      console.error("❌ Error saving message:", err);

      socket.emit("error", {
        message: "Failed to send message",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
