const { METHOD_NOT_IMPLEMENTED } = require("../utils/message");

class FileStorageInterface {
  async uploadFile(file) {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }

  async downloadFile(fileName) {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }

  async deleteFile(fileName) {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }
}

module.exports = FileStorageInterface;
