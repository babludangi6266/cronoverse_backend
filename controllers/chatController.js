const Chat = require('../models/Chat');
const User = require('../models/User');

// Get history for a specific room (Community or 1-on-1)
exports.getChatHistory = async (req, res) => {
  try {
    const room = req.query.room || 'community';
    const messages = await Chat.find({ room })
      .sort({ createdAt: -1 }) 
      .limit(50)
      .populate('sender', 'name email role'); 
      
    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a list of all active users for the DM sidebar
exports.getChatUsers = async (req, res) => {
  try {
    // Return all active users EXCEPT the currently logged-in user
    const users = await User.find({ 
      _id: { $ne: req.user.id }, 
      status: 'Active' 
    }).select('name role');
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- ADMIN: Clear Chat Room History ---
exports.clearChat = async (req, res) => {
  try {
    const { room } = req.params;
    await Chat.deleteMany({ room });
    res.json({ message: "Chat history cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};