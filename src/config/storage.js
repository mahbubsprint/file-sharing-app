const fs = require("fs");
const LocalFileStorage = require("../services/localFileStorage");
const GoogleCloudStorage = require("../services/googleCloudStorage");
const { STORAGEPROVIDER, FOLDER, BUCKET_NAME } = require("../config");
const { LOCAL, GOOGLE_CLOUD } = require("../config/constant");
const { INVALID_STORAGE_PROVIDER } = require("../utils/message");

// Initialize and export the storage provider instance based on the configuration
let storageProvider;

switch (STORAGEPROVIDER) {
  case LOCAL:
    if (!fs.existsSync(FOLDER)) {
      fs.mkdirSync(FOLDER, { recursive: true });
    }
    storageProvider = new LocalFileStorage(FOLDER);
    break;
  case GOOGLE_CLOUD:
    storageProvider = new GoogleCloudStorage(BUCKET_NAME);
    break;
  default:
    throw new Error(INVALID_STORAGE_PROVIDER);
}

module.exports = storageProvider;
