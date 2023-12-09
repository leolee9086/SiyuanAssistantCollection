const parseRequirePaths = (str) => {
    const regex = /require\(['"](\..*?)['"]\)/g;
    let match;
    const paths = [];

    while ((match = regex.exec(str)) !== null) {
        paths.push(match[1]);
    }
    return paths;
}
const parseDynamicRequirePaths = (str) => {
    const regex = /require\(([^'"].*?)\)/g;
    let match;
    const paths = [];
    while ((match = regex.exec(str)) !== null) {
        paths.push(match[1]);
    }
    return paths;
}
const parseDynamicImportPaths = (str) => {
    const regex = /import\(['"](\..*?)['"]\)/g;
    let match;
    const paths = [];
    while ((match = regex.exec(str)) !== null) {
        paths.push(match[1]);
    }
    return paths;
}