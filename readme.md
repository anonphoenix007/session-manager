# Session Manager

Session Manager is a Node.js application that allows users to upload `.zip` files, retrieve them using an access key, and manage session data. The uploaded files are stored temporarily and can be accessed within a specified time frame. This project also includes functionality for downloading, extracting, and managing JSON files within the uploaded `.zip` files.

## Features

- Upload `.zip` files containing JSON files.
- Retrieve uploaded files using a unique access key.
- Automatically delete files after 48 hours.
- Download `.zip` files using the access key.
- Extract downloaded `.zip` files and store JSON files in a specified folder.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side programming.
- **Express**: Web framework for building APIs.
- **Axios**: Promise-based HTTP client for making requests.
- **Archiver**: Library for creating `.zip` files.
- **Unzipper**: Library for extracting files from `.zip` archives.
- **fs-extra**: Library for file system operations with additional methods.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/session-manager.git
   cd session-manager
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the server**:

   ```bash
   node server.js
   ```

   Make sure the server is running on the specified port (default: 3000).

## API Endpoints

### 1. Upload `.zip` File

**POST** `/upload`

- **Request Body**: Form-data with a field named `zipfile` containing the `.zip` file.
- **Response**: Returns a JSON object containing a success message, access key, and expiration time.

**Example Request**:
```bash
curl -X POST -F "zipfile=@path/to/yourfile.zip" http://localhost:3000/upload
```

**Response**:
```json
{
  "message": "File uploaded successfully as session1",
  "accessKey": "33f755b6-2c61-414f-bb8f-a895d60a940e",
  "expiresIn": "48 hours"
}
```

### 2. Download `.zip` File

**GET** `/download/:accessKey`

- **Parameters**: `accessKey` - The unique access key for the uploaded file.
- **Response**: Returns the requested `.zip` file.

**Example Request**:
```bash
curl -O http://localhost:3000/download/33f755b6-2c61-414f-bb8f-a895d60a940e
```

### 3. Get Session Data

**GET** `/session/:accessKey`

- **Parameters**: `accessKey` - The unique access key for the uploaded file.
- **Response**: Returns session details including access key, file name, and timestamps.

**Example Request**:
```bash
curl http://localhost:3000/session/33f755b6-2c61-414f-bb8f-a895d60a940e
```

## Usage

### Creating and Uploading a `.zip` File

1. Place your JSON files in the `auth` folder.
2. Run the test script to create a `.zip` file, upload it to the server, and download it using the access key.

**Example Test Script** (`test/test.js`):

```javascript
// Import necessary modules and set up the test script here...
```

### Downloading and Extracting the `.zip` File

- After downloading the `.zip` file, the script automatically extracts it into the `session` folder, placing all `.json` files within that folder.

## Cleaning Up

The application is designed to delete uploaded files after 48 hours. Ensure to manage the directory structure and files as per your needs.