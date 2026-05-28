const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Healthcheck endpoint
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend API is running',
    timestamp: new Date()
  });
});

// Test connection endpoint
router.get('/test', async (req, res) => {
  try {
    const { sequelize } = require('../models');
    // Run a simple query to verify connection
    const [results] = await sequelize.query('SELECT 1 + 1 AS result');
    res.status(200).json({
      success: true,
      message: 'Database connection test successful',
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection test failed',
      error: error.message
    });
  }
});

// User routes
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);

module.exports = router;
