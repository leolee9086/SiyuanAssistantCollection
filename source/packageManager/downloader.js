import { clientApi } from "../asyncModules.js";
import { DownloadTask } from "./DownloadTask.js";

export class DownloadDialog extends clientApi.Dialog {
    constructor(url, fileName,pauseAble) {
        super({
            title: "下载" + fileName,
            content: `<div id="download-interface" class='fn__flex-column' style="pointer-events: auto;overflow:hidden">
            <div style="position: relative;">
            <progress id="download-progress" value="100" max="100" style="width: 100%;height: 50px;"></progress>
            <span id="download-percentage" style="position: absolute;top:15px; left: 10%; transform: translateX(-10%);">Download progress: 100%, 74.50MB/74.50MB</span>
        </div>
                        <button id="pause-resume-button" >暂停</button>
                        <button id="cancel-button" >取消</button>
                      </div>`,
            destroyCallback: () => {
                // 在这里处理对话框销毁时的逻辑
            },
            width: '600px',
            height: 'auto',
            transparent: false,
            //disableClose: pauseAble?false:true,
            disableAnimation: false
        },);
        this.fileName = fileName
        // 在这里处理对话框创建后的逻辑
        this.task = new DownloadTask(url,fileName);
        this.task.on('start', () => {
            console.log('Download started');
        });

        this.task.on('progress', ProgressEvent => {
            let downloadedMB = (this.task.总接收字节 + this.task.本次已接收字节) / (1024 * 1024);
            let totalMB = this.task.总字节 / (1024 * 1024);
            document.getElementById('download-progress').$value = ProgressEvent.detail;
            document.getElementById('download-percentage').textContent = `Download progress: ${ProgressEvent.detail}%, ${downloadedMB.toFixed(2)}MB/${totalMB.toFixed(2)}MB`;
        });
        this.task.on('pause', () => {
            document.getElementById('pause-resume-button').textContent = '恢复';
        });
        this.task.on('resume', () => {
            document.getElementById('pause-resume-button').textContent = '暂停';
        });

        document.getElementById('pause-resume-button').addEventListener('click', () => {
            console.log(this.task.shouldPause)
            if (this.task.shouldPause) {

                this.task.resume();
            } else {
                this.task.pause();
            }
        });

        document.getElementById('cancel-button').addEventListener('click', () => {
            this.task.pause();
        });

        this.task.start()

        this.element.style.pointerEvents = 'none'
        this.element.style.zIndex = '1'
        this.element.querySelector(".b3-dialog__container").style.pointerEvents = 'auto'
    }
}

// 触发文件下载并返回一个包含 File 对象的 Promise
