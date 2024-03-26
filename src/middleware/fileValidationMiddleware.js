const validateFile = require("../utils/file-validation");
const HTTP_STATUS = require("../utils/httpStatus");
const fileValidationMiddleware = (req, res, next) => {
  // Validate uploaded files using the validateFile function
  const validationResult = validateFile(req, res);
  if (validationResult?.success === false) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(validationResult);
  }
  next();
};

module.exports = fileValidationMiddleware;
