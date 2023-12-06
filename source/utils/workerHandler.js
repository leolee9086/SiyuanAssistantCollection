import logger from "../logger/index.js";
import { 计算cpu核心数量 } from "./os/cpu.js";
import { 正规化URL } from "./url.js";
let worker线程池 = {}
worker线程池 = globalThis[Symbol.for('_worker线程池_')] || worker线程池
globalThis[Symbol.for('_worker线程池_')] = worker线程池
function 创建Worker线程(worker文件地址) {
  let worker = new Worker(worker文件地址);
  worker.onerror = (error) => {
    logger.log(error);
  };
  return worker;
}
// 创建任务处理函数
function 创建任务处理函数(worker, 任务列表, characters) {
  return (任务数据, 任务名) => {
    return new Promise((resolve, reject) => {
      let 任务id = '';
      for (let i = 0; i < 10; i++) {
        任务id += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      let 任务记录位置 = 任务列表.length;
      任务列表[任务记录位置] = 任务id;
      try {
        let f = (e) => {
          if (e.data.任务id === 任务id) {
            worker.removeEventListener('message', f);
            任务列表.splice(任务记录位置, 1); // 从指定位置删除一个元素
            if (!e.data.错误) {
              resolve(e.data.处理结果);
            } else {
              reject(e.data.错误);
            }
          }
        };
        worker.addEventListener('message', f);
        worker.postMessage({
          任务数据: 任务数据,
          任务id: 任务id,
          任务名: 任务名
        });
      } catch (e) {
        reject(e);
      }
    });
  };
}
// 初始化 worker 线程池
function 初始化Worker线程池(worker文件地址, characters) {
  // 使用文件名作为键
  let worker文件名 = new URL(worker文件地址).pathname.split('/').pop();
  if (!worker线程池[worker文件名]) {
    worker线程池[worker文件名] = [];
    let worker线程组 = worker线程池[worker文件名];
    let cpu核心数 = 计算cpu核心数量();
    for (let i = 0; i < cpu核心数; i++) {
      let worker = 创建Worker线程(worker文件地址);
      let 任务列表 = [];
      let 处理任务 = 创建任务处理函数(worker, 任务列表, characters);
      worker线程组.push({
        worker: worker,
        处理任务: 处理任务,
        任务列表: 任务列表
      });
    }
  }
}
// 找到可用的 worker
function 找到可用Worker(worker文件地址) {
  // 使用文件名作为键
  let worker文件名 = new URL(worker文件地址).pathname.split('/').pop();

  let 可用worker = worker线程池[worker文件名].reduce((最短任务列表的worker, 当前worker) => {
    if ((!最短任务列表的worker || 当前worker.任务列表.length < 最短任务列表的worker.任务列表.length)) {
      return 当前worker;
    }
    return 最短任务列表的worker;
  }, null);
  if (!可用worker) {
    可用worker = worker线程池[worker文件名][0];
  }
  return 可用worker;
}
// 使用 worker 处理数据
export const 使用worker处理数据 = async (数据组, worker文件地址, 任务名, 广播) => {
  worker文件地址 = 正规化URL(worker文件地址)
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  初始化Worker线程池(worker文件地址, characters);
  // 使用文件名作为键
  let worker文件名 = new URL(worker文件地址).pathname.split('/').pop();
  if (!广播) {
    try {
      let 可用worker = 找到可用Worker(worker文件地址);
      let result = await 可用worker.处理任务(数据组, 任务名);
      return result;
    } catch (error) {
      logger.error(`处理任务时出错${worker文件地址}: ${error},\n${数据组}`);
      // 在这里你可以处理错误，例如返回一个默认值或者重新抛出错误
      return null; // 返回一个默认值
    }
  } else {
    //这里不能用promise.allSettled 或者promise.all,会造成无法返回,具体原因还不清楚
    try {
      return await 处理广播任务(worker线程池, 数据组, 任务名, worker文件名);
    } catch (error) {
      logger.error(`任务处理出错${worker文件地址}: ${error},\n${数据组}`);
    }
  }
};

// 处理单个任务
async function 处理单个任务(worker, 数据组, 任务名) {
  try {
    logger.log(worker, 数据组, 任务名)
    let result = await worker.处理任务(数据组, 任务名);
    return { status: 'fulfilled', value: result };
  } catch (error) {
    logger.error(`处理任务时出错: ${error}`);
    return { status: 'rejected', reason: error };
  }
}

// 处理广播任务
async function 处理广播任务(worker线程池, 数据组, 任务名, worker文件名) {
  let results = [];
  for (let worker of worker线程池[worker文件名]) {
    let result = await 处理单个任务(worker, 数据组, 任务名);
    results.push(result);
  }
  logger.log(results);
  return results.map(result => {
    if (result.status === 'rejected') {
      return null; // 或者你可以返回一个默认值
    } else {
      return result.value;
    }
  });
}
export function 创建一次性函数worker(func) {
  // 检查参数
  if (typeof func !== 'function') {
    throw new Error('参数必须是一个函数');
  }
  // 将函数转换为字符串
  let functionString = func.toString();
  // 创建一个Blob对象，然后使用URL.createObjectURL创建一个URL
  const blob = new Blob([`
    let myFunction = ${functionString};
    onmessage = function(e) {
        let result;
        try {
            result = myFunction(e.data);
            postMessage(result);
        } catch (error) {
            postMessage({ error: error.message });
        } finally {
            close();
        }
    };
    //# sourceURL=worker.js
  `], { type: 'application/javascript' });
  const workerScript = URL.createObjectURL(blob);
  // 创建一个Worker
  const worker = new Worker(workerScript);
  // 在主线程中清理Blob URL
  worker.addEventListener('message', () => URL.revokeObjectURL(workerScript), { once: true });
  worker.addEventListener('error', () => URL.revokeObjectURL(workerScript), { once: true });
  return worker;
}