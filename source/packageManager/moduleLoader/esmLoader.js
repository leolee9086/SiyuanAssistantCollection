
export async function importModule(modulePath, baseURL, module) {
    const importedModule = await import(new URL(modulePath, baseURL));
    module.exports = importedModule;
}