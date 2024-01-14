import { sac } from "../../../../asyncModules.js"

const roles = {user:user,system:"system"}
export const buildUserMessage=(content)=>{
    const message = {
        role:roles.user,
        content:content
    }
    return message
}
export const buildUserMessageWithID=(content)=>{
    const message = buildUserMessage(content)
    message.id= Lute.NewNodeID()
    return message
}
export const embeddingMessage=async(message)=>{
    const {content} = message
    const vectorres = await text2vec(content)
    return {
        id:message.id,
        meta:{
            content:message.content
        },
        vector:{
            'leolee9086/text2vec-base-chinese':vectorres.body.data[0].embedding
        },
        neighbor:{
            next:"",
            previous:""
        }
    }
}

export const buildSessionUserMessage=(text,embeddingModels,history)=>{

}