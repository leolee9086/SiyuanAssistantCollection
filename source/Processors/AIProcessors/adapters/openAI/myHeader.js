export const myHeaders=(options)=>{
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${options.apiKey}`);
    headers.append("User-Agent", "SiYuan/2.10.2 https://b3log.org/siyuan Electron Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) SiYuan/2.10.2 Chrome/114.0.5735.289 Electron/25.7.0 Safari/537.36");
    headers.append("Content-Type", "application/json");
    return headers
}