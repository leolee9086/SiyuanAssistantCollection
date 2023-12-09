import {fs} from '../runtime.js';
export class ChunkFileWriter {
    constructor(fileName) {
        this.fileName = fileName;
        this.chunkSize = 100 * 1024 * 1024; // 分块大小，这里设置为10MB
    }

    // 写入数据
    async write(data) {
        let chunkIndex = 0; // 分块索引
        for (let i = 0; i < data.length; i += this.chunkSize) {
            const chunkFileName = `${this.fileName}.chunk${chunkIndex}`; // 分块文件名
            const chunkData = data.slice(i, i + this.chunkSize); // 获取一个数据块
            const blob = new Blob([chunkData]); // 创建Blob对象
            const arrayBuffer = await blob.arrayBuffer(); // 转换为ArrayBuffer
            const buffer = new Uint8Array(arrayBuffer); // 转换为Buffer
            await fs.writeFile(chunkFileName, buffer); // 写入文件
            chunkIndex++; // 更新分块索引
        }
    }

    // 读取数据
    async read() {
        let chunkIndex = 0; // 分块索引
        let data = [];
        while (true) {
            const chunkFileName = `${this.fileName}.chunk${chunkIndex}`; // 分块文件名
            if (await fs.exists(chunkFileName)) { // 如果文件存在
                const buffer = await fs.readFile(chunkFileName); // 读取文件
                data.push(new Uint8Array(buffer)); // 更新已接收的数据
                chunkIndex++; // 更新分块索引
            } else {
                break; // 如果文件不存在，则跳出循环
            }
        }
        return data;
    }
}