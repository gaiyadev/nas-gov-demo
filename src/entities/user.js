// user.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("./database"); // Import your Sequelize instance

const User = sequelize.define("User", {
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
  accessToHousing: {
    type: DataTypes.STRING,
    allowNull: true,
  }, 
  houseHoldCount: {
    type: DataTypes.NUMBER,
    allowNull: true,
  },
  incomeLevel: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  healthInsurance: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  homeOwnership: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otherSourcesOfIncome: {
    type: DataTypes.STRING,
    allowNull: true,
  },
    phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
});

module.exports = User;
