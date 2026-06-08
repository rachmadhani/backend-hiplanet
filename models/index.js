const sequelize = require('../config/database');
const User = require('./user');
const TesterApplication = require('./testerApplication');
const EcoNewsBlog = require('./ecoNewsBlog');
const DevlogCategory = require('./devlogCategory');
const DevlogBlog = require('./devlogBlog');

const db = {
  sequelize,
  User,
  TesterApplication,
  EcoNewsBlog,
  DevlogCategory,
  DevlogBlog
};

// Define associations/relationships here if needed
DevlogCategory.hasMany(DevlogBlog, { foreignKey: 'category_id', as: 'blogs' });
DevlogBlog.belongsTo(DevlogCategory, { foreignKey: 'category_id', as: 'category' });

module.exports = db;
