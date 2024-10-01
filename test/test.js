import fs from 'fs-extra'; // Use default import for fs-extra
import archiver from 'archiver';
import axios from 'axios'; // Ensure axios is imported correctly
import FormData from 'form-data'; // Import form-data for handling multipart/form-data
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Step 1: Create a `.zip` file from a test folder named `testFiles`
const createZipFile = async () => {
  const outputPath = join(__dirname, 'test.zip');
  const sourceDir = join(__dirname, 'auth'); // Ensure this folder exists

  // Ensure the auth folder exists
  if (!fs.existsSync(sourceDir)) {
    console.error('Folder "auth" does not exist. Please create it and add some test files.');
    process.exit(1);
  }

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Created zip file: ${outputPath} (${archive.pointer()} total bytes)`);
      resolve(outputPath);
    });

    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, false); // Include all files in `auth` folder
    archive.finalize();
  });
};

// Step 2: Upload the `.zip` file to the API
const uploadZipFile = async (zipFilePath) => {
  const url = 'http://localhost:3000/upload'; // Update to match your server's URL and port
  const fileStream = fs.createReadStream(zipFilePath); // Correctly use createReadStream

  const formData = new FormData();
  formData.append('zipfile', fileStream);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    console.log('Upload successful. Server response:');
    console.log(response.data);
  } catch (error) {
    console.error('Upload failed:', error.message);
  }
};

// Main function to create and upload the zip file
const runTest = async () => {
  try {
    const zipFilePath = await createZipFile();
    await uploadZipFile(zipFilePath);

    // Optionally, clean up the generated zip file after upload
    fs.removeSync(zipFilePath); // Correctly use removeSync from fs-extra
  } catch (err) {
    console.error('Error during test:', err.message);
  }
};

runTest();
