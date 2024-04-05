# File Sharing Application

## Installation and Usage

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mahbubsprint/file-sharing-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd file-sharing-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   ### Getting Started
   To start the application, run the following command:
   ```bash
   npm start
   ```
   The application will be running on http://localhost:8000 by default.
   ### Run Test
   To run the test cases, run the following command:
   ```bash
   npm test
   ```
   All test case will be executed.

## About

This application serves as a versatile file sharing platform, empowering users to effortlessly upload, download, and delete files with comfort. With a focus on user convenience and security, our platform offers a range of features designed to enhance the file management experience:

### Key Features

1. **File Upload**: Users can seamlessly upload files to the platform, enabling efficient sharing and storage of documents, images, videos, and more.

2. **File Download**: The platform facilitates hassle-free file downloads, allowing users to retrieve their uploaded files at any time.

3. **File Deletion**: Users have the ability to delete files from the platform, providing control over their stored content and ensuring data privacy.

4. **Daily Request Limit**: To maintain system integrity and prevent abuse, our platform enforces a daily request limit by their `ip address`, for file uploads and downloads. This limit can be configured via environment variables, giving users flexibility to adjust their usage based on their needs.

5. **Configurable Request Limit**: Users have the ability to adjust their daily request limit by modifying the corresponding environment variable. This empowers users to tailor their experience to suit their specific requirements.

6. **Automatic Cleanup**: Our platform features an internal job that periodically cleans up uploaded files after a configurable period of inactivity. This ensures that storage space is efficiently managed and resources are optimized.

### Quality Assurance

I take pride in the robustness and reliability of our application, which is backed by comprehensive unit testing, integration testing and validation mechanisms. The diligent testing procedures ensure that the application functions flawlessly across various scenarios, delivering a seamless user experience.

### Validation and Security

This platform employs rigorous validation checks to ensure data integrity, security, and user satisfaction. Key validation measures include:

1. **Empty Check**: Before processing file uploads or downloads, the platform verifies that the requested `file is not empty`. Empty files are rejected to prevent unnecessary storage consumption.

2. **File Size Check**: To prevent excessive resource usage and optimize storage, the platform enforces a configurable `file size` limit for uploads. Files exceeding this limit are rejected, with users prompted to upload smaller files.

3. **File Type Check**: Our platform validates the `file type` of uploaded files to ensure compatibility and security. Only authorized file types are accepted, mitigating the risk of malicious file uploads and ensuring seamless processing.

4. **Request Limit Check**: When users attempt to upload or download files, the platform verifies their daily request limit, by their `ip address`, against the configured threshold. Users exceeding their daily request limit are notified and prompted to adjust their usage accordingly.

5. **Error Handling**: In the event of validation failures or unexpected errors, the platform provides informative error messages and gracefully handles user interactions. This ensures a seamless user experience and facilitates efficient troubleshooting.

---

## Environment Variables

Our application utilizes environment variables to configure various aspects of its behavior. Users can modify these variables according to their preferences and requirements. Below is a list of the available environment variables and their respective functionalities:

- **PORT**: Specifies the port number on which the application will listen for incoming requests. Users can adjust this value to avoid conflicts with other services running on the server.

- **NODE_ENV**: Sets the environment mode for the application. By changing this variable to 'production' or 'development', users can control the behavior of certain features and optimizations.

- **STORAGEPROVIDER**: Defines the storage provider for uploaded files. Users can choose between different providers such as 'local' or 'cloud' storage based on their storage needs and preferences.

- **FOLDER**: Specifies the directory path where uploaded files will be stored. Users can customize this path to suit their filesystem structure and organization.

- **MAX_FILE_SIZE_MB**: Sets the maximum allowable size (in megabytes) for individual uploaded files. Users can adjust this value to enforce file size limits and optimize storage usage.

- **ALLOWED_FILE_TYPES**: Specifies the allowed file types for uploads, separated by commas. Users can modify this list to restrict or expand the types of files that can be uploaded to the platform.

- **DAILY_UPLOAD_REQUEST_LIMIT**: Defines the maximum number of file upload requests allowed per day for each user. Users can adjust this limit to control access and prevent abuse.

- **DAILY_DOWNLOAD_REQUEST_LIMIT**: Sets the maximum number of file download requests allowed per day for each user. Users can customize this limit to manage bandwidth usage and ensure fair access.

- **PREIOD_OF_INACTIVITY**: Specifies the period of inactivity (in days) after which uploaded files will be automatically cleaned up from the storage. Users can change this value to control storage space usage and optimize resource allocation.

- **CRON_EXPRESSION**: Defines the cron expression for scheduling periodic tasks, such as cleanup jobs. Users can customize this expression to adjust the frequency and timing of automated tasks according to their requirements.

By modifying these environment variables, users can tailor the application's behavior to suit their specific use cases and preferences, enabling greater flexibility and customization.

## API Documentation

### Upload File

**Description:** Endpoint to upload a file.

**URL:** /files

**Method:** POST

**Request Body**:

- `file`: The file to be uploaded. This field should be included as part of a `multipart/form-data` request.

**Response:**

```bash
{
   "success": true,
   "message": "File uploaded successfully",
   "data": {
      "publicKey": "14d6b361-c619-461c-bbf1-eee3c28a4fab",
      "privateKey": "9a424bb3-3741-4bf1-9c25-7a8219023211"
   },
   "error": null,
   "code": 200
}
```

Sample error message if file size is more than 20MB

```bash
{
    "success": false,
    "message": null,
    "data": null,
    "error": "File size exceeds the maximum allowed size (20MB)",
    "code": 400
}
```

#### Example Usage (Postman)

1. Open Postman and create a new request.

2. Set the request URL to `http://localhost:8000/files`.

3. Select the HTTP method as `POST`.

4. In the request body, select `form-data` and add a key-value pair with the key as `file` then select the file from the dropdown and, the value as the file you want to upload.

5. Click on the "Send" button to make the request.

6. You will receive a response indicating the success or failure of the file upload operation.

### Download File by PublicKey

**Description**: Endpoint to download a file using its associated public key.

- **URL**: `http://localhost:8000/files/publicKey`

- **Method**: `GET`

- **Parameters**:

  - `publicKey`: The public key associated with the file to be downloaded.

- **Response**:

  - The file content, if the publicKey is valid and corresponds to an existing file.

  - `404 Not Found` if the file with the specified publicKey does not exist.

Sample error message if file key is invalid

```bash
{
    "success": false,
    "message": null,
    "data": null,
    "error": "No data found or invalid key",
    "code": 404
}
```

#### Example Usage

To download a file using its publicKey:

1. Construct the URL with the publicKey parameter.

   - Example URL: `http://localhost:8000/files/publicKey`

2. Make a GET request to the constructed URL.
3. If the publicKey is valid and authorized, the file content will be returned.
4. If the publicKey is invalid an appropriate error response will be returned.

### Delete File by PrivateKey

**Description**: Endpoint to delete a file using its associated private key.

- **URL**: `http://localhost:8000/files/privateKey`

- **Method**: `DELETE`

- **Parameters**:
  - `privateKey`: The private key associated with the file to be
    deleted.
- **Response**:

  - `200 OK` if the file is successfully deleted.

  - `404 Not Found` if the file with the specified privateKey does not exist.

```bash
{
    "success": true,
    "message": "File deleted successfully",
    "data": null,
    "error": null,
    "code": 200
}
```

Sample error message if no file found

```bash
{
    "success": false,
    "message": null,
    "data": null,
    "error": "No data found",
    "code": 404
}
```

#### Example Usage

To delete a file using its privateKey:

1. Construct the URL with the privateKey parameter.
   - Example URL: `http://localhost:8000/files/privateKey`
2. Make a DELETE request to the constructed URL.
3. If the privateKey is valid and authorized, the file will be deleted.
4. If the privateKey is invalid or unauthorized, an appropriate error response will be returned.

## Limitations

While the application strives to provide a seamless user experience, it is important to acknowledge certain limitations:

1. **Live Server Testing**: Our testing procedures primarily focus on local environments, and we have not conducted thorough testing on live servers. As a result, certain issues or discrepancies may arise when deploying the application to production environments.

2. **Concurrency Considerations**: The application's ability to handle concurrent users has not been thoroughly evaluated. While efforts have been made to optimize performance and resource utilization, scalability under high load conditions may not be fully explored.
