const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/roleMiddleware');
const { getChatHistory, getChatUsers , clearChat } = require('../controllers/chatController');

router.get('/history', protect, getChatHistory);
router.get('/users', protect, getChatUsers); // <--- Add this line
router.delete('/clear/:room', protect,adminOnly ,  clearChat); // <--- Add this line

module.exports = router;