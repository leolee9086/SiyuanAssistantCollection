import { 逆序柯里化, 柯里化 } from '../functionTools.js';
export const 计算分词差异=(当前分词结果, 上一个分词结果)=>{
    // 创建两个集合，一个用于存储当前的分词结果，一个用于存储上一次的分词结果
    let 当前token集合 = new Set(当前分词结果.map(token => token.word));
    let 上一个token集合 = new Set(上一个分词结果.map(token => token.word));
    // 计算两个集合的差集，即当前分词结果中存在但上一次分词结果中不存在的词语
    let token差集 = new Set([...当前token集合].filter(word => !上一个token集合.has(word)));
    // 变化幅度定义为差集的大小
    let 差异token计数 = token差集.size;
    return 差异token计数;
}


//还是弄一个变量解决算了
let 上一个分词结果=[]
export function 更新并检查分词差异(分词结果数组,阈值=0) {
    let 实际阈值 = typeof 阈值 === 'function' ? 阈值() : 阈值;
    if (typeof 实际阈值 !== 'number' || 实际阈值 < 0) {
        throw new Error('阈值必须是非负数或返回非负数的函数');
    }
    console.log(计算分词差异(分词结果数组, 上一个分词结果))
    if (计算分词差异(分词结果数组, 上一个分词结果) >= 实际阈值) {
        上一个分词结果 = 分词结果数组;
        return true;
    }
    return false;
}
export const 准备阈值检查函数=(分词结果数组)=>{
    return 柯里化(更新并检查分词差异)(分词结果数组)
}
export const 准备分词数组检查函数=(阈值=0)=>{
    return 逆序柯里化(更新并检查分词差异)(阈值)
}