const sequelize = require('../config/database');
const User = require('./user');

const db = {
  sequelize,
  User
};

// Define associations/relationships here if needed
// e.g. User.hasMany(Post);

module.exports = db;
