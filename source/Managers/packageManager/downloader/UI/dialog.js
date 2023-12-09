import { clientApi } from "../../runtime.js";
import { ProgressBar } from './ProgressBar.js';
export class DownloadDialog extends clientApi.Dialog {
    constructor(tasks) {
        super({
            title: "下载",
            content: `<div id="download-interface" class='fn__flex-column' style="pointer-events: auto;overflow:hidden"></div>`,
            destroyCallback: () => {
                // 在这里处理对话框销毁时的逻辑
            },
            width: '600px',
            height: 'auto',
            transparent: true,
            //disableClose: pauseAble?false:true,
            disableAnimation: false
        },);
        this.tasks = tasks;
        this.progressBars = [];
        for (const task of this.tasks) {
            const taskContainer = document.createElement('div');
            taskContainer.innerHTML = `
                <div>从${task.url}</div>
                <div>下载到${task.fileName}</div>
                <div id="progress-bar-container-${task.id}"></div>
                <button id="pause-resume-button-${task.id}">暂停</button>
                <button id="cancel-button-${task.id}">取消</button>
            `;
            document.getElementById('download-interface').appendChild(taskContainer);
            // 创建ProgressBar实例
            const container = document.getElementById(`progress-bar-container-${task.id}`);
            const progressBar = new ProgressBar(task, container);
            this.progressBars.push(progressBar);
            task.on('pause', () => {
                document.getElementById(`pause-resume-button-${task.id}`).textContent = '恢复';
            });
            task.on('resume', () => {
                document.getElementById(`pause-resume-button-${task.id}`).textContent = '暂停';
            });
            document.getElementById(`pause-resume-button-${task.id}`).addEventListener('click', () => {
                if (task.shouldPause) {
                    task.恢复();
                } else {
                    task.暂停();
                }
            });
            document.getElementById(`cancel-button-${task.id}`).addEventListener('click', () => {
                task.暂停();
                taskContainer.remove();
            });
            task.on('complete', () => {
                taskContainer.remove();
            });
        }
        this.element.style.pointerEvents = 'none';
        this.element.style.zIndex = '1';
        this.element.querySelector(".b3-dialog__container").style.pointerEvents = 'auto';
    }
}
// 触发文件下载并返回一个包含 File 对象的 Promise
