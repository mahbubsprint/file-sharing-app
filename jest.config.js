const path = require("path");

module.exports = {
  verbose: true, // Display verbose output
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"], // Define test file patterns
  silent: false,
  setupFilesAfterEnv: ["./jest.setup.js"],
  modulePaths: [path.resolve(process.cwd(), "src")],
};
