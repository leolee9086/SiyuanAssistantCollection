import { 计算归一化向量余弦相似度 } from "../../../../utils/vector/similarity.js"
import { 获取数据项向量字段值 } from "./item.js";
let 距离缓存 = {};
let 访问次数 = {};
const 缓存限制 = 10000;
function 清理缓存() {
    // 获取访问次数最少的缓存键
    const 最少访问键 = Object.entries(访问次数).sort((a, b) => a[1] - b[1]).map(entry => entry[0]).slice(0, 缓存限制 / 10);
    // 删除这些缓存键
    最少访问键.forEach(键 => {
        delete 距离缓存[键];
        delete 访问次数[键];
    });
}

function 生成向量哈希(向量) {
    // 一个简单的哈希函数，用于生成向量的特征
    
    let hash = 0;
    for (let i = 0; i < 向量.length; i++) {
        const val = 向量[i];
        hash = (hash << 5) - hash + val;
        hash |= 0; // 将hash转换为32位整数
    }
    return hash;
}
export function 计算数据项距离(数据项1, 数据项2, 模型名称) {
    let 向量1 =new Float32Array(获取数据项向量字段值(数据项1, 模型名称))
    let 向量2 =new Float32Array(获取数据项向量字段值(数据项2, 模型名称))
    let 距离 =1-计算归一化向量余弦相似度(向量1, 向量2);
    return 距离
}
function 带缓存计算数据项距离(数据项1,数据项2,模型名称){
    let 向量1 = 获取数据项向量字段值(数据项1, 模型名称);
    let 向量2 = 获取数据项向量字段值(数据项2, 模型名称);
    // 生成包含向量特征的缓存键
    const 缓存键 = [数据项1.id, 数据项2.id].sort().join('-') + `-${模型名称}-${生成向量哈希(向量1)}-${生成向量哈希(向量2)}`;
    // 清理缓存，如果它变得太大
    if (Object.keys(距离缓存).length > 缓存限制) {
        清理缓存();
    }
    if (!距离缓存[缓存键]) {
        //这里是余弦距离
        距离缓存[缓存键] =1-计算归一化向量余弦相似度(向量1, 向量2);
        访问次数[缓存键] = 1; // 初始化访问次数
    } else {
        访问次数[缓存键] += 1; // 更新访问次数
    }
    return 距离缓存[缓存键];
}