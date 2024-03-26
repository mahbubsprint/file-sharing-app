const dotEnv = require("dotenv");
const { PRODUCTION } = require("../config/constant");

if (process.env.NODE_ENV !== PRODUCTION) {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  STORAGEPROVIDER: process.env.STORAGEPROVIDER,
  FOLDER: process.env.FOLDER,
  MAX_FILE_SIZE_MB: process.env.MAX_FILE_SIZE_MB,
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES,
  DAILY_UPLOAD_REQUEST_LIMIT: process.env.DAILY_UPLOAD_REQUEST_LIMIT,
  DAILY_DOWNLOAD_REQUEST_LIMIT: process.env.DAILY_DOWNLOAD_REQUEST_LIMIT,
  PREIOD_OF_INACTIVITY: process.env.PREIOD_OF_INACTIVITY,
  CRON_EXPRESSION: process.env.CRON_EXPRESSION,
  DEFAULT_CRON_EXPRESSION: process.env.DEFAULT_CRON_EXPRESSION,
  BUCKET_NAME: process.env.BUCKET_NAME,
};
