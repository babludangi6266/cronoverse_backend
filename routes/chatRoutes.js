const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getChatHistory } = require('../controllers/chatController');

// Get all messages
router.get('/history', protect, getChatHistory);

module.exports = router;