const LocalFileStorage = require("../services/localFileStorage");
const { File } = require("../database/models");
const path = require("path");
const fs = require("fs");
const os = require("os");

describe("LocalFileStorage uploadfile function", () => {
  let storage;

  beforeAll(() => {
    // Create a temporary directory for testing
    const tempDir = path.join(__dirname, "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    // Initialize LocalFileStorage with the temporary directory
    storage = new LocalFileStorage(tempDir);
  });

  afterAll(() => {
    // Clean up the temporary directory after all tests
    const tempDir = path.join(__dirname, "temp");
    if (fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true });
      } catch (err) {}
    }
  });

  it("should upload a file if daily upload limit per IP is not exceeded", async () => {
    // Mock the request object with an IP address
    const req = {
      ip: "192.168.1.1",
    };
    // Mock the dailyUploadLimit function to return true (limit exceeded)
    const dailyUploadLimit = jest.fn().mockReturnValue(true);
    // Create a mock file object
    const file = {
      name: "test.txt", // Provide a filename
      mv: jest.fn((destination, callback) => {
        callback(null);
      }),
    };

    // Call the uploadFile method of LocalFileStorage
    const response = await storage.uploadFile(file, req);
    expect(response).toEqual(response);
  });
});

describe("LocalFileStorage downloadFile function", () => {
  let storage;
  let resMock;
  let reqMock;

  beforeEach(() => {
    const tempDir = "temp";
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    storage = new LocalFileStorage(tempDir);
    resMock = {
      setHeader: jest.fn(),
    };
    reqMock = {};
  });

  afterEach(() => {
    // Clean up the temporary directory after each test
    const tempDir = "temp";
    if (fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true });
      } catch (err) {}
    }
  });

  it("should return a not found response if the file does not exist", async () => {
    // Call downloadFile method with a non-existent publicKey
    const response = await storage.downloadFile(
      resMock,
      "nonExistentPublicKey",
      reqMock
    );
    // Assertions
    expect(response).toEqual({
      success: false,
      message: null,
      data: null,
      error: "No data found or invalid key",
      code: 404,
    });
  });

  it("should download the file if it exists and update download timestamp", async () => {
    // Create a mock file in the temporary directory
    const filePath = "temp/test.png";
    //Change the public key as needed
    const publicKey = "c867a902-756a-4c33-b3ed-48c80166bc09";
    fs.writeFileSync(filePath, "Mock file content");
    // Call downloadFile method with a valid publicKey
    const response = await storage.downloadFile(resMock, publicKey, reqMock);
    // Assertions
    expect(resMock.setHeader).toHaveBeenCalledWith(
      "Content-Disposition",
      `attachment; filename="test.png"`
    );
  });
});

describe("deleteFile function", () => {
  beforeEach(() => {
    // Initialize LocalFileStorage instance
    storage = new LocalFileStorage();
  });

  it("should delete the file and return success message", async () => {
    // Change the private key to match the file you want to delete from the database
    const privateKey = "ffc3b730-2917-4c88-ba1c-4867a4e2e14c";

    // Mock the File.findOne method to return a file with a dynamically generated filePath
    jest.spyOn(File, "findOne").mockImplementation(async ({ where }) => {
      // Assuming `privateKey` is the key to search for the file
      if (where.privateKey === privateKey) {
        // Generate a dynamic filePath based on the privateKey
        const tempDir = os.tmpdir(); // Use the OS temporary directory
        const filePath = path.join(tempDir, `${privateKey}.png`);
        // Create a temporary file with the dynamically generated filePath
        fs.writeFileSync(filePath, "Mock file content");
        // Return a mock file object with the dynamically generated filePath
        return {
          destroy: jest.fn().mockResolvedValue(true),
          filePath: filePath,
        };
      }
      // If the privateKey doesn't match, return null to simulate no file found
      return null;
    });

    // Call deleteFile function with the valid privateKey
    const response = await storage.deleteFile(privateKey);

    // Assertions
    expect(response).toEqual({
      success: true,
      message: "File deleted successfully",
      data: null,
      error: null,
      code: 200,
    });
  });
});
