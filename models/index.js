const sequelize = require('../config/database');
const User = require('./user');
const TesterApplication = require('./testerApplication');

const db = {
  sequelize,
  User,
  TesterApplication
};

// Define associations/relationships here if needed
// e.g. User.hasMany(Post);

module.exports = db;
