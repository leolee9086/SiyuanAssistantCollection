import { DownloadTask } from './DownloadTask.js';
import { DownloadDialog } from './UI/dialog.js';
import { fs } from '../runtime.js';
export async function download(url, target) {
    // 创建DownloadTask实例
    const task = new DownloadTask(url, target);
    // 创建DownloadDialog实例
    const dialog = new DownloadDialog([task]);
    // 开始下载任务
    task.on('complete',()=>{dialog.destroy()})
    return await     task.start();
}
export async function checkAndDownload(url,target){
    if(!await fs.exists(target)){
        return await download(url,target)
    }else{
        return await fs.readFile(target)
    }
}
/*const url = 'https://mirrors.tuna.tsinghua.edu.cn/anaconda/archive/Anaconda3-5.1.0-Linux-x86_64.sh';
const target = '/temp/models/Anaconda3-5.1.0-Linux-x86_64.sh';
await checkAndDownload(url, target)*/