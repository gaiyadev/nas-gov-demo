// bvn.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("./database");

const Bvn = sequelize.define("Bvn", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  bvnNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
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
});

module.exports = Bvn;
