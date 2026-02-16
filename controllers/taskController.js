const Task = require('../models/Task');
const User = require('../models/User');

// --- COMMON: Get Tasks ---
exports.getMyTasks = async (req, res) => {
  try {
    // Get tasks where the user is the assignee
    const tasks = await Task.find({ assignedTo: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- EMPLOYEE: Create Personal Todo ---
exports.createPersonalTask = async (req, res) => {
  try {
    // added frequency to destructuring
    const { title, description, dueDate, frequency } = req.body;
    
    const newTask = new Task({
      title,
      description,
      dueDate,
      frequency: frequency || 'One-time', // Default to One-time if empty
      assignedTo: req.user.id,
      assignedBy: req.user.id,
      isPersonal: true,
      status: 'Pending'
    });
    
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- EMPLOYEE: Update Task Status (e.g., Pending -> Completed) ---
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body; // 'In Progress' or 'Completed'
    
    const task = await Task.findOne({ _id: taskId, assignedTo: req.user.id });
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.status = status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- EMPLOYEE: Delete Personal Task ---
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    // Only allow deleting if it's a personal task
    const task = await Task.findOneAndDelete({ _id: taskId, assignedTo: req.user.id, isPersonal: true });
    
    if (!task) return res.status(403).json({ error: "Cannot delete Admin assigned tasks or task not found" });
    
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- ONBOARDING ---
exports.submitOnboarding = async (req, res) => {
  try {
    const { text, link } = req.body;
    const user = await User.findById(req.user.id);
    user.onboardingSubmission = { text, link, submittedAt: new Date() };
    user.status = 'Pending'; // Ensure status is pending review
    await user.save();
    res.json({ message: "Task submitted. Under review." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- ADMIN: Assign Task (Already Exists, keeping for reference) ---
exports.assignTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;
    const newTask = new Task({
      title, description, assignedTo, dueDate,
      assignedBy: req.user.id,
      isPersonal: false,
      status: 'Pending'
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- ADMIN: View All User Tasks ---
exports.getUserTasks = async (req, res) => {
    try {
        const { userId } = req.params;
        const tasks = await Task.find({ assignedTo: userId }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};