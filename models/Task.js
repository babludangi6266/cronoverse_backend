const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  dueDate: Date,
  isPersonal: { type: Boolean, default: false },

  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client',
    required: false // Optional, because some tasks are internal HR tasks
  },

  notes: [
  {
    text: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedByName: { type: String }, // Store name for easy frontend display
    createdAt: { type: Date, default: Date.now }
  }
],
timeLogged: { 
    type: Number, 
    default: 0 
  },
  // NEW FIELD: Frequency
  frequency: { 
    type: String, 
    enum: ['One-time', 'Daily', 'Weekly', 'Monthly'], 
    default: 'One-time' 
  }

}, { timestamps: true });

module.exports = mongoose.models.Task || mongoose.model('Task', taskSchema);