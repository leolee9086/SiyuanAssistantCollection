import {向量存储}  from '../../asyncModules.js'
import { getPluginInstance } from '../../asyncModules.js';
import fs  from '../../polyfills/fs.js';
export class 记忆 {
    constructor(ghost) {
        this.长期记忆 = {
            对话历史: [
            ],
            短期记忆备份: [],
            工作记忆备份: []
        };
        this.参考资料=getPluginInstance().块数据集,
        this.短期记忆 = [];
        this.工作记忆 = [];
        this.短期记忆容量 = 32;
        this.工作记忆容量 = 30;
        this.owner=ghost
        this.存储位置 = `/data/storage/petal/blockAction/ghosts/${this.owner.name}`
    }
    async 存储() {
        await this.整理工作记忆();
        await this.存储长期记忆();
    }

    async 从存储中恢复() {
        if(await fs.exists(this.存储位置)){
            let content  = await fs.readFile(this.存储位置)
            Object.assign(this.长期记忆,JSON.parse(content))
        } 
        
        this.短期记忆 = JSON.parse(JSON.stringify(this.长期记忆.短期记忆备份))
        this.工作记忆 = JSON.parse(JSON.stringify(this.长期记忆.工作记忆备份))
    }
    添加到工作记忆(item) {
        console.log(item)
        if (this.工作记忆.length >= this.工作记忆容量) {
            this.工作记忆.shift();
        }
        this.工作记忆.push(item);
        this.长期记忆.对话历史.push(item)
    }
    async 整理工作记忆() {
        let 结果 = await this.owner.整理工作记忆(this.短期记忆, this.工作记忆);
        
        if (this.短期记忆.length >= this.短期记忆容量) {
            this.短期记忆.shift();
        }
        this.短期记忆.push(结果);
    }
    async 存储长期记忆() {
        console.log(this.长期记忆,this.短期记忆,this.工作记忆)

        this.长期记忆.短期记忆备份 = JSON.parse(JSON.stringify(this.短期记忆))
        this.长期记忆.工作记忆备份 = JSON.parse(JSON.stringify(this.工作记忆))
        await fs.writeFile(this.存储位置,JSON.stringify(this.长期记忆,null,2))
    }
    async 回忆(激活文字) {
        let 短期记忆 = this.短期记忆;
        let 回忆 = await this.合并短期与工作记忆(短期记忆, 激活文字);
        回忆 = await this.从长期记忆中提取(回忆, 激活文字);
        return 回忆;
    }
    async 合并短期与工作记忆(短期记忆, 激活文字) {
        return 短期记忆.concat(this.工作记忆);
    }
    async 从参考资料中提取(激活文字,回忆=[]) {
        let 输入向量=  await getPluginInstance().textProcessor.提取文本向量(激活文字, 128);
        let 文本搜索结果 = await this.参考资料.以向量搜索数据('vector', 输入向量,20 , '', false, null)
        //   let 输入向量 = await this.Ghost.语言处理器.矢量化输入(激活文字);
     //   let 检索结果 = await this.Ghost.语言处理器.检索长期记忆(this.长期记忆.参考资料, 输入向量, 激活文字);
        回忆 = 回忆.concat(文本搜索结果);
        return 回忆;
    }

}
