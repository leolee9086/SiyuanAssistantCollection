import { fs } from "../runtime.js";
export async function readFromCache(cacheFilePath) {
    try {
        const cacheData = await fs.readFile(cacheFilePath);
        return JSON.parse(cacheData).repos.filter(item => item);
    } catch (error) {
        console.log("Failed to read from cache: ", error);
        return null;
    }
}