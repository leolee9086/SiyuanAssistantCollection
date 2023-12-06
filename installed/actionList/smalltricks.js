import { plugin, kernelApi, clientApi } from "../runtime.js";
async function 以文本查找最相近文档(textContent, count, 查询方法, 是否返回原始结果, 前置过滤函数, 后置过滤函数) {
    let embedding = await plugin.文本处理器.提取文本向量(textContent)
    let vectors = plugin.块数据集.以向量搜索数据('vector', embedding, count, 查询方法, 是否返回原始结果, 前置过滤函数, 后置过滤函数)
    return vectors
}
export default (_context) => {
    return [
        {
            icon: "",
            label: "使用openAI生成配图",
            hints: '配图,生成配图',
            hintAction: async (context) => {
                let blockElement = context.blocks[0].elements[0]
                var myHeaders = new Headers();
                myHeaders.append(
                    "Authorization",
                    `Bearer ${window.siyuan.config.ai.openAI.apiKey}`
                );
                myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
                myHeaders.append("Content-Type", "application/json");
                context.token.select()
                context.token.delete()

                var raw = JSON.stringify({
                    prompt: blockElement.innerText,
                    response_format: "url",
                    size: "512x512",
                });
                var requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow",
                };

                let data = await fetch(
                    `${window.siyuan.config.ai.openAI.apiBaseURL}/images/generations`,
                    requestOptions
                );
                let url = (await data.json()).data[0].url;
                context.protyle.insert(
                    `<span contenteditable="false" data-type="img" class="img"><span> </span><span><span class="protyle-action protyle-icons"><span class="protyle-icon protyle-icon--only"><svg class="svg"><use xlink:href="#iconMore"></use></svg></span></span><img src="${url}" data-src="${url}" alt="image"><span class="protyle-action__drag"></span><span class="protyle-action__title"></span></span><span> </span></span>`
                )
                setTimeout(
                    async () => {
                        await context.blocks[0].netImg2LocalAssets()
                        context.protyle.reload()
                    }, 1000
                )
            },
        },
        {
            icon: "",
            label: "使用openAI为当前块嵌入向量",
            hints: '嵌入,嵌入向量',
            hintAction: async (context) => {
                let blockElement = context.blocks[0].elements[0]
                context.token.select()
                context.token.delete()
                console.log(await 获取块嵌入向量(blockElement.dataset.nodeId, true))
            },

        },
        {
            icon: "",
            label: "使用openAI为当前文档嵌入向量",
            hints: '嵌入,嵌入向量',
            hintAction: async (context) => {
                let root = context.blocks[0].root.id
                context.token.select()
                context.token.delete()
                console.log(await 获取块嵌入向量(root, true))
                embeddingDataBase[doc.id].block = root._block

            },

        },
        {
            icon: "",
            label: `根据智能搜索块内容:插入引用于当前块之后`,
            hints: '搜索',
            matchMod: 'any',
            active: (menu, element) => {
                if (element.token) {
                    element.token.highlight()
                }
            },
            hintAction: async (context) => {
                //因为查询结果不主动删除是不会被删掉的,所以查询的时候要加一个前置过滤
                let 块数据集 = context.plugin.块数据集
                let plugin = context.plugin
                
                let results = await 以文本查找最相近文档(context.blocks[0].content, 10, '', false, null, (b) => {
                    return kernelApi.checkBlockExist.sync({ id: b.meta.id })
                })
                for (let result of results.reverse()) {
                    context.blocks[0].insertAfter(`- ((${result.meta.id} '${result.meta.content}@score:${result.similarityScore}'))\n`)
                }
                setTimeout(
                    () => {
                        context.protyle.reload()

                    }, 1000
                )
            },
        },
        {
            icon: "",
            label: `笔记里的相近块`,
            hints: '搜索',
            matchMod: 'any',
            tipRender: async (context) => {
                let results = await 以文本查找最相近文档(context.blocks[0].content, 5, '', false, null)
                results = results.filter(
                    item => {
                        return !document.querySelector(`[href="siyuan://blocks/${item.meta.id}"]`)
                    }
                )
                if (results[0]) {
                    let item=[]
                    for (let result of results) {
                        item.push(
                            {
                                title: '笔记里的相近块', 
                                link: `siyuan://blocks/${result.meta.id}`, 
                                description: `${result.meta.content.substring(0,36)}@score:${result.similarityScore}`,
                            }
                        )
                    }
                    return { 
                        title:"笔记里的相近块",
                        link:`siyuan://blocks/${context.blocks[0].id}`,
                        item
                    }
                }
            }
        },
        {
            icon: "",
            label: "开始对话",
            hints: '对话,开始AI对话,chat,人工智障,closeAI',
            hintAction: (context) => {
                context.token.select()
                context.token.delete()
                plugin.emit('打开主人工智能对话框')
            },
            blockAction: (context) => {
                context.token.select()
                context.token.delete()
                plugin.emit('打开主人工智能对话框')
            },
        },
    ]
}
