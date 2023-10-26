import { plugin } from "../../asyncModules.js"
let {configurer} = plugin
let 手动索引模式 = configurer.get('向量工具设置','手动索引').$value
export const 手动索引过滤语句 = ()=>{
    return `select block_id from attributes where name = 'custom-publish-vectorindex'`
}
export const 手动索引排除语句 = ()=>{
    return `select block_id from attributes where name = 'custom-publish-vectorindex' and not value='true'`
}
export const 路径过滤语句 =()=>{
    return `select id from blocks where root_id in (${手动索引过滤语句()})`
}
export const hash过滤全块数组语句 = (hash值表)=>{
    let hash语句 = `and hash not in (${hash值表.join(',')})`
    if (!hash值表[0]) {
        hash语句 = ''
    }
    let 结果语句 = `
select *  from blocks 
    where length>8  
    ${hash语句} 
    and type !='l' 
    and type != 'i' 
    and type != 's'  
    order by updated desc limit 102400`
    if(手动索引模式){
        结果语句 =  `
        select *  from blocks 
            where length>8  
            ${hash语句} 
            and type !='l' 
            and type != 'i' 
            and type != 's'  
            and id in (${手动索引过滤语句()})
            or id in (${路径过滤语句()})
            and not id in (${手动索引排除语句()})
            order by updated desc limit 102400`
    }
    return 结果语句
}


