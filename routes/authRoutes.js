const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Show login form
router.get('/login', authController.showLoginForm);

// Handle login
router.post('/login', authController.login);

// Handle logout
router.post('/logout', authController.logout);

module.exports = router;
