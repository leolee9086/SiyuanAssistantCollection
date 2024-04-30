import fs from 'fs';
import path from 'path';
import axios from 'axios'; // You can use any library to download the file

async function importWithDownload(modulePath) {
    // Check if the file exists locally
    if (!fs.existsSync(modulePath)) {
        // If the file does not exist locally, download it
        try {
            const response = await axios.get(modulePath, { responseType: 'arraybuffer' });
            fs.writeFile(modulePath, response.data);
        } catch (error) {
            console.error(`Failed to download module ${modulePath}:`, error);
            throw error;
        }
    }

    // Import the local file
    let module;
    try {
        module = await import(path.resolve(modulePath));
    } catch (error) {
        console.error(`Failed to import module ${modulePath}:`, error);
        throw error;
    }

    // Return the imported module
    return module;
}

export default importWithDownload;