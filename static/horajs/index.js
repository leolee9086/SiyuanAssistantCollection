// In pure ESM web bundles, you must call init() and wait for the promised result before you can
// call any module methods. To make that as easy as possible, this module directly exposes the
// init() promise result, and returns the methods at the end of the promise.
import init, * as horaJs from "./pkg/horajs.js";
let initialized = false;
export const getHora = async (module_or_path, maybe_memory) => {
    if (initialized) {
        return horaJs;
    }
    let input = module_or_path || undefined;
    let memory = maybe_memory ||
        new WebAssembly.Memory({
            initial: 8192,
            maximum: 65536,
            shared: true,
        });
    if (typeof window === "undefined") {
        if (!input) {
            const fs = await import("fs/promises");
            const { fileURLToPath } = await import("url");
            const { join, dirname } = await import("path");
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            const path = join(__dirname, "./pkg/horajs_bg.wasm");
            input = fs.readFile(path);
        }
        const nodeProcessVersion = process?.versions?.node;
        if (Number(nodeProcessVersion.split(".").unshift() < 19)) {
            const { webcrypto } = await import("node:crypto");
            // @ts-ignore
            globalThis.crypto = webcrypto;
        }
    }
    await init(input, memory);
    await horaJs.init_env();
    initialized = true;
    return horaJs;
};
export default getHora;
//# sourceMappingURL=index.js.map