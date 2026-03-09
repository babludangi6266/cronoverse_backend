const Chat = require('../models/Chat');

const socketSetup = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // --- NOTIFICATIONS ---
    // Join a private room using the User's DB ID so they can receive private alerts
    socket.on('register_user', (userId) => {
      socket.join(userId);
    });

    // --- CHAT MESSENGER ---
    // Join a specific chat room (Community or Private DM)
    socket.on('join_room', (room) => {
      socket.join(room);
    });

    // Handle incoming messages
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

    // Handle Admin clearing the chat
    socket.on('clear_chat_event', (room) => {
      io.to(room).emit('chat_was_cleared', room);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = socketSetup;