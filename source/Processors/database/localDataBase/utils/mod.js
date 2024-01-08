export const 计算LuteNodeID模=(ID,基准)=>{
    let num = ID.substring(0,14)
    let mod =num%基准
    return mod
}