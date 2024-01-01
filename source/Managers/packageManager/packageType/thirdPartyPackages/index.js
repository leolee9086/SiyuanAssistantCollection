import { got } from "../../runtime.js";
export const thirdPartyPackageDefines= [
    {
        name: 'colorPlan',
        location: '/data/storage/petal/siyuan-color-scheme',
        topic: 'siyuan-colorPlan',
        meta: 'colorPlan.json',
        adapters: ['github', 'npm', 'siyuan'],
        //这代表着这个类型的扩展包可以支持单文件下载
        singleFile: true,
        filter:(file)=>{
            return file.name
        },
        descriptions:{
            default:'配色方案插件的配色文件集合'
        }
    }
]