export  class ProgressBar {
    constructor(task, container) {
        this.task = task;
        this.container = container;
        // 创建进度条和百分比标签
        this.progressBar = document.createElement('progress');
        this.progressBar.setAttribute('value', '0');
        this.progressBar.setAttribute('max', '100');
        this.progressBar.style.width = '100%';
        this.progressBar.style.height = '50px';

        this.percentageLabel = document.createElement('span');

        // 将进度条和百分比标签添加到容器中
        this.container.appendChild(this.progressBar);
        this.container.appendChild(this.percentageLabel);

        // 监听task的progress事件
        this.task.on('progress', ProgressEvent => {
            let downloadedMB = (this.task.总接收字节 + this.task.本次已接收字节) / (1024 * 1024);
            let totalMB = this.task.总字节 / (1024 * 1024);
            this.progressBar.value = ProgressEvent.detail;
            this.percentageLabel.textContent = `Download progress: ${ProgressEvent.detail}%, ${downloadedMB.toFixed(2)}MB/${totalMB.toFixed(2)}MB`;
        });
    }
}