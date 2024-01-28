import fs from "../../../polyfills/fs.js"
export const 读取缓存的已索引结果 = async () => {
    if (await fs.exists('/temp/noobTemp/blockHashs.json')) {
        let 缓存的已索引结果 = JSON.parse(await fs.readFile('/temp/noobTemp/blockHashs.json'))
        return 缓存的已索引结果||[]
    }
}
//写入到文件是为了避免多端重复索引
export const 写入已索引块哈希到文件 = async (已索引块哈希) => {
    await fs.writeFile('/temp/noobTemp/blockHashs.json', JSON.stringify(Array.from(已索引块哈希)))
}