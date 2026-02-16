const Chat = require('../models/Chat');

exports.getChatHistory = async (req, res) => {
  try {
    // 1. Sort by -1 (Newest first) to get the LATEST 50 messages
    const messages = await Chat.find({ room: 'community' })
      .sort({ createdAt: -1 }) 
      .limit(50)
      .populate('sender', 'name email'); // Populate user details
      
    // 2. Reverse the array so the frontend receives them Oldest -> Newest
    // (This ensures they appear in the correct order in the chat window)
    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};