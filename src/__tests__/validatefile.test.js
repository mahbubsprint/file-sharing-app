const validateFile = require("../utils/file-validation"); // Import the validateFile method

describe("validateFile", () => {
  // Test case: Uploaded file is missing
  test("should return an error if uploaded file is missing", () => {
    const req = { files: null };
    const result = validateFile(req);
    expect(result).toEqual({
      success: false,
      message: null,
      data: null,
      error: "No file was selected",
      code: 400,
    });
  });

  // Test case: Multiple files uploaded
  test("should return an error if multiple files are uploaded", () => {
    const req = { files: { file: [{}] } };
    const result = validateFile(req);
    expect(result).toEqual({
      success: false,
      message: null,
      data: null,
      error: "Please select only one file",
      code: 400,
    });
  });

  // Test case: File size exceeds maximum limit
  test("should return an error if file size exceeds maximum limit", () => {
    const req = { files: { file: { size: 255242881, name: "test.png" } } }; // Assuming file size exceeds 20MB
    const result = validateFile(req);
    expect(result).toEqual({
      success: false,
      message: null,
      data: null,
      error: "File size exceeds the maximum allowed size (20MB)",
      code: 400,
    });
  });

  // Test case: File type unsupported
  test("should return an error if file type is unsupported", () => {
    const req = {
      files: {
        file: {
          name: "test.html", // Provide a file name with the desired extension
          size: 1000000, // Provide a file size
        },
      },
    };

    const result = validateFile(req);
    expect(result).toEqual({
      success: false,
      message: null,
      data: null,
      error:
        "Unsupported file type. Supported file types are (jpg,png,pdf,docx,txt,mp4)",
      code: 400,
    });
  });

  // Test case: File is valid
  test("should return true if file is valid", () => {
    const req = { files: { file: { size: 1000000, name: "file.jpg" } } };
    const result = validateFile(req);
    expect(result).toBe(true);
  });
});
