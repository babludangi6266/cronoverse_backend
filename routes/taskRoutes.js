const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/roleMiddleware');
const { 
  submitOnboarding, 
  assignTask, 
  getMyTasks, 
  createPersonalTask, 
  updateTaskStatus, 
  deleteTask,
  getUserTasks 
} = require('../controllers/taskController');

// Employee Routes
router.post('/onboarding', protect, submitOnboarding);
router.get('/my-tasks', protect, getMyTasks);
router.post('/personal', protect, createPersonalTask); // Create ToDo
router.put('/:taskId/status', protect, updateTaskStatus); // Update Status
router.delete('/:taskId', protect, deleteTask); // Delete Personal Task

// Admin Routes
router.post('/assign', protect, adminOnly, assignTask);
router.get('/user/:userId', protect, adminOnly, getUserTasks); // Admin see specific user tasks

module.exports = router;