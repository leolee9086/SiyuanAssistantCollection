import { sac } from "../../../asyncModules.js"
let { internalFetch } = sac.路由管理器
export function 为索引记录准备索引函数(索引中块哈希,blocks, callback) {
    // 索引逻辑实现...
    // 索引完成后调用回调
    let 其他线程索引中块 = []
    let strings = blocks.map(block => {
        if (索引中块哈希.has(block.hash)) {
            其他线程索引中块.push(block)
            return
        }
        else {
            索引中块哈希.add(block.hash)
            return { id: block.id, content: block.content }
        }
    }).filter(
        item => { return item }
    )
    if (strings[0]) {
        internalFetch('/ai/v1/embedding', {
            method: "POST",
            body: {
                //这里其实直接可以不写表示默认
                model: 'leolee9086/text2vec-base-chinese',
                input: strings,
            },
            //内部调用时需要鉴权的接口也还是要鉴权的
            Headers: {
                //这里鉴权直接使用思源的鉴权码,权限最高,其实这里的权限逻辑暂时还没有实现
                "Authorization": `Bearer ${globalThis.siyuan.config.api.token}`
            }
        }).then(
            res => {
                callback(res.body, 其他线程索引中块.length);
            }
        )

    } else {
        callback([], 其他线程索引中块.length);
    }
}

