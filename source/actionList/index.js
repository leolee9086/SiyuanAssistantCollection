import { clientApi, pluginInstance as plugin } from "../asyncModules.js"
import kernelApi from "../polyfills/kernelApi.js"
import { jieba } from "../utils/tokenizer.js"
import fs from "../polyfills/fs.js"
import path from "../polyfills/path.js"
import logger from "../logger/index.js"
export let 动作总表 = []
export { 动作总表 as actionList }
export let storagePath = path.join(plugin.dataPath, 'actionLists')
export let 动作表存储路径 = storagePath
export let installPath = path.join(plugin.selfPath, "installed", 'actionList')
export let 动作表安装路径 = installPath
export let installURL = path.join('/plugins', plugin.name, "installed", 'actionList')
export let 动作表安装地址 = installURL
export let 示例动作表路径 = path.join(plugin.selfPath, 'templateActions')

let 设置器 = plugin.configurer
export { 设置器 as 设置器 }

export const LoadAll = async () => {
    // await 移动示例动作表到存储()
    // await 移动所有动作表到安装位置()
    await 导入所有动作表()
}
export const 移动示例动作表到存储 = async () => {
    let 示例动作表列表 = await fs.readDir(示例动作表路径)
    for await (let 示例动作表 of 示例动作表列表) {
        if (!示例动作表.isDir) {
            await fs.copyFile(path.join(示例动作表路径, 示例动作表.name), path.join(动作表存储路径, 示例动作表.name))
        }
    }
}
export const 移动所有动作表到安装位置 = async () => {
    let 动作表列表 = await fs.readDir(动作表存储路径)
    for await (let 动作表 of 动作表列表) {
        if (!动作表.isDir) {
            await fs.copyFile(path.join(动作表存储路径, 动作表.name), path.join(动作表安装路径, 动作表.name))
        }
    }
}
export const 导入所有动作表 = async () => {
    let 动作表列表 = await fs.readDir(动作表安装路径)
    for await (let 动作表 of 动作表列表) {
        let jsContent
        if (!动作表.isDir) {
            jsContent = await fs.readFile(path.join(动作表安装路径, 动作表.name))
        }
        let moduleURL = path.join(动作表安装地址, 动作表.name)
        let _module = { default: [] }
        try {
            _module = await import(moduleURL);
            _module['default']._动作表路径 = path.join(动作表安装路径, 动作表.name)
            _module['default'].provider = 动作表.name.replace(/\./g, "_")
            动作总表.push(_module['default'] || [])
            await 添加字典(_module.dict)
            let 默认配置 = plugin.configurer.get("动作设置", '默认开启新动作表').$value
            if (plugin.configurer.get("动作设置", '关键词动作设置', 动作表.name.replace(/\./g, "_")).$value === undefined) {
                plugin.configurer.set("动作设置", '关键词动作设置', 动作表.name.replace(/\./g, "_"), 默认配置)
            }
            if (plugin.configurer.get("动作设置", '块标动作设置', 动作表.name.replace(/\./g, "_")).$value === undefined) {
                plugin.configurer.set("动作设置", '块标动作设置', 动作表.name.replace(/\./g, "_"), 默认配置)
            }
        } catch (e) {
            logger.actionListwarn(`动作表${动作表.name}`, e)
        }
    }
    await 预处理动作表()
}

export const 预处理动作表 = async () => {
    for (const 动作表 of 动作总表) {
        try {
            await 处理单个动作表(动作表)
        } catch (e) {
            logger.actionListwarn(动作表, e)
        }
    }
}
export const 处理单个动作表 = (动作表) => {
    if (动作表 instanceof Function) {
        return
    }
    if (!动作表) {
        return
    }
    try {
        for (
            let 动作 of 动作表
        ) {
            动作.provider=动作表.provider
            if (!动作.hints) {
                动作.hints = plugin.defaultHint || '@@'
            }
            let hintArray = 动作.hints.split(',')
            动作.hints.split(',').forEach(
                hint => {
                    let hintPinyin = plugin.utils.pinyin.getFullChars(hint)
                    hintArray.push(hintPinyin)
                    hintArray.push(hintPinyin.toLowerCase())
                }
            )
            try {
                if (plugin.configurer.get('动作设置', '通过文件名过滤动作').$value) {
                    let name =动作表.provider.replace(/_js$/, '')
                    hintArray.push(name)
                    hintArray.push(plugin.utils.pinyin.getFullChars(name))
                }
                if (plugin.configurer.get('动作设置', '通过标签文字过滤动作').$value) {
                    if (typeof 动作.label === 'string') {
                        hintArray.push(动作.label);
                        hintArray.push(plugin.utils.pinyin.getFullChars(动作.label));
                    }
                }
            } catch (e) {
                logger.actionListwarn(动作表, e)
            }
            hintArray = Array.from(new Set(hintArray))
            动作.hintArray = hintArray
            if (!动作.matchMod) {
                动作.matchMod = 'include'
            }
            if (!动作.matcher) {
                generateMatcher(动作)
            }
            if (!动作.blocksFilter) {
                动作.blocksFilter = generateBlockFilter(动作)
            }
        }

        return 动作表
    } catch (e) {
        logger.actionListError(e, 动作表)
    }
}
export const generateMatcher = (动作) => {
    const matchMod = 动作.matchMod
    if (matchMod === 'all' || matchMod === '完全匹配') {
        动作.matcher = function (word, hintArray) { return hintArray.includes(word) }
    } else if (matchMod === 'prefix' || matchMod === '前缀') {
        动作.matcher = function (word, hintArray) { return hintArray.find(hint => { return hint.startsWith(word) }) }
    } else if (matchMod === 'afterfix' || matchMod === '后缀') {
        动作.matcher = function (word, hintArray) { return hintArray.find(hint => { return hint.endsWith(word) }) }
    } else if (matchMod === 'include' || matchMod === '包含') {
        动作.matcher = function (word, hintArray) { return hintArray.find(hint => { return hint.includes(word) }) }
    } else if (matchMod === 'regex' || matchMod === '正则表达式') {
        动作.matcher = function (word, hintArray) {
            return hintArray.find(hint => {
                const regex = new RegExp(word);
                if (regex.test(hint)) {
                    return true;
                }
            })
        }
    } else if (matchMod === 'reverse-prefix' || matchMod === '反向前缀') {
        动作.matcher = function (word, hintArray) { return hintArray.find(hint => { return word.startsWith(hint) }) }
    } else if (matchMod === 'reverse-afterfix' || matchMod === '反向后缀') {
        动作.matcher = function (word, hintArray) { return hintArray.find(hint => { return word.endsWith(hint) }) }
    } else if (matchMod === 'reverse-include' || matchMod === '反向包含') {
        动作.matcher = function (word, hintArray) { return hintArray.find(hint => { return word.includes(hint) }) }
    } else {
        动作.matcher = function (word, hintArray) { return false }
    }
}
export const generateBlockFilter = (动作) => {
    const types = 动作.types || `"d","h","l","i","m","t","b","s","p","html","query_embed","ial","iframe","widget",
        "tb","video","audio","text","img","link_text","link_dest","textmark",`
    const subTypes = 动作.subTypes
    if (!动作.blocksFilter && types) {
        return function (blocks) {
            let flag
            blocks.forEach(
                block => {
                    if (types.includes(block.type)) {
                        flag = true
                        if (subTypes && !subTypes.includes(block.subtype)) {
                            flag = false
                        }
                    }

                }
            )
            return flag
        }
    }
}
export const 添加字典 = async (dict) => {
    if (dict) {
        if (dict instanceof Function) {
            let context = {
                plugin,
                kernelApi,
                clientApi,
                eventType: 'block_action_dict_add'
            }
            let result = await dict(context)
            result.forEach(
                word => word && jieba.add_word(word)
            )
            return
        }
        dict.split(",").forEach(
            word => word && jieba.add_word(word)
        )
    }
}