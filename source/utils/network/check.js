import { sac } from "../../asyncModules.js";
export function checkConnectivity(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                sac.logger.networklog('联通成功');
                resolve('联通成功');
            } else {
                sac.logger.networklog('联通失败，状态码：', xhr.status);
                reject(new Error('联通失败，状态码：' + xhr.status));
            }
        };
        xhr.onerror = function() {
            sac.logger.networklog('联通失败，错误：', xhr.status);
            reject(new Error('联通失败，错误：' + xhr.status));
        };
        xhr.send();
    });
}