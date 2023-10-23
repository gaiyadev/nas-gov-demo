// user.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./database'); // Import your Sequelize instance

const User = sequelize.define('User', {
     id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
    jobtitle: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  
  local: {
    type: DataTypes.STRING,
    allowNull: false,
  },
    disabilityStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uniqueNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
