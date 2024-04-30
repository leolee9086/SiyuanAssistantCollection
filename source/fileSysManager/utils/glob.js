import fs from "../../polyfills/fs.js"
export const 读取工作空间文件列表=async (工作空间文件路径)=>{
    let 文件列表 = await fs.readDir(工作空间文件路径)
    let 文件路径列表 = [工作空间文件路径]
    for (let 文件项 of 文件列表) {
        if (文件项.isDir) {
            文件路径列表.push(工作空间文件路径 + 文件项.name + '/')
        }
    }
    return 文件路径列表
}