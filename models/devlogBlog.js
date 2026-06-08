const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DevlogBlog = sequelize.define('DevlogBlog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Title is required' }
    }
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Author is required' }
    }
  },
  description: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Description is required' }
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'Category is required' }
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Slug is required' }
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date_created: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'devlog_blogs',
  timestamps: true
});

module.exports = DevlogBlog;
