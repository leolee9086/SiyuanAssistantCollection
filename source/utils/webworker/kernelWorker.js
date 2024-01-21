import { importWorker } from "./workerHandler.js";
const kernelWorker = importWorker(import.meta.resolve("../../polyfills/kernelApi.js")).default
export {kernelWorker as kernelWorker}