import fs from '../polyfills/fs.js';
import path from '../polyfills/path.js';
import { parse } from 'es-module-lexer'; // You can use any library to parse imports

const basePath = '/plugins/blockAction/static';
const lexerPath = path.join(basePath, 'es-module-lexer.js');

async function download(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download ${url}`);
    }
    return await response.arrayBuffer();
}
async function downloadAndInitLexer() {
    // Check if the lexer exists locally
    if (!fs.existsSync(lexerPath)) {
        // If the lexer does not exist locally, download it
        try {
            const data = await download('https://unpkg.com/es-module-lexer');
            saveToLocalFileSystem(lexerPath, data);
        } catch (error) {
            console.error(`Failed to download es-module-lexer:`, error);
            throw error;
        }
    }

    // Import the local lexer
    let lexer;
    try {
        lexer = await import(path.resolve(lexerPath));
    } catch (error) {
        console.error(`Failed to import es-module-lexer:`, error);
        throw error;
    }

    // Initialize the lexer
    await lexer.init();

    // Return the lexer
    return lexer;
}
let lexer = await downloadAndInitLexer();
let parse = lexer.parse;

function saveToLocalFileSystem(filePath, data) {
    fs.writeFile(filePath, new Buffer(data));
}

async function parseImports(code) {
    const [imports] = await parse(code);
    return imports.map(i => i.n);
}

async function importWithDownload(modulePath) {
    let target = path.join(basePath, path.basename(new URL(modulePath).pathname));

    // Check if the file exists locally
    if (!fs.existsSync(target)) {
        // If the file does not exist locally, download it
        try {
            const data = await download(modulePath);
            saveToLocalFileSystem(target, data);
        } catch (error) {
            console.error(`Failed to download module ${modulePath}:`, error);
            throw error;
        }
    }

    // Import the local file
    let module;
    try {
        module = await import(path.resolve(target));
    } catch (error) {
        console.error(`Failed to import module ${target}:`, error);
        throw error;
    }

    // Return the imported module
    return module;
}

async function downloadModule(modulePath) {
    if (modulePath in downloadedModules) {
        return;
    }

    let code = await download(modulePath);
    saveToLocalFileSystem(modulePath, code);

    let imports = await parseImports(code);
    for (let importPath of imports) {
        await downloadModule(importPath);
    }
}

let downloadedModules = new Set();
// Replace 'entryModulePath' with the actual entry module path
let entryModulePath = '...';
await downloadModule(entryModulePath);

export default importWithDownload;