const MESSAGES = {
  ROUTE_NOT_FOUND: "Route not found",
  INTERNAL_SERVER_ERROR: "Internal server error",
  NO_DATA_FOUND_ERROR: "No data found or invalid key",
  FILE_UPLOADED_SUCCES: "File uploaded successfully",
  FILE_DELETE_SUCCESS: "File deleted successfully",
  FIELD_EMPTY_ERROR: "No file was selected",
  MULTIPLE_FILES_ERROR: "Please select only one file",
  FILES_NOT_FOUND: "File not found",
  DAILY_FILE_UPLOAD_LIMIT_ERROR: "Your daily file upload limit exceeded",
  DAILY_FILE_DOWNLOAD_LIMIT_ERROR: "Your daily file download limit exceeded",
  INVALID_REQUEST: "Invalid request",
  METHOD_NOT_IMPLEMENTED: "Method not implemented",
  INVALID_STORAGE_PROVIDER: "Invalid storage provided",
  FILE_SIZE_EXCEEDED_ERROR: (maxSizeMB) =>
    `File size exceeds the maximum allowed size (${maxSizeMB}MB)`,
  FILE_TYPE_UNSUPPORTED_ERROR: (allowedTypes) =>
    `Unsupported file type. Supported file types are (${allowedTypes})`,
};
module.exports = MESSAGES;
