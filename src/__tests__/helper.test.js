const {
  generateKeys,
  isToday,
  periodInMillis,
  thresholdDate,
  mbToBytes,
  allowedTypes,
  apiResponse,
} = require("../utils/helper");
const { v4: uuidv4 } = require("uuid");

jest.mock("uuid", () => ({
  v4: jest
    .fn()
    .mockReturnValueOnce("mock-public-key")
    .mockReturnValueOnce("mock-private-key"),
}));

//Test case to generate unique private and public key
describe("generateKeys function", () => {
  test("should generate unique publicKey and privateKey", () => {
    const { publicKey, privateKey } = generateKeys();
    expect(uuidv4).toHaveBeenCalledTimes(2);
    expect(publicKey).toBe("mock-public-key");
    expect(privateKey).toBe("mock-private-key");
  });
});

//Test case to check the date
describe("isToday function", () => {
  it("should return true if the input date is today", () => {
    const today = new Date();
    expect(isToday(today.toISOString())).toBe(true);
  });

  it("should return false if the input date is not today", () => {
    // Create a date object for yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday.toISOString())).toBe(false);
  });

  it("should return false for an invalid date", () => {
    expect(isToday("invalid-date")).toBe(false);
  });
});

//Test function to convert day into milisecond

describe("periodInMillis function", () => {
  it("should return the correct number of milliseconds for a given number of minutes", () => {
    // Test with 1 minute
    expect(periodInMillis(1, "minutes")).toBe(1 * 60 * 1000);

    // Test with 2 minutes
    expect(periodInMillis(2, "minutes")).toBe(2 * 60 * 1000);

    // Test with 0 minutes (should return 0)
    expect(periodInMillis(0, "minutes")).toBe(0);

    // Test with a large number of minutes
    expect(periodInMillis(100, "minutes")).toBe(100 * 60 * 1000);
  });

  it("should return 0 for negative values or non-numeric inputs", () => {
    // Test with a negative value for days
    expect(periodInMillis(-1, "days")).toBe(0);

    // Test with a non-numeric input for days
    expect(periodInMillis("invalid", "days")).toBe(0);

    // Test with a negative value for minutes
    expect(periodInMillis(-1, "minutes")).toBe(0);

    // Test with a non-numeric input for minutes
    expect(periodInMillis("invalid", "minutes")).toBe(0);
  });
});

//Test case to provide thresholdDate
describe("thresholdDate function", () => {
  it("should return the correct threshold date when provided minute as milliseconds", () => {
    const now = new Date("2024-03-31T12:00:00Z");
    const originalDate = Date;
    global.Date = jest.fn(() => now);

    // Test with 1 minute in milliseconds
    expect(thresholdDate(60 * 1000)).toEqual(new Date("2024-03-31T11:59:00Z"));

    // Test with 2 minutes in milliseconds
    expect(thresholdDate(2 * 60 * 1000)).toEqual(
      new Date("2024-03-31T11:58:00Z")
    );

    // Test with 0 milliseconds
    expect(thresholdDate(0)).toEqual(new Date("2024-03-31T12:00:00Z"));

    global.Date = originalDate;
  });
});

//Test case to convert MB to byte
describe("mbToBytes function", () => {
  it("should convert megabytes to bytes correctly", () => {
    // Test with 1 MB
    expect(mbToBytes(1)).toBe(1024 * 1024);
    // Test with 2 MB
    expect(mbToBytes(2)).toBe(2 * 1024 * 1024);
    // Test with 0 MB (should return 0 bytes)
    expect(mbToBytes(0)).toBe(0);
    // Test with a decimal value (should round down to nearest integer)
    expect(mbToBytes(1.5)).toBe(1.5 * 1024 * 1024);
    // Test with a negative value (should return 0 bytes)
    expect(mbToBytes(-1)).toBe(0);
    // Test with non-numeric input (should return 0 bytes)
    expect(mbToBytes("invalid")).toBe(0);
  });
});

//Test case to create different file types array
describe("allowedTypes array", () => {
  it("should split ALLOWED_FILE_TYPES into an array", () => {
    const expectedArray = ["jpg", "png", "pdf", "docx", "txt", "mp4"]; // Assuming ALLOWED_FILE_TYPES is 'jpg,png,gif'
    expect(allowedTypes).toEqual(expectedArray);
  });

  it("should convert each file type to lowercase", () => {
    const typesUpperCase = ["JPG", "PNG", "GIF"]; // Assuming ALLOWED_FILE_TYPES is 'JPG,PNG,GIF'
    const expectedArray = ["jpg", "png", "gif"];
    const result = typesUpperCase.map((type) => type.toLowerCase());
    expect(result).toEqual(expectedArray);
  });
});

//APi response test cases
describe("apiResponse", () => {
  test("should construct a success response object", () => {
    const result = apiResponse(
      true,
      { key: "value" },
      null,
      "Success message",
      200
    );
    expect(result).toEqual({
      success: true,
      data: { key: "value" },
      error: null,
      message: "Success message",
      code: 200,
    });
  });
  test("should construct an error response object", () => {
    const result = apiResponse(false, null, "Error message", null, 400);
    expect(result).toEqual({
      success: false,
      data: null,
      error: "Error message",
      message: null,
      code: 400,
    });
  });
});
