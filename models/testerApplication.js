const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TesterApplication = sequelize.define('TesterApplication', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  platform: {
    type: DataTypes.STRING,
    allowNull: false
  },
  why: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nda: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'approved', 'rejected']]
    }
  },
  build_platform: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'MacOS',
    validate: {
      isIn: [['MacOS', 'Windows']]
    }
  }
}, {
  tableName: 'tester_applications',
  timestamps: true
});

module.exports = TesterApplication;
