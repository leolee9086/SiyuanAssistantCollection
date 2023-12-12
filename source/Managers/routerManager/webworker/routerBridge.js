// 假设 worker 是已经初始化的 Web Worker 实例
/*let requestId = 0;
const requests = new Map();
const worker = new web
function sendRequest(worker, routerModulePath, request) {
    const id = requestId++;
    const promise = new Promise((resolve, reject) => {
        requests.set(id, { resolve, reject });
    });
    worker.postMessage({ id, routerModulePath, request });
    return promise;
}

worker.onmessage = ({ data }) => {
    const { id, status, headers, body } = data;
    const { resolve } = requests.get(id);
    resolve({ status, headers, body });
    requests.delete(id);
};

worker.onerror = (error) => {
    for (const { reject } of requests.values()) {
        reject(error);
    }
    requests.clear();
};*/
import { importWorker } from "../../../utils/webworker/workerHandler.js";
let workerModule=importWorker(import.meta.resolve('./test.js'))
console.log(await workerModule.测试.测试.$batch('测试'))
