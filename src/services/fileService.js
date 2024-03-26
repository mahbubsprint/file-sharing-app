const fs = require("fs");
const { RequestLimit } = require("../database/models");
const {
  DAILY_UPLOAD_REQUEST_LIMIT,
  DAILY_DOWNLOAD_REQUEST_LIMIT,
} = require("../config");
const { isToday } = require("../utils/helper");

//Function to remove file from local storage
const deleteFileFromStorage = async (filePath) => {
  try {
    if (!filePath) {
      return false;
    }
    await fs.promises.unlink(filePath); // Use fs.promises.unlink for asynchronous deletion
    return true;
  } catch (error) {
    return false;
  }
};

// Function to check if the daily upload limit for a client is exceeded
const dailyUploadLimit = async (req) => {
  try {
    const clientId = req.ip;
    // Query the requestLimit table to find data for the provided clientId
    const requestLimit = await RequestLimit.findOne({ where: { clientId } });
    if (!requestLimit) {
      // No data found, so daily upload limit is not exceeded
      await RequestLimit.create({
        clientId,
        daily_upload: 1,
      });
      return true;
    } else if (
      requestLimit &&
      isToday(requestLimit.createdAt) &&
      requestLimit.daily_upload < parseInt(DAILY_UPLOAD_REQUEST_LIMIT)
    ) {
      await requestLimit.update({
        daily_upload: parseInt(requestLimit.daily_upload) + 1,
      });
      return true;
    } else if (requestLimit && !isToday(requestLimit.createdAt)) {
      await requestLimit.destroy();
      await RequestLimit.create({
        clientId,
        daily_upload: 1,
      });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return true;
  }
};

// Function to check if the daily download limit for a client is exceeded
const dailyDownloadLimit = async (req) => {
  try {
    const clientId = req.ip;
    // Query the requestLimit table to find data for the provided clientIp
    const requestLimit = await RequestLimit.findOne({ where: { clientId } });
    if (!requestLimit) {
      // No data found, so daily upload limit is not exceeded
      await RequestLimit.create({
        clientId,
        daily_download: 1,
      });
      return true;
    } else if (
      requestLimit &&
      isToday(requestLimit.createdAt) &&
      requestLimit.daily_download < parseInt(DAILY_DOWNLOAD_REQUEST_LIMIT)
    ) {
      await requestLimit.update({
        daily_download: parseInt(requestLimit.daily_download) + 1,
      });
      return true;
    } else if (requestLimit && !isToday(requestLimit.createdAt)) {
      await requestLimit.destroy();
      await RequestLimit.create({
        clientId,
        daily_download: 1,
      });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return true;
  }
};

module.exports = {
  deleteFileFromStorage,
  dailyUploadLimit,
  dailyDownloadLimit,
};
