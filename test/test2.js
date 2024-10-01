import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import unzipper from 'unzipper';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to download and extract the zip file
const downloadAndExtractZipFile = async (accessKey) => {
  const url = `http://localhost:3000/download/${accessKey}`; // Adjust URL as necessary
  const outputFilePath = path.join(__dirname, `downloaded_${accessKey}.zip`); // Set output file path
  const sessionFolderPath = path.join(__dirname, 'session'); // Path to the session folder

  try {
    // Create session folder if it doesn't exist
    await fs.ensureDir(sessionFolderPath);

    // Download the zip file
    const response = await axios.get(url, {
      responseType: 'stream', // Important for downloading files
    });

    // Create a write stream to save the downloaded zip file
    const writer = fs.createWriteStream(outputFilePath);
    
    response.data.pipe(writer);

    // Return a promise that resolves when the file is fully downloaded
    await new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`File downloaded successfully: ${outputFilePath}`);
        resolve();
      });
      writer.on('error', (err) => {
        console.error('Error writing file:', err.message);
        reject(err);
      });
    });

    // Extract the downloaded zip file
    await fs.createReadStream(outputFilePath)
      .pipe(unzipper.Extract({ path: sessionFolderPath })) // Extract to the session folder
      .promise(); // Convert to a promise for easier handling

    console.log(`Files extracted successfully to: ${sessionFolderPath}`);

    // Optionally, you can remove the downloaded zip file after extraction
    await fs.remove(outputFilePath);
  } catch (error) {
    console.error('Error downloading or extracting zip file:', error.message);
  }
};

// Example usage of the downloadAndExtractZipFile function
const accessKey = '33f755b6-2c61-414f-bb8f-a895d60a940e'; // Replace with the actual access key
downloadAndExtractZipFile(accessKey);
