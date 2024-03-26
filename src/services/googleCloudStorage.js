//A demonastration of uploading file in google cloud

const { Storage } = require("@google-cloud/storage");

class GoogleCloudStorage {
  constructor(bucketName) {
    this.bucketName = bucketName;
    this.storage = new Storage();
    this.bucket = this.storage.bucket(bucketName);
  }

  async uploadFile(localFilePath, destinationFileName) {
    try {
      await this.bucket.upload(localFilePath, {
        destination: destinationFileName,
      });
    } catch (error) {
      throw error;
    }
  }

  async downloadFile(fileName, localDestinationFilePath) {
    // Implement download file method if needed
  }

  async deleteFile(fileName) {
    // Implement delete file method if needed
  }
}
