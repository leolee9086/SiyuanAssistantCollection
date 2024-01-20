import { 使用transformersjs生成嵌入 } from "./embedding.js"

export const Adapter =   class transformersjsAdapter{
    constructor(){
        this.embedding={}
    }
    init(){

    }
    async prepareEmbedding(text,modelName){
        if(!this.models.embedding.includes(modelName)){
            console.error('不存在的模型名')
            return 
        }
        if(!this.embedding[modelName]){
            this.embedding[modelName]=await 使用transformersjs生成嵌入(modelName)
        }
        return this.embedding[modelName](text)
    }
    ['models']={
        'embedding':[
            'leolee9086/text2vec-base-chinese'
        ]
    }
}
