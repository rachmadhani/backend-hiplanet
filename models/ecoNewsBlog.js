const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EcoNewsBlog = sequelize.define('EcoNewsBlog', {
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
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Category is required' }
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
  tableName: 'econews_blog',
  timestamps: true
});

module.exports = EcoNewsBlog;
