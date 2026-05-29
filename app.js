const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

// Enable CORS with dynamic allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.includes(origin) || allowedOrigins.includes('*') || allowedOrigins.length === 0;
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false); // blocks origin at browser level
    }
  },
  credentials: true
}));

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
