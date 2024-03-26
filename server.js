const express = require("express");
const { PORT } = require("./src/config");
const expressApp = require("./src/express-app");
const { initializeDatabase } = require("./src/database");
const cleanupJob = require("./src/job/cleanupJob");

const StartServer = async () => {
  // Use the imported expressApp directly
  const app = expressApp;
  // Connect to the database and synchronize models
  await initializeDatabase();
  // Start any cleanup jobs
  await cleanupJob();
  // Start the server and listen on the specified port
  await app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
};
StartServer().catch((err) => {
  console.error("Error starting server:", err);
});
