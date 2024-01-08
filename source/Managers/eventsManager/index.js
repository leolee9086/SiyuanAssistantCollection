import * as 插件基础事件列表 from "./SiyuanBaseEventTypeList.js";
import { EventEmitter } from "./EventEmitter.js";
export { 插件基础事件列表 as 基础事件 }
export { EventEmitter }
export { EventEmitter as 事件触发器及 }
import { 启用收集protyle事件 } from "./protyleEvents.js";
import { 开始监听DOM键盘事件, DOM键盘事件表 } from "./DOMKeyBoardEvent.js";
import { sac } from "./runtime.js";
import { CronJob } from "../../utils/timer/index.js";
import { watchEffect } from '../../../static/vue.esm-browser.js'
import { buildWsChennel } from "./wsChanel.js";
//监听原生事件触发自定义事件
启用收集protyle事件()
开始监听DOM键盘事件()
export {DOM键盘事件表 as DOM键盘事件表}
export const emitters = {}
export const use = (Emitter) => {
    let emitter = new Emitter()
    emitter.emit = (event, data) => {
        sac.eventBus.emit(emitter.channel + '-'+event, { emitter:emitter.channel, ...data })
    }
    emitters[emitter.channel] = emitter;
    // 遍历 emitter 对象的所有键
    for (let key in emitter) {
        console.log(key)
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
    emitter.ws=buildWsChennel(emitter.channel)
    emitter.onload&&emitter.onload()
    registJobs(emitter)
    return emitter
}
export const emit = (channel, event, detail) => {
   
    sac.eventBus.emit(channel + '-' + event, detail)
    console.log(channel, event, detail)
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
