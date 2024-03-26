const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const FileStorageInterface = require("../interfaces/fileStorageInterface");
const { generateKeys, apiResponse } = require("../utils/helper");
const {
  deleteFileFromStorage,
  dailyUploadLimit,
  dailyDownloadLimit,
} = require("../services/fileService");
const { File } = require("../database/models");
const MESSAGES = require("../utils/message");
const HTTP_STATUS = require("../utils/httpStatus");

class LocalFileStorage extends FileStorageInterface {
  constructor(uploadDir) {
    super();
    this.uploadDir = uploadDir;
  }
  uploadFile = async (file, req) => {
    return new Promise((resolve, reject) => {
      // Generate a unique filename with date and time prefix
      const datePrefix = new Date()
        .toISOString()
        .replace(/:/g, "-")
        .replace(/\..+/, "");
      const trimmedFileName = file.name.trim();
      const fileName = `${datePrefix}-${uuidv4()}-${trimmedFileName}`;
      // Move the file to the upload directory
      file.mv(path.join(this.uploadDir, fileName), async (err) => {
        if (err) {
          reject(err);
        } else {
          try {
            // Resolve with the uploaded file's information
            const filePath = path.join(this.uploadDir, fileName);
            const { publicKey, privateKey } = generateKeys();
            const dailyUploadLimitExceeded = await dailyUploadLimit(req);
            if (dailyUploadLimitExceeded) {
              await File.create({
                fileName,
                filePath,
                publicKey,
                privateKey,
              });
              const data = {
                publicKey,
                privateKey,
              };
              const response = apiResponse(
                true,
                data,
                null,
                MESSAGES.FILE_UPLOADED_SUCCES,
                HTTP_STATUS.OK
              );
              resolve(response);
            } else {
              throw new Error(MESSAGES.DAILY_FILE_UPLOAD_LIMIT_ERROR);
            }
          } catch (error) {
            const response = apiResponse(
              false,
              null,
              MESSAGES.DAILY_FILE_UPLOAD_LIMIT_ERROR,
              null,
              HTTP_STATUS.NOT_FOUND
            );
            reject(response);
          }
        }
      });
    });
  };

  downloadFile = async (res, publicKey, req) => {
    try {
      const file = await File.findOne({ where: { publicKey } });

      if (!file) {
        return apiResponse(
          false,
          null,
          MESSAGES.NO_DATA_FOUND_ERROR,
          null,
          HTTP_STATUS.NOT_FOUND
        );
      }
      const filePath = file.filePath;
      //Check if the file exists
      if (!fs.existsSync(filePath)) {
        if (!file) {
          return apiResponse(
            false,
            null,
            MESSAGES.FILES_NOT_FOUND,
            null,
            HTTP_STATUS.NOT_FOUND
          );
        }
      }
      res.setHeader("Content-Disposition", `attachment; filename="test.png"`);
      const fileStream = fs.createReadStream(filePath);
      // Pipe the file stream to the response object
      fileStream.pipe(res);
      if (await dailyDownloadLimit(req)) {
        file.update({ downloadedAt: new Date() }, { where: { publicKey } });
      }
    } catch (error) {
      return apiResponse(
        false,
        null,
        MESSAGES.INTERNAL_SERVER_ERROR,
        null,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  };

  deleteFile = async (privateKey) => {
    // Find all files with the given privateKey
    const file = await File.findOne({ where: { privateKey } });
    if (!file) {
      return apiResponse(
        false,
        null,
        MESSAGES.NO_DATA_FOUND_ERROR,
        null,
        HTTP_STATUS.NOT_FOUND
      );
    }
    const deletionResult = await deleteFileFromStorage(file.filePath);
    await file.destroy();
    if (deletionResult) {
      return apiResponse(
        true,
        null,
        null,
        MESSAGES.FILE_DELETE_SUCCESS,
        HTTP_STATUS.OK
      );
    } else {
      return apiResponse(
        false,
        null,
        MESSAGES.NO_DATA_FOUND_ERROR,
        null,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  };
}

module.exports = LocalFileStorage;
