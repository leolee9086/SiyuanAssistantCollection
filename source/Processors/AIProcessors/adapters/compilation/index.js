export const Adapter= class{
    init(){

    }
    async prepareText2image(text,modelName){
        if(!this.models.text2image.includes(modelName)){
            return 
        }
        return await(await this.prepareGenerater(modelName))(text)
    }
    prepareGenerater(modelName){
        if(modelName==='pollinations'){
            
        }
    }
    models={
        text2image:[
            'pollinations'
        ]
    }
}