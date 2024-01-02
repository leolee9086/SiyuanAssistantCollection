import * as githubAdapter from "./GitHub.js";
import * as npmAdapter from "./NPM.js";
import * as huggingfaceAdapter from "./huggingface.js"
let remotePackageRegistryAdapters={
    npm:npmAdapter,
    github:githubAdapter,
    huggingface:huggingfaceAdapter
}
export  async function getAdapters(adapterNames) {
    let selectedAdapters = [];
    for (let name of adapterNames) {
        if (name in remotePackageRegistryAdapters) {
            selectedAdapters.push(remotePackageRegistryAdapters[name])
        } else {
            console.warn(`Adapter ${name} not found.`);
        }
    }
    return selectedAdapters;
}