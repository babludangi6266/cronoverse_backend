const User = require('../models/User');
const Task = require('../models/Task');
const sendEmail = require('../utils/emailService');

// Get All Users with Filters
exports.getUsers = async (req, res) => {
  try {
    const { areaOfInterest, city, type } = req.query;
    let query = { role: 'Employee' };
    if (areaOfInterest) query.areaOfInterest = areaOfInterest;
    if (city) query.city = city;
    if (type) query.type = type;

    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Review Onboarding Task
exports.reviewOnboarding = async (req, res) => {
  try {
    const { userId, action } = req.body; // action: 'Approve' or 'Reject'
    const user = await User.findById(userId);

   if (action === 'Approve') {
  user.status = 'Active';
  try {
    await sendEmail(
      user.email, 
      "Welcome to Lexa!", 
      // Use user.name here
      `<h1>Hi ${user.name},</h1><p>Your task has been approved! Welcome to the team.</p>`
    );
  } catch (e) { console.error(e); }
}
 else {
      user.status = 'Rejected'; // Or reset to pending
      await sendEmail(user.email, "Task Update", "<p>Your submission needs work.</p>");
    }
    await user.save();
    res.json({ message: `User ${action}d` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reports
exports.getReports = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'Employee' });
    const activeUsers = await User.countDocuments({ status: 'Active' });
    const pendingUsers = await User.countDocuments({ status: 'Pending' });
    const completedTasks = await Task.countDocuments({ status: 'Completed' });

    res.json({ totalUsers, activeUsers, pendingUsers, completedTasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};