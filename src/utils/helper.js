const { v4: uuidv4 } = require("uuid");
const { ALLOWED_FILE_TYPES } = require("../config");

//Function to generate unique private and public key
const generateKeys = () => {
  const publicKey = uuidv4();
  const privateKey = uuidv4();
  return { publicKey, privateKey };
};

//Functon to check the provided it today
const isToday = (dateString) => {
  const today = new Date();
  const date = new Date(dateString);
  return date.toDateString() === today.toDateString();
};

const periodInMillis = (period) => {
  const parsedPeriod = parseInt(period);
  if (parsedPeriod <= 0 || isNaN(parsedPeriod)) {
    return 0;
  }
  // return parsedPeriod * 24 * 60 * 60 * 1000;
  return parsedPeriod * 60 * 1000;
};

// Calculate date based on the period of inactivity
const thresholdDate = (periodInMillis) => {
  return new Date(new Date() - periodInMillis);
};

// Function to convert megabytes to bytes
const mbToBytes = (mb) => {
  // Check if the input is a valid number
  if (typeof mb !== "number" || isNaN(mb) || mb < 0) {
    return 0;
  }
  return Math.floor(mb * 1024 * 1024);
};

//allowed file type array
const allowedTypes = (ALLOWED_FILE_TYPES || "")
  .split(",")
  .map((type) => type.trim().toLowerCase());

// Common  API response
const apiResponse = (
  status,
  data = null,
  errors = null,
  message = null,
  code
) => {
  const response = {
    success: status,
    message: message,
    data: data,
    error: errors,
    code: code,
  };
  return response;
};

module.exports = {
  generateKeys,
  isToday,
  periodInMillis,
  thresholdDate,
  mbToBytes,
  allowedTypes,
  apiResponse,
};
