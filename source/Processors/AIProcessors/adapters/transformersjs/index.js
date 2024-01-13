import { 使用transformersjs生成嵌入 } from "./embedding.js"

export const Adapter =   class transformersjsAdapter{
    init(){

    }
    async embedding(text,modelName){
        if(!this.models.embedding.includes(modelName)){
            return 
        }
        return await(await 使用transformersjs生成嵌入(modelName))(text)
    }
    ['models']={
        'embedding':[
            'leolee9086/text2vec-base-chinese'
        ]
    }
}
