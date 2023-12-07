import {logger,plugin} from './runtime.js'
import { 动作总表 } from "./index.js";
import { 智能防抖 } from "../utils/functionTools.js"
import { 处理单个动作表 } from "./index.js";
import { 设置器 } from "./index.js";
const {statusMonitor} =plugin
let 动作表耗时 = {}; // 用于存储每个动作表的耗时
export async function 根据上下文获取动作表(context, signal) {
    let 备选动作表 = []
    if (signal && signal.aborted) {
        return 备选动作表
    }
    // 根据上次生成耗时对动作表进行排序
    动作总表.sort((a, b) => (动作表耗时[a] || 0) - (动作表耗时[b] || 0));
    for (let i = 0; i < 动作总表.length; i++) {
        if (signal && signal.aborted) {
            return []
        }
        try {
            let 动作表 = 动作总表[i];
            let startTime = Date.now(); // 记录开始时间
            await 处理动作表(动作表, 备选动作表, context, signal)
            let endTime = Date.now(); // 记录结束时间
            动作表耗时[动作表] = endTime - startTime; // 计算并存储耗时
        } catch (e) {
            logger.actionListwarn(e, 动作总表[i]);
        }
    }
    console.log(备选动作表)
    return 备选动作表
}
async function 处理动作表(动作表, 备选动作表, 执行上下文, 取消信号) {
    if (设置器.get("动作设置", "关键词动作设置", 动作表.provider).$value !== true) {
        if (动作表.provider !== 'meta_js') {
            return;
        }
        if(设置器.get("动作设置", "关键词动作设置", 动作表.provider).$value===undefined){
            let 默认配置 = 设置器.get("动作设置", "默认开启新动作表").$value
            if(!默认配置){
                return;
            }
        }
    }
    if (取消信号 && 取消信号.aborted) {
        return;
    }
    let f = 获取过滤器函数(动作表, 取消信号)
    // 筛选出合适的动作
  /*  let f = await 智能防抖(
        获取过滤器函数(动作表, 取消信号),
        (当次执行间隔, 平均执行时间) => {
            logger.actionListwarn(`动作表${动作表._动作表路径}生成时间过长,已经阻断,当前执行间隔为${当次执行间隔},平均执行时间为${平均执行时间},优化生成函数可能改善`)
            statusMonitor.set('动作表状态',动作表._provider,'slow')
        }
    )*/
    if (取消信号 && 取消信号.aborted) {
        return;
    }
    f ? f(备选动作表, 执行上下文, 取消信号) : null
}

let 过滤器函数表 = new Map();
function 获取过滤器函数(动作表, signal) {
    if (signal && signal.aborted) {
        return
    }
    if (!过滤器函数表.has(动作表)) {
        // 如果过滤器函数表的大小超过了1000，就删除最早添加的过滤器函数
        if (过滤器函数表.size >= 1000) {
            const oldestKey = 过滤器函数表.keys().next().value;
            过滤器函数表.delete(oldestKey);
        }
        let 过滤器函数 = 创建过滤器函数(动作表);
        过滤器函数表.set(动作表, 过滤器函数);
    }
    return 过滤器函数表.get(动作表);
}
async function 处理动作(动作, 动作表, 备选动作表, context, signal) {
    let flag;
    if (context.token) {
        if (动作.hintArray && 动作.matcher(context.token ? context.token.word : null, 动作.hintArray || [], context)) {
            flag = true;
        } else if (动作.matchMod === 'any') {
            flag = true;
        }
    }
    if (signal && signal.aborted) {
        return
    }
    if (动作.blocksFilter && context.token) {
        flag = flag && 动作.blocksFilter(context.blocks);
    }
    if (signal && signal.aborted) {
        return
    }
    if (动作.blocksFilter && !context.token) {
        flag = 动作.blocksFilter(context.blocks);
    }
    if (!动作.blocksFilter && !context.token) {
        flag = true
    }
    if (flag) {
        备选动作表.push(动作);
    }
}

function 创建过滤器函数(动作表) {
    return async function (备选动作表, context, signal) {
        let _动作表 = 动作表;
        if (signal && signal.aborted) {
            return
        }
        if (_动作表 instanceof Function) {
            let result = await (_动作表)(context, signal)
            result.provider=动作表.provider
            _动作表 = 处理单个动作表(result);
        }
        if (!_动作表 || !_动作表[0]) {
            return;
        }
        for (let j = 0; j < _动作表.length; j++) {
            if (signal && signal.aborted) {
                return
            }
            try {
                let 动作 = _动作表[j];
                动作._动作表路径 = 动作表._动作表路径
                动作.provider=动作表.provider
                await 处理动作(动作, 动作表, 备选动作表, context, signal);
            } catch (e) {
                logger.actionListwarn(e, _动作表[j]);
            }
        }
    };
}
