const express = require('express');
const router = express.Router();
const { askLexaBot } = require('../controllers/botController');

router.post('/ask', askLexaBot); // Public route, no auth required

module.exports = router;