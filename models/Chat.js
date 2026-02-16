const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  room: { type: String, default: 'community' }, // 'community' or specific rooms
}, { timestamps: true });
module.exports = mongoose.models.Chat || mongoose.model('Chat', chatSchema);