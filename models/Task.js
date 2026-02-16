const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  dueDate: Date,
  isPersonal: { type: Boolean, default: false },
}, { timestamps: true });

// CHANGE THIS LINE:
// Check if 'Task' model exists; if yes, use it. If no, create it.
module.exports = mongoose.models.Task || mongoose.model('Task', taskSchema);