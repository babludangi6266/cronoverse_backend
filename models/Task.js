const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  dueDate: Date,
  isPersonal: { type: Boolean, default: false },
  // NEW FIELD: Frequency
  frequency: { 
    type: String, 
    enum: ['One-time', 'Daily', 'Weekly', 'Monthly'], 
    default: 'One-time' 
  }
}, { timestamps: true });

module.exports = mongoose.models.Task || mongoose.model('Task', taskSchema);