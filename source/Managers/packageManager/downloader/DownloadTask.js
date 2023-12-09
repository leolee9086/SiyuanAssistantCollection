import { EventEmitter } from "../runtime.js";
import { fs } from '../runtime.js';
const tasks = {}
function generateId(url, fileName) {
    const str = `${url}_${fileName}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16); // Convert to a positive integer and then to a hexadecimal string
}
export class DownloadTask extends EventEmitter {
    // 构造函数
    constructor(url, fileName, 开始字节 = 0) {
        super();
        this.url = url; // 下载的URL
        this.startByte = this.开始字节 = 开始字节; // 开始下载的字节位置
        this.receivedSize = this.本次已接收字节 = 开始字节; // 本次已接收的字节
        this.totalReceivedSize = this.总接收字节 = 开始字节; // 总共已接收的字节
        this.totalSize = this.总字节 = null; // 文件的总字节
        this.receivedData = this.已接收数据 = []; // 已接收的数据
        this.应暂停 = false; // 是否应该暂停
        this.已开始 = false; // 是否已经开始
        this.controller = new AbortController(); // 控制器
        this.fileName = fileName; // 文件名
        // 设置方法的英文别名
        this.start = this.开始;
        this.pause = this.暂停;
        this.resume = this.恢复;
        this.id = generateId(this.url, this.fileName)

    }
    // 是否应该暂停
    get shouldPause() {
        return this.应暂停;
    }
    // 是否已经开始
    get isStarted() {
        return this.已开始;
    }
    // 保存数据
    async 保存数据() {
        const chunkFileName = `/temp/cctemp/${this.id}.chunk`; // 分块文件名
        const blob = new Blob(this.已接收数据); // 创建Blob对象
        const arrayBuffer = await blob.arrayBuffer(); // 转换为ArrayBuffer
        const buffer = new Uint8Array(arrayBuffer); // 转换为Buffer
        await fs.writeFile(chunkFileName, buffer); // 写入文件
    }
    // 检查缓存
    async 检查缓存() {
        const chunkFileName = `/temp/cctemp/${this.id}.chunk`; // 分块文件名
        try {
            if (await fs.exists(chunkFileName)) { // 如果文件存在
                console.log(chunkFileName)
                const buffer = await fs.readFile(chunkFileName, true); // 读取文件
                this.已接收数据 = [new Uint8Array(buffer)]; // 更新已接收的数据
                this.总接收字节 = buffer.byteLength; // 更新总接收字节
                console.log(this.总接收字节)
            }
        } catch (error) {
            console.error('Error reading file:', error);
            this.已接收数据 = []; // 重置已接收的数据
            this.总接收字节 = 0; // 重置总接收字节
        }
    }
    // 开始下载
    async 开始() {

        if (this.已开始) { // 如果已经开始，则返回
            return;
        }
        await this.检查缓存(); // 检查缓存
        this.已开始 = true; // 设置已开始为true
        this.emit('start'); // 发出开始事件
        try {
            console.log(this.总接收字节)
            const response = await fetch(this.url, { // 请求URL
                signal: this.controller.signal, // 控制信号
                headers: {
                    'Range': `bytes=${this.总接收字节}-` // 请求头
                }
            });
            const reader = response.body.getReader(); // 获取读取器
            this.总字节 = this.总字节 ? this.总字节 : (this.总接收字节 + parseInt(response.headers.get('Content-Length'))); // 更新总字节
            console.log(this.总字节)
            this.本次已保存字节 = 0; // 本次已保存字节
            this.本次已接收字节 = 0; // 本次已接收字节
            while (true) {
                const { done, value } = await reader.read(); // 读取数据
                if (done) { // 如果完成，则跳出循环
                    break;
                }
                this.已接收数据.push(value); // 更新已接收数据
                this.本次已接收字节 += value.length; // 更新本次已接收字节
                this.本次已保存字节 += value.length; // 更新本次已保存字节
                let 进度 = this.总字节 ? ((this.本次已接收字节 + this.总接收字节) / this.总字节) * 100 : 0; // 计算进度
                this.emit('progress', 进度); // 发出进度事件

            }
            let blob = new Blob(this.已接收数据); // 创建Blob对象
            let file = new File([blob], this.fileName); // 创建File对象
            this.emit('complete'); // 发出完成事件
            await fs.writeFile(this.fileName, file); // 写入文件
            await fs.removeFile(`/temp/cctemp/${this.id}.chunk`)
            return file; // 返回文件
        } catch (error) {
            if (error.name === 'AbortError') { // 如果是AbortError
                console.log('Request canceled', error.message); // 打印取消请求的消息
            } else {
                console.error(error); // 打印错误
            }
        }
    }
    // 暂停下载
    暂停() {
        if (this.应暂停) { // 如果应该暂停，则返回
            return;
        }
        this.应暂停 = true; // 设置应暂停为true
        this.总接收字节 += this.本次已接收字节; // 更新总接收字节
        this.controller.abort(); // 中止请求
        console.log(this.总接收字节); // 打印总接收字节
        this.emit('pause'); // 发出暂停事件
        this.保存数据(); // 保存数据
    }
    // 恢复下载
    恢复() {
        if (!this.应暂停) { // 如果不应该暂停，则返回
            return;
        }
        this.应暂停 = false; // 设置应暂停为false
        this.已开始 = false; // 设置已开始为false
        this.controller = new AbortController(); // 创建新的控制器
        this.开始(); // 开始下载
        this.emit('resume'); // 发出恢复事件
    }
}


