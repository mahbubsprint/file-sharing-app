const { RequestLimit } = require("../database/models");
const { isToday, apiResponse } = require("../utils/helper");
const { DAILY_UPLOAD_REQUEST_LIMIT } = require("../config");
const HTTP_STATUS = require("../utils/httpStatus");
const MESSAGES = require("../utils/message");

const checkUploadRequestLimit = async (req, res, next) => {
  try {
    const clientId = req.ip;
    // Find the RequestLimit record for the given IP address
    const requestLimit = await RequestLimit.findOne({ where: { clientId } });
    if (
      !requestLimit ||
      (isToday(requestLimit.createdAt) &&
        requestLimit.daily_upload < parseInt(DAILY_UPLOAD_REQUEST_LIMIT)) ||
      !isToday(requestLimit.createdAt)
    ) {
      next();
    } else {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          apiResponse(
            false,
            null,
            MESSAGES.DAILY_FILE_UPLOAD_LIMIT_ERROR,
            null,
            HTTP_STATUS.BAD_REQUEST
          )
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(
        apiResponse(
          false,
          null,
          MESSAGES.INTERNAL_SERVER_ERROR,
          null,
          HTTP_STATUS.BAD_REQUEST
        )
      );
  }
};

module.exports = checkUploadRequestLimit;
