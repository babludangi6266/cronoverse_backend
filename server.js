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
    // origin: process.env.CLIENT_URL, 
    origin: "*", // Allow all origins for testing, change in production
    methods: ["GET", "POST" , "PUT", "DELETE" , "PATCH"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes')); // Create these files mapping to controllers
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Socket.io Logic (Chat)
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join Community
  socket.on('join_community', () => {
    socket.join('community');
  });

  // Send Message
  socket.on('send_message', async (data) => {
    // data = { senderId, message, name }
    const newChat = new Chat({ sender: data.senderId, message: data.message });
    await newChat.save();
    
    // Broadcast to everyone in 'community'
    io.to('community').emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));