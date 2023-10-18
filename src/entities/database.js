// database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'path/to/your/database.sqlite', // Path to your SQLite database file
});

module.exports = { sequelize };
