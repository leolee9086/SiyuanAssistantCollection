import embedding from '../../../vectorStorage/embedding.js'
class chatMessage{
    constructor(meta){
        this.meta =meta
        this.vectors={}
        this.id = Date.now()
    }
    async embedding(){
        let {vector,model}= await embedding(this.meta.content,{withModel:true})
        this.vectors[model]=vector   
    }
}