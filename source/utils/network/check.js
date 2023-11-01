export function checkConnectivity(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('联通成功');
        } else {
            console.log('联通失败，状态码：', xhr.status);
        }
    };
    xhr.onerror = function() {
        console.error('联通失败，错误：', xhr.status);
    };
    xhr.send();
}