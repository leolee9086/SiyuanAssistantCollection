import logger from "../../logger/index.js";
import { 计算cpu核心数量 } from "../os/cpu.js";
import { 正规化URL } from "../url.js";
let worker线程池 = {}
worker线程池 = globalThis[Symbol.for('_worker线程池_')] || worker线程池
globalThis[Symbol.for('_worker线程池_')] = worker线程池
function 创建Worker线程() {
  let worker = new Worker(import.meta.resolve('./worker.js'));
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
          任务名: 任务名,
          moduleName:worker.moduleName
        });
      } catch (e) {
        reject(e);
      }
    });
  };
}
// 初始化 worker 线程池
function 初始化Worker线程池(处理器文件地址, characters) {
  // 使用文件名作为键
  if (!worker线程池[处理器文件地址]) {
    worker线程池[处理器文件地址] = [];
    let worker线程组 = worker线程池[处理器文件地址];
    let cpu核心数 = 计算cpu核心数量();
    for (let i = 0; i < cpu核心数; i++) {
      let worker = 创建Worker线程(处理器文件地址);
      worker.moduleName=处理器文件地址
      let 任务列表 = [];
      let 处理任务 = 创建任务处理函数(worker, 任务列表, characters);
      worker线程组.push({
        worker: worker,
        处理任务: 处理任务,
        任务列表: 任务列表,
        worker文件地址:处理器文件地址
      });
    }
  }
}
// 找到可用的 worker
function 找到可用Worker(worker文件地址) {
  // 使用文件名作为键
  console.log(worker线程池,worker文件地址)
  let 可用worker = worker线程池[worker文件地址].reduce((最短任务列表的worker, 当前worker) => {
    if ((!最短任务列表的worker || 当前worker.任务列表.length < 最短任务列表的worker.任务列表.length)) {
      return 当前worker;
    }
    return 最短任务列表的worker;
  }, null);
  if (!可用worker) {
    可用worker = worker线程池[worker文件地址][0];
  }
  return 可用worker;
}
// 使用 worker 处理数据
export const 使用worker处理数据 = async (数据组, 处理器文件地址, 任务名, 广播) => {
  console.log(任务名)
  处理器文件地址 = 正规化URL(处理器文件地址)
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  初始化Worker线程池(处理器文件地址, characters);
  if (!广播) {
    try {
      let 可用worker = 找到可用Worker(处理器文件地址);
      let result = await 可用worker.处理任务(数据组, 任务名);
      return result;
    } catch (error) {
      console.error(`处理任务时出错${处理器文件地址}: ${error},\n${数据组}`);
      // 在这里你可以处理错误，例如返回一个默认值或者重新抛出错误
      return null; // 返回一个默认值
    }
  } else {
    //这里不能用promise.allSettled 或者promise.all,会造成无法返回,具体原因还不清楚
    try {
      return await 处理广播任务(worker线程池, 数据组, 任务名, 处理器文件地址);
    } catch (error) {
      console.error(`任务处理出错${处理器文件地址}: ${error},\n${数据组}`);
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
export function importWorker(处理器文件地址, 任务名 = []) {
  return new Proxy(() => {}, {
    get: function(target, prop) {
      if (typeof prop === 'symbol' || prop === 'inspect') {
        return () => {};
      }
      if (prop === '$batch') {
        return (...args) => 使用worker处理数据(args, 处理器文件地址, 任务名, true);
      }
      if (prop === '$prepare') {
        return (...args) => 使用worker处理数据(args, 处理器文件地址, prop, true);
      }
      return importWorker(处理器文件地址, [...任务名, prop]);
    },
    apply: function(target, thisArg, args) {
      return 使用worker处理数据(args, 处理器文件地址, 任务名, false);
    }
  });
}