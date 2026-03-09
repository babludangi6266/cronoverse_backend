const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/roleMiddleware');
const { getClients, addClient, updateClientStatus ,addClientNote } = require('../controllers/clientController');

router.get('/', protect, getClients);
router.post('/', protect, adminOnly, addClient);
router.put('/:id/status', protect, adminOnly, updateClientStatus);
router.post('/:id/notes', protect, adminOnly, addClientNote);

module.exports = router;