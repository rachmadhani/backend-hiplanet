const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

// Enable CORS
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/api', apiRoutes);

// Root endpoint redirect or message
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Hiplanet API. Use /api/status to check server status.'
  });
});

// Catch 404 errors
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = app;
