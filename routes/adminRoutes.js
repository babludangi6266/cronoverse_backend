const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/roleMiddleware');
const { getUsers, reviewOnboarding, getReports } = require('../controllers/adminController');

router.get('/users', protect, adminOnly, getUsers);
router.post('/review', protect, adminOnly, reviewOnboarding);
router.get('/reports', protect, adminOnly, getReports);
module.exports = router;