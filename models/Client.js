const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  industry: { type: String }, 
  status: { 
    type: String, 
    enum: ['Lead', 'Negotiating', 'Active Client', 'Past Client'], 
    default: 'Lead' 
  },
  projectValue: { type: Number, default: 0 },
  // --- NEW: Interaction History Array ---
  notes: [
    {
      text: { type: String, required: true },
      addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      addedByName: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Client', clientSchema);