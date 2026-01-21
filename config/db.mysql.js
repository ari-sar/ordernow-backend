const { Sequelize } = require('sequelize');

// Replace with your local MySQL credentials
const sequelize = new Sequelize('atdrive_test', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false // Keeps your console clean during tests
});

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connection has been established successfully.');
    // sync() creates the table if it doesn't exist
    await sequelize.sync({ alter: true }); 
  } catch (error) {
    console.error('Unable to connect to the MySQL database:', error);
  }
};

module.exports = { sequelize, connectMySQL };