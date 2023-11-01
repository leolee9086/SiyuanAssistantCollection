import { logger } from "../../logger/index.js";

export function checkConnectivity(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            logger.networklog('联通成功');
        } else {
            logger.networklog('联通失败，状态码：', xhr.status);
        }
    };
    xhr.onerror = function() {
        logger.networklog('联通失败，错误：', xhr.status);
    };
    xhr.send();
}