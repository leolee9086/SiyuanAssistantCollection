import { CronJob } from "../../../utils/timer/index.js";
import { fs } from "../runtime.js";
const cleanCache=async()=>{
    await fs.removeFile('/temp/noobCache')
    await fs.mkdir('/temp/noobCache')
}
const job = new CronJob('*/15 * * * *', async() => {
    console.log('开始清理集市缓存')
    await cleanCache()
    console.log('结束清理集市缓存')
});
// 启动任务
export const startCleanJob = ()=>{
    console.log('缓存清理定时任务已经开始')
    job.start()
}