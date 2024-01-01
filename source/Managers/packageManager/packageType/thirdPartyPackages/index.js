import path from "../../../../polyfills/path.js";
import { fs, got } from "../../runtime.js";
//这是配色插件的配色方案包配置
export const thirdPartyPackageDefines = [
    {
        name: 'colorPlan',
        location: '/data/storage/petal/siyuan-color-scheme',
        topic: 'siyuan-colorPlan',
        //默认的meta文件就是package.json
        meta: 'package.json',
        adapters: ['github', 'npm', 'siyuan'],
        //这代表着这个类型的扩展包可以支持单文件下载
        singleFile: true,
        //这是一个支持单文件的包类型,所以它应该使用fileInstaller而是不installer函数来自定义安装文件流程
        fileInstaller: {
            //这个可以不用写让sac托管
            install: async (source, target) => {
                //由于配色插件的包文件是简单的js文件,所以安装的时候直接复制就可以了
                //source的文件名就是原始文件名
                //target的文件名是包名加下划线加原始文件名
                await this.workspace.copyFile(source, target)
            },
            //这个可以不用写让sac托管
            uninstall: async (target) => {
                await this.workspace.removeFile(target)
            },
            //这个可以不用写让sac托管
            checkInstalled: async (packageName, fileName) => {
                let installedName = `${packageName}_${fileName}`
                return await fs.exists(path.join(this.location, installedName))
            },
            afterInstall: async (packageName, fileName) => {
                //这个是配置文件的位置,对于配色方案插件来说应该是config.json.txt?
                //所以安装完了之后要对congfig.json.txt干点啥??
                let status = this.status
            },
            filter: (file) => {
                //由于是单文件包所以需要
                return file.name.endsWith('.json.txt')
            },
        },
        descriptions: {
            default: '配色方案插件的配色文件集合'
        },
    },
    {
        name: 'huggingfaceModel',
        location: '/data/public/huggingface-models',
        topic: 'huggingface-model',
        // 默认的meta文件就是config.json
        meta: 'config.json',
        adapters: ['huggingface'],
        // 这代表着这个类型的扩展包可以支持单文件下载
        singleFile: false,
        // 这是一个支持多文件的包类型，所以它应该使用installer函数来自定义安装文件流程
        installer: {
            // 这个可以不用写让sac托管
            install: async (source, target) => {
                // 由于模型文件是多个文件，所以安装的时候需要解压并复制所有文件
                // source的文件名就是原始文件名
                // target的文件名是包名加下划线加原始文件名
                await this.workspace.copyFile(source, target)
            },
            // 这个可以不用写让sac托管
            uninstall: async (target) => {
                await this.workspace.removeFile(target)
            },
            // 这个可以不用写让sac托管
            checkInstalled: async (packageName, fileName) => {
                let installedName = `${packageName}_${fileName}`
                return await fs.exists(path.join(this.location, installedName))
            },
            afterInstall: async (packageName, fileName) => {
                // 这个是配置文件的位置，对于模型来说应该是config.json
                // 所以安装完了之后要对config.json干点啥??
                let status = this.status
            },
            filter: (file) => {
                // 由于是多文件包所以需要
                return true;
            },
        },
        descriptions: {
            default: 'Hugging Face 模型文件集合'
        },
    }
]