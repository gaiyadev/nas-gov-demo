// database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'path/to/your/nas_database.sqlite', // Path to your SQLite database file
});

module.exports = { sequelize };
