const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'hiplanet_jwt_secret_key_2026_change_me',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

class AuthService {
  async register(username, email, password) {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      const error = new Error('Username or email already exists');
      error.statusCode = 400;
      throw error;
    }

    // Create user (hooks in models/user.js automatically hash the password)
    const newUser = await User.create({
      username,
      email,
      password
    });

    // Remove password from response object
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    // Generate token
    const token = generateToken(newUser.id);

    return {
      user: userResponse,
      token
    };
  }

  async login(identifier, password) {
    // Find user by username or email
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Remove password from response object
    const userResponse = user.toJSON();
    delete userResponse.password;

    // Generate token
    const token = generateToken(user.id);

    return {
      user: userResponse,
      token
    };
  }
}

module.exports = new AuthService();
