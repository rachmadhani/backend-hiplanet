const sequelize = require('../config/database');
const User = require('./user');
const TesterApplication = require('./testerApplication');
const EcoNewsBlog = require('./ecoNewsBlog');

const db = {
  sequelize,
  User,
  TesterApplication,
  EcoNewsBlog
};

// Define associations/relationships here if needed
// e.g. User.hasMany(Post);

module.exports = db;
