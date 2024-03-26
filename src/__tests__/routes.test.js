const request = require("supertest");
const app = require("../express-app");
const path = require("path");
const fs = require("fs");
const LocalFileStorage = require("../services/localFileStorage");

//download route test
describe("Integration tests for download route", () => {
  const publicKey = "813f0e84-506c-4f4a-ba69-a4701470ab72";
  it("should download the file with valid publicKey", async () => {
    const response = await request(app).get(`/files/${publicKey}`);
    expect(response.status).toBe(200);
  });

  it("should return 404 if file not found", async () => {
    const response = await request(app).get("/files/invalidPublicKey");
    expect(response.status).toBe(404);
    // Add more assertions as needed
  });
  it("should return 400 if download limit exceeded", async () => {
    // Simulate exceeding the download limit
    // Make sure to set up your test environment accordingly
    const response = await request(app).get(`/files/${publicKey}`);
    expect(response.status).toBe(400);
  });
});

//delete route test
describe("Integration tests for delete route", () => {
  it("should delete the file with valid privateKey", async () => {
    const privateKey = "987d859b-4604-4f22-96b8-4c35bde68d21";
    // Make sure to replace 'validPrivateKey' with an actual valid privateKey
    const response = await request(app).delete(`/files/${privateKey}`);
    expect(response.status).toBe(200);
    // Add more assertions as needed
  });

  it("should return 404 if file not found", async () => {
    // Make sure to replace 'invalidPrivateKey' with an actual invalid privateKey
    const response = await request(app).delete("/files/invalidPrivateKey");
    expect(response.status).toBe(404);
    // Add more assertions as needed
  });
});

// post route test
describe("Integration tests for post route", () => {
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
  it("should upload a file and return success response", async () => {
    // Mock the uploadFile method of the storageProvider
    const mockResponse = {
      success: true,
      data: {
        publicKey: "publicKey123",
        privateKey: "privateKey123",
      },
      error: null,
      message: "File uploaded successfully",
      code: 200,
    };
    jest.spyOn(storage, "uploadFile").mockResolvedValue(mockResponse);

    // Make a POST request to the /files endpoint using Supertest
    const response = await request(app)
      .post("/files")
      .attach("file", "src/public/test.txt") // Attach a test file
      .expect(200); // Expect a 200 OK response

    // Assertions
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({}),
        error: null,
        message: "File uploaded successfully",
        code: 200,
      })
    );
  });
});
