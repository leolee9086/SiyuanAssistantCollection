import { plugin } from '../runtime.js';
// 获取包的最新版本信息
async function 获取最新版本信息(包名) {
    let url = `https://registry.npmjs.org/${包名}/latest`;
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`获取最新版本信息失败: ${response.statusText}`);
    }
    return await response.json();
}

// 获取包的下载URL
function 获取包下载链接(版本信息) {
    return 版本信息.dist.tarball;
}
// 下载包
async function 下载包(url, 包名) {
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`下载包失败: ${response.statusText}`);
    }
    let blob = await response.blob();
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${包名}.tgz`;
    link.click();
}
// 主函数
async function 下载最新版本包(包名) {
    let 版本信息 = await 获取最新版本信息(包名);
    let 包下载链接 = 获取包下载链接(版本信息);
    await 下载包(包下载链接, 包名);
}
// 使用示例
const { fork } = require('child_process');
const path = require('path');

export function runPnpmCommand(command) {
    return new Promise((resolve, reject) => {
        const pnpmPath = path.join(plugin.localPath, 'source', 'packageManager', 'adapters', 'pnpm.js').replace(/\\/g, '/');
        const args = command.split(' ');
        try {
            const child = fork(pnpmPath, args);
            let stdout = '';
            let stderr = '';
            child.on('message', (message) => {
                stdout += message.message + "\n" + message.stack;
            });

            child.on('error', (error) => {
                reject(error);
            });

            child.on('exit', (code) => {
                if (code !== 0) {
                    console.log(code)
                    reject(new Error(stderr));
                } else {
                    resolve(stdout);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}