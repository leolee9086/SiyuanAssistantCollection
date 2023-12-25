import * as 插件基础事件列表 from "./SiyuanBaseEventTypeList.js";
import { EventEmitter } from "./EventEmitter.js";
export { 插件基础事件列表 as 基础事件 }
export { EventEmitter }
export { EventEmitter as 事件触发器及 }
import { 启用收集protyle事件 } from "./protyleEvents.js";
import { 开始监听DOM键盘事件, DOM键盘事件表 } from "./DOMKeyBoardEvent.js";
import { sac } from "./runtime.js";
import { 智能防抖 } from "../../utils/functionTools.js";
import { 使用结巴拆分元素 } from "../../utils/tokenizer.js";
import { 获取光标所在位置 } from "../../utils/rangeProcessor.js";
import { CronJob } from "../../utils/timer/index.js";
import { reactive, watchEffect } from '../../../static/vue.esm-browser.js'
//监听原生事件触发自定义事件
启用收集protyle事件()
开始监听DOM键盘事件()
//模块之间不允许使用事件机制进行互相调用,而是使用函数路由
//只有事件管理器允许触发模块的事件
export const emitters = {}

export const use = (Emitter) => {
    let emitter = new Emitter()
    emitter.emit = (event, data) => {
        sac.eventBus.emit(event, { emitter, data })
    }
    emitters[emitter.channel] = emitter;
    // 遍历 emitter 对象的所有键
    for (let key in emitter) {
        // 如果键包含 '-' 字符
        if (key.includes('-')) {
            try {
                // 如果键以 '@main-' 开头
                if (key.startsWith('@main-')) {
                    // 从键中移除 '@main-' 前缀，得到事件名称
                    let eventName = key.replace('@main-', '');
                    // 在事件总线上注册事件，当事件触发时，调用对应的处理函数
                    sac.eventBus.on(eventName, (data) => {
                        emitter[key](data.detail);
                    });
                } else {
                    // 在事件总线上注册事件，当事件触发时，调用对应的处理函数
                    sac.eventBus.on(emitter.channel + '-' + key, (data) => {
                        emitter[key](data.detail);
                    });
                }

            } catch (error) {
                // 如果在处理过程中出现错误，打印错误信息
                console.error(`Error handling key ${key}:`, error);
            }
        }
    }
    emitter.onload()
    registJobs(emitter)
}
export const emit = (channel, event, ...args) => {
    if (!emitters[channel]) return;
    if (typeof emitters[channel][event] === 'function') {
        emitters[channel][event](...args);
    }
    sac.eventBus.emit(channel + '-' + event, args)
    console.log(channel, event, args)
}
export const registJobs = (Emitter) => {
    console.log(Emitter)
    // 创建一个存储所有任务的数组
    const jobs = [];
    // 观察 Emitter.jobs 的变化
    watchEffect(() => {
        // 清空任务表
        jobs.forEach(job => job.stop());
        jobs.length = 0;

        // 重新注册任务
        Emitter.jobs&&Emitter.jobs.forEach(jobInfo => {
            // 创建一个新的 CronJob
            const job = new CronJob(jobInfo.schedule, () => {
                // 触发 "jobStart" 事件
                emit(Emitter.channel, 'jobStart');

                // 执行 job
                jobInfo.task();

                // 触发 "jobEnd" 事件
                emit(Emitter.channel, 'jobEnd');
            });

            // 启动任务
            job.start();

            // 将任务添加到任务表中
            jobs.push(job);
        });
    });
}
let 显示tips = 智能防抖(async (e) => {
    let { pos, editableElement, blockElement, parentElement } = 获取光标所在位置();
    let 分词结果数组 = 使用结巴拆分元素(editableElement).filter((token) => {
        return (token.start <= pos && token.end >= pos) && (token.word && token.word.trim().length > 1);
    }).sort((a, b) => {
        return b.word.length - a.word.length
    });
    if (!分词结果数组[0]) {
        return
    }
    //这一段是文字搜索
    let res = await sac.路由管理器.internalFetch('/search/blocks/text', {
        body: {
            query: editableElement.innerText
        },
        method: 'POST',
    })
    res.body ? sac.路由管理器.internalFetch('/tips/UI/show', {
        body: res.body,
        method: "POST"
    }) : null
    //这一段是向量搜索
    let res1 = await sac.路由管理器.internalFetch('/search/blocks/vector', {
        body: {
            query: editableElement.innerText,
        },
        method: 'POST',
    })
    res1.body ? sac.路由管理器.internalFetch('/tips/UI/show', {
        body: res1.body,
        method: "POST"
    }) : null
})
sac.eventBus.on(DOM键盘事件表.文本输入, (e) => {
    显示tips(e)
})
sac.eventBus.on(DOM键盘事件表.组合结束, async (e) => {
    // console.log(sac.路由管理器.internalFetch('/search/rss/list',{body:{},method:'POST'}))
    // console.log(sac.路由管理器.internalFetch('/search/rss/router',{body:{name:"199it"},method:'POST'}))
    显示tips(e)

    sac.路由管理器.internalFetch('/indexBuilder/index/blocks', {
        body: {},
        method: "POST"
    })
})

sac.eventBus.on('cron-job', async (e) => {
    let {
        cronTime,
        onTick,
        onComplete,
        start,
        timeZone,
        context,
        runOnInit,
        utcOffset,
        unrefTimeout
    } = e.detail
    try {
        new CronJob(
            cronTime,
            onTick,
            onComplete,
            start,
            timeZone,
            context,
            runOnInit,
            utcOffset,
            unrefTimeout
        )
    } catch (e) {
        console.error(e)
    }
})
sac.eventBus.on('TabContainerInited', (e) => {
    console.log(e)
})
