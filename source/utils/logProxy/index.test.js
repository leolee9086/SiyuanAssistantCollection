function test() {
    // Only run tests if window[Symbol.for('test')] is truthy
    if (!window[Symbol.for('test')]) {
        return;
    }

    // Test 1: Normal logging
    console.log('Test 1: Normal logging');
    loggerProxy.logHello('Hello, world!');

    // Test 2: Invalid log level
    console.log('Test 2: Invalid log level');
    try {
        loggerProxy.invalidLevelHello('Hello, world!');
    } catch (error) {
        console.error(error);
    }

    // Test 3: Add new log level
    console.log('Test 3: Add new log level');
    logger.addLevel('newLevel', { write: console.log });
    loggerProxy.newLevelHello('Hello, new level!');

    // Test 4: Add conflicting log level
    console.log('Test 4: Add conflicting log level');
    try {
        logger.addLevel('log', { write: console.log });
    } catch (error) {
        console.error(error);
    }

    // Test 5: Writter throws error
    console.log('Test 5: Writter throws error');
    logger.addLevel('errorLevel', { write: () => { throw new Error('Test error'); } });
    try {
        loggerProxy.errorLevelHello('Hello, error level!');
    } catch (error) {
        console.error(error);
    }
}

test();