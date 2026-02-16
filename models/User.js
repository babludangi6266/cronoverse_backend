const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Made Required
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true }, // Made Required
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Employee'], default: 'Employee' },
  areaOfInterest: {
    type: String,
    enum: [
      'Social Media Content Creator (On-Camera)',
      'Business Development Executive',
      'Video Editor',
      'Content Writer / Strategist',
      'Full-Stack Web Developer',
      'Mobile App Developer (Android/iOS)'
    ]
  },
  city: { type: String, required: true },
  state: { type: String, required: true },
  type: { type: String, enum: ['Full-Time', 'Part-Time'], required: true },
  status: { type: String, enum: ['Pending', 'Active', 'Rejected'], default: 'Pending' },
  onboardingSubmission: {
    text: String,
    link: String,
    submittedAt: Date
  }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);