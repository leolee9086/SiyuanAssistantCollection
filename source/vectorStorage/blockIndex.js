import { 数据库 } from "./dataBase/index.js"
import { 校验索引设置 } from "./utils/checkConfig.js"
import { plugin } from "../asyncModules.js"
import { 使用worker处理数据 } from "../utils/webworker/workerHandler.js"
import logger from "../logger/index.js"
import kernelApi from "../polyfills/kernelApi.js"
import { 创建笔记本字典 } from "../utils/blockDataProcessor.js"
import { 根据笔记本ID获取笔记本 } from "../utils/notebooks.js"
import { hash过滤全块数组语句 } from "./utils/sql.js"
const { statusMonitor, eventBus, configurer } = plugin
export const 向量存储 = {
    公开向量数据库实例: new 数据库('/data/public/vectorStorage'),
    插件向量数据库实例: new 数据库('/data/storage/petal/SiyuanAssistantCollection/vectorStorage'),
    //临时向量数据库实例,可以用来存一些不需要的数据
    临时向量数据库实例: new 数据库('/temp/vectorStorage'),
    简易向量数据原型: 数据库
}
export let blockDataSet = plugin.块数据集
export let seachWithVector = async (...args) => { return await plugin.块数据集.以向量搜索数据(...args) }
const embeddingWorkerURL = import.meta.resolve(`./embeddingWorker.js`)
export const 开始索引 = async () => {
    let 向量工具设置 = configurer.get('向量工具设置').$value
    let 模型可用 = await 校验索引设置(向量工具设置)
    if(模型可用){
        await 初始化数据集()
        if (!statusMonitor.get('索引器', '已加载').$value) {
            statusMonitor.set('索引器', '已加载', (await 创建索引器(configurer.get('向量工具设置').$value, embeddingWorkerURL)) ? true : false)
            eventBus.emit('blockIndexerReady')
        }
        let 全块数组 = await 获取全块数组()
        let boxMap = 创建笔记本字典(全块数组);
        let { 总块数量, 总处理时长 } = await 处理所有笔记本数据(boxMap);
        打印索引完成信息(总块数量, 总处理时长);
        清理索引();
    }
}

export const 创建索引器 = async (向量工具设置, 向量生成器地址) => {
    await logger.blockIndexlog('开始创建索引')
    await 使用worker处理数据(
        向量工具设置,
        向量生成器地址,
        '初始化配置',
        true
    )
    return true
}
export const 初始化数据集 = async () => {
    let 块数据集 = 向量存储.公开向量数据库实例.创建数据集(
        'blockVectors' + '/' + plugin.configurer.get('向量工具设置', '默认文本向量化模型').$value,
        'id',
        'box'
    )
    logger.blockIndexlog('开始加载数据')
    await 块数据集.加载数据()
    logger.blockIndexlog(块数据集)
    plugin.块数据集 = 块数据集
    plugin.块数据集已加载 = true
}

export const 处理子切片 = async (子切片, 最大句子长度) => {
    try {
        let 数据组 = await 使用worker处理数据(
            {
                块数据数组: 子切片,
                配置: {
                    最大句子长度: 最大句子长度,
                }
            },
            embeddingWorkerURL,
            '重建全部索引'
        );
        数据组 = 数据组.map(
            item => {
                return item.vector[0] ? item : undefined
            }
        );
        if (数据组[0]) {
            plugin.块数据集.添加数据(数据组);
            await plugin.块数据集.保存数据(true);
        }
    } catch (e) {
        logger.error(e);
    }
}
export const 创建切片 = async (原始数据, 分片尺寸) => {
    const 切片数组 = [];
    for (let i = 0; i < Math.ceil(原始数据.length / 分片尺寸); i++) {
        const 切片 = 原始数据.slice(i * 分片尺寸, (i + 1) * 分片尺寸);
        切片数组.push(切片);
    }
    return 切片数组
}
/**
  * 批处理索引切片
  * @param {Array} 原始数据 - 需要处理的原始数据
  * @returns {Object} - 返回一个对象，包含处理的块数量和总处理时长
  * 
  * 注意：这个函数假设原始数据是一个非空数组，如果不是，函数可能会抛出错误。
  * 另外，这个函数使用了多个worker并行处理切片，如果worker处理切片时出错，可能会导致整个函数失败。
  * 最后，这个函数的处理时间可能会很长，如果处理时间过长，可能会影响用户的体验。
  */
export const 批处理索引切片 = async (原始数据) => {
    if (!Array.isArray(原始数据) || 原始数据.length === 0) {
        throw new Error('原始数据必须是一个非空数组');
    }
    let box = 原始数据[0].box
    let noteBookInfo = await 根据笔记本ID获取笔记本(box)
    logger.blockIndexlog(`开始处理笔记本:${noteBookInfo.name}${原始数据[0].box},总计${原始数据.length}个块`);
    let 处理开始时间 = performance.now();
    //这里给出设置
    const 切片数组 = await 创建切片(原始数据, plugin.configurer.get('向量工具设置', '块索引分片大小').$value);
    const worker数量 = navigator.hardwareConcurrency || 8;
    await 处理切片数组(切片数组, worker数量, 原始数据, 处理开始时间);
    let 处理时长 = (performance.now() - 处理开始时间) / 1000;
    logger.blockIndexlog(`笔记本:${原始数据[0].box}处理时长为${处理时长},总计块${原始数据.length},单块处理时长约${处理时长 / 原始数据.length || 0}秒`);
    await 清理索引();
    return { 块数量: 原始数据.length, 处理时长: 处理时长 };
}
const 处理切片数组 = async (切片数组, worker数量, 原始数据, 处理开始时间) => {
    let 已处理数量 = 0;
    for (let i = 0; i < 切片数组.length; i += worker数量) {
        const 子切片数组 = 切片数组.slice(i, i + worker数量);
        await 处理子切片数组(子切片数组);
        已处理数量 += 子切片数组.length;
        打印处理进度(原始数据, 已处理数量, 处理开始时间);
    }
    return 已处理数量;
}
export const 清理索引 = async () => {
    let id数组 = plugin.块数据集.主键列表
    let id字符串数组 = id数组.map(
        item => { return `'${item}'` }
    )
    let idSQL = `select id,hash from blocks where id in (${id字符串数组.join(',')}) limit 102400`
    let data = plugin.kernelApi.SQL.sync({ 'stmt': idSQL })
    if (data) {
        data = data.map(item => {
            return item.id
        })
        let id数组1 = id数组.filter(
            item => { return !data.includes(item) }
        )
        logger.blockIndexlog(`删除${id数组1.length}条多余索引`)
        plugin.块数据集.删除数据(id数组1)
        await plugin.块数据集.保存数据()
    }
}


export const 获取全块数组 = async () => {
    let hash表 = plugin.块数据集.根据路径获取值('meta.hash')
    let hash值表 = hash表.map(item => { return `'${item.hash}'` })
    let 全块数组获取语句 = hash过滤全块数组语句(hash值表)
    logger.blockIndexlog(plugin.块数据集, hash值表)
    let 全块数组 = kernelApi.sql.sync({ stmt: 全块数组获取语句 })
    logger.blockIndexlog('待处理块数量:' + 全块数组.length)
    return 全块数组
}
export const 处理子切片数组 = async (子切片数组) => {
    try {
        await Promise.all(子切片数组.map(子切片 => 处理子切片(子切片, plugin.最大句子长度)));
    } catch (error) {
        logger.blockIndexerror('处理子切片时出错:', error);
        throw error;
    }
}
export const 打印索引完成信息 = (总块数量, 总处理时长) => {
    plugin.statusMonitor.set('blockIndex', 'progress', '完成')
    logger.blockIndexlog(`笔记向量索引完成,索引了${总块数量}个块,总处理时长${总处理时长}秒,单块处理时长约${总处理时长 / 总块数量}秒,使用模型为${plugin.configurer.get('向量工具设置', '默认文本向量化模型').$value}`)
}
export const 打印处理进度 = (原始数据, 已处理数量, 处理开始时间) => {
    const 处理时长 = (performance.now() - 处理开始时间) / 1000;
    const 切片大小 = plugin.configurer.get('向量工具设置', '块索引分片大小').$value
    const 单块处理时长 = 处理时长 / 已处理数量 / 切片大小;
    const 剩余块数量 = 原始数据.length - 已处理数量 * 切片大小;
    logger.blockIndexlog(`笔记本:${原始数据[0].box}已处理${已处理数量 * 切片大小}个块,剩余${剩余块数量},单块处理时长约${单块处理时长}秒,请耐心等候,你可以继续记录,不受影响`);
}
export const 处理所有笔记本数据 = async (boxMap) => {
    let 总块数量 = 0, 总处理时长 = 0
    for (const 笔记本数据 of boxMap.values()) {
        let result = await 批处理索引切片(笔记本数据)
        总块数量 += result.块数量
        总处理时长 += result.处理时长
    }
    return { 总块数量, 总处理时长 };
}