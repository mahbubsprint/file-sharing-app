const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  // Path to SQLite file
  storage: "./database.sqlite",
  logging: false,
});

const initializeDatabase = async () => {
  try {
    // Attempt to authenticate the database connection
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (error) {
    process.exit(1);
  }
};
module.exports = { sequelize, initializeDatabase };
