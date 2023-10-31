export  async function checkConnectivity(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            console.log('联通成功');
        } else {
            console.log('联通失败，状态码：', response.status);
        }
    } catch (error) {
        console.error('联通失败，错误：', error);
    }
}
