async function importWithTest(modulePath) {
    if (typeof modulePath !== 'string' || modulePath.trim() === '') {
        throw new Error('Invalid module path');
    }

    let module;
    try {
        // Import the module
        module = await import(modulePath);
    } catch (error) {
        console.error(`Failed to import module ${modulePath}:`, error);
        throw error;
    }

    // If window[Symbol.for('test')] is truthy, try to import and run the test
    if (window[Symbol.for('test')]) {
        try {
            // Construct the path of the test file
            const testPath = modulePath.replace(/\.js$/, '.test.js');
            let testModule;
            try {
                // Import the test file
                testModule = await import(testPath);
            } catch (error) {
                // If the error is not a "404 Not Found" error, log it
                if (!error.message.includes('404')) {
                    console.error(`Failed to import test file for ${modulePath}:`, error);
                }
            }

            // Only run tests if testModule is not undefined
            if (testModule) {
                // For each exported function in the test module, if there is a function with the same name in the module, call the test function with the module function as argument
                for (const [name, testFunc] of Object.entries(testModule)) {
                    if (typeof testFunc === 'function' && typeof module[name] === 'function') {
                        try {
                            // Wait for the test function to complete if it returns a Promise
                            await Promise.resolve(testFunc(module[name]));
                        } catch (error) {
                            console.error(`Test function ${name} in ${testPath} threw an error:`, error);
                        }
                    }
                }
            }
        } catch (error) {
            // If the test file cannot be imported, log the error
            console.error(`Failed to import test file for ${modulePath}:`, error);
        }
    }

    // Return the imported module
    return module;
}

export default importWithTest;