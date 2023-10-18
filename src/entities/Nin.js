const { DataTypes } = require('sequelize');
const { sequelize } = require('./database');

const Nin = sequelize.define('Nin', {
   id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ninNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
});

module.exports = Nin;
