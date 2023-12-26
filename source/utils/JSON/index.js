import fs from "../../polyfills/fs.js";
export async function readJsonFile(path) {
    const data = await fs.readFile(path);
    return JSON.parse(data);
}

export async function writeJsonFile(path, data) {
    await fs.writeFile(path, JSON.stringify(data, null, 2));
}


export async function updateJsonKeyValue(path, key, predicate, newValue) {
    // 读取 JSON 文件
    const data = await readJsonFile(path);

    // 找到对应的项目并更新值
    const item = data.find(item => predicate(item[key]));
    if (item) {
        Object.assign(item, newValue);
    }

    // 写回文件
    await writeJsonFile(path, data);
}