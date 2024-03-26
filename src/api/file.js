const storageProvider = require("../config/storage");
const fileValidationMiddleware = require("../middleware/fileValidationMiddleware");
const checkUploadRequestLimit = require("../middleware/uploadLimitMiddleware");
const checkDownloadRequestLimit = require("../middleware/downloadLimitMiddleware");
const MESSAGES = require("../utils/message");
const { apiResponse } = require("../utils/helper");
const HTTP_STATUS = require("../utils/httpStatus");

module.exports = (app) => {
  app.post(
    "/files",
    checkUploadRequestLimit,
    fileValidationMiddleware,
    async (req, res) => {
      try {
        // 'file' is the name attribute in the form field
        let uploadedFile = req.files.file;
        const fileUpload = await storageProvider.uploadFile(uploadedFile, req);
        return res.status(fileUpload.code).json(fileUpload);
      } catch (error) {
        return res
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
          .json(
            apiResponse(
              false,
              null,
              MESSAGES.INTERNAL_SERVER_ERROR,
              null,
              HTTP_STATUS.INTERNAL_SERVER_ERROR
            )
          );
      }
    }
  );

  app.delete("/files/:privateKey", async (req, res) => {
    const { privateKey } = req.params;
    const deleteFiles = await storageProvider.deleteFile(privateKey);
    return res.status(deleteFiles.code).json(deleteFiles);
  });

  app.get("/files/:publicKey", checkDownloadRequestLimit, async (req, res) => {
    const { publicKey } = req.params;
    const downLoadFile = await storageProvider.downloadFile(
      res,
      publicKey,
      req
    );
    if (downLoadFile) {
      return res.status(downLoadFile.code).json(downLoadFile);
    }
  });
};
