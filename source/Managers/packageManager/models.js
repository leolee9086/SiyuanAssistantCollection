import { 获取文件下载链接, 获取最新发布版本信息 } from './adapters/gitee.js';
import {kernelApi} from './runtime.js';
import {fs} from './runtime.js';
import {path} from './runtime.js'
import { checkConnectivity } from './runtime.js';
import {模型存放地址} from './runtime.js'
//import { modelInfos } from './Models/info.js';
export let baseModels = ['leolee9086/text2vec-base-chinese']

import { download } from './downloader/downloader.js';
export let 下载基础模型 = async() => {
    baseModels.forEach(
        async (model) => {
            let 模型已存在 = await 校验模型是否存在(model)
            if (!模型已存在) {
                await 下载模型(model)
            }
        }
    )
}
export async function 校验模型是否存在(模型名称) {
    return await fs.exists(path.join(模型存放地址, 模型名称))
}
export async function 下载模型(模型名称) {
    let huggingfaceOnline = await checkConnectivity('https://hf-mirror.com')
    if (huggingfaceOnline) {
        //如果能连通hugginface的话就不用管了
        return
    } else {
        console.warn('huggingface无法联通,尝试从gitee下载模型文件')
        let 所有者 = 模型名称.split('/')[0]
        let 仓库名 = 模型名称.split('/')[1]
        let 下载已经完成 = await fs.exists(`/temp/models/${模型名称}/model.zip`)
        if (!下载已经完成) {
            let 发布信息 = await 获取最新发布版本信息(所有者, 仓库名)
            let 文件下载链接 = await 获取文件下载链接(发布信息, 'model.zip')
            download(文件下载链接, `/temp/models/${模型名称}/model.zip`,false)
        } else {
            await kernelApi.unzip({ zipPath: path.join( `/temp/models/leolee9086/text2vec-base-chinese/model.zip`), path: path.join( 模型存放地址, 模型名称) })
        }
    }
}
