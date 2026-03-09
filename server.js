require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const Chat = require('./models/Chat');

// Connect DB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  },
  // --- NEW: Render Stability Settings ---
  pingTimeout: 60000,     // Wait 60 seconds before closing an idle connection
  pingInterval: 25000,    // Send a heartbeat every 25 seconds to keep Render awake
  transports: ['websocket', 'polling']
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes')); // Create these files mapping to controllers
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/bot', require('./routes/botRoutes'));

// Replace your existing io.on('connection') with this:
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a specific room (Community or Private DM)
  socket.on('join_room', (room) => {
    socket.join(room);
  });

  socket.on('send_message', async (data) => {
    try {
      // 1. Save to Database with the dynamic room ID
      const newChat = new Chat({ 
        sender: data.senderId, 
        message: data.message,
        room: data.room 
      });
      await newChat.save();
      
      // 2. Broadcast to everyone in that specific room
      io.to(data.room).emit('receive_message', data);
    } catch (err) {
      console.error("Error saving chat:", err);
    }
  });

  socket.on('clear_chat_event', (room) => {
    io.to(room).emit('chat_was_cleared', room);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
const PORT = process.env.PORT || 5005;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));