const authService = require('../services/authService');

// Register user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate inputs (controller validation)
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    const data = await authService.register(username, email, password);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to register user'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Validate inputs
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/Username and password are required'
      });
    }

    const data = await authService.login(identifier, password);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to log in'
    });
  }
};
