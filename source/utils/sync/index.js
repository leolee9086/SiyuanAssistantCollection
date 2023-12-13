import  fs  from "../polyfills/fs.js";
export async function setSyncIgnore(path, value) {
    let syncIgnoreContent = await fs.readFile('/data/.siyuan/syncignore', 'utf-8');
    let lines = syncIgnoreContent.split('\n');
    if (value) {
        // Add the path to the file if it's not already there
        if (!lines.includes(path)) {
            lines.push(path);
        }
    } else {
        // Remove the path from the file if it's there
        lines = lines.filter(line => line !== path);
    }
    // Write the modified content back to the file
    await fs.writeFile('/data/.siyuan/syncignore', lines.join('\n'));
}