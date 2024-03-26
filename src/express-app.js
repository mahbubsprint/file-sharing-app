const express = require("express");
const { file } = require("./api");
const upload = require("express-fileupload");
const { apiResponse } = require("./utils/helper");
const MESSAGES = require("./utils/message");
const HTTP_STATUS = require("./utils/httpStatus");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload());

// file API setup
file(app);

// Handle 404 errors
app.use((req, res, next) => {
  res
    .status(404)
    .json(
      apiResponse(
        false,
        null,
        MESSAGES.INVALID_REQUEST,
        null,
        HTTP_STATUS.NOT_FOUND
      )
    );
});

module.exports = app;
