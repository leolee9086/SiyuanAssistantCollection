export function 校验并转化为数组(输入){
    if(Array.isArray(输入)){
        return 输入
    }else{
        return [输入]
    }
}
export function 强校验并转化为数组(输入){
    if(Array.isArray(输入)){
        return 输入
    }else if(typeof 输入 === 'object' && 输入.length !== undefined){
        return Array.from(输入)
    }else{
        return [输入]
    }
}