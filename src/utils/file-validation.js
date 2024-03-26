const { MAX_FILE_SIZE_MB } = require("../config");
const { apiResponse, mbToBytes, allowedTypes } = require("../utils/helper");
const MESSAGES = require("./message");
const HTTP_STATUS = require("../utils/httpStatus");

const validateFile = (req) => {
  let uploadedFile = req.files ? req.files.file : null;
  // Check if files were included in the request body
  if (!uploadedFile) {
    return apiResponse(
      false,
      null,
      MESSAGES.FIELD_EMPTY_ERROR,
      null,
      HTTP_STATUS.BAD_REQUEST
    );
  }
  if (Array.isArray(uploadedFile)) {
    return apiResponse(
      false,
      null,
      MESSAGES.MULTIPLE_FILES_ERROR,
      null,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const maxSizeInBytes = mbToBytes(parseInt(MAX_FILE_SIZE_MB));
  // Check file size
  if (parseInt(uploadedFile.size) > maxSizeInBytes) {
    const errorMessage = MESSAGES.FILE_SIZE_EXCEEDED_ERROR(MAX_FILE_SIZE_MB);
    return apiResponse(
      false,
      null,
      errorMessage,
      null,
      HTTP_STATUS.BAD_REQUEST
    );
  }
  // Check file type
  const fileExtension = uploadedFile.name.split(".").pop().toLowerCase();
  if (!allowedTypes.includes(fileExtension)) {
    const errorMessage = MESSAGES.FILE_TYPE_UNSUPPORTED_ERROR(allowedTypes);
    return apiResponse(
      false,
      null,
      errorMessage,
      null,
      HTTP_STATUS.BAD_REQUEST
    );
  }
  return true;
};

module.exports = validateFile;
