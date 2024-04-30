import { kernelApi } from "../runtime.js";
//初始化字典
let dict = async (context) => {
    let data = await context.kernelApi.sql(
        {
            stmt: `select * from blocks where not type='l' and not type = 'u'   limit 102400`,
        },
        "",
    );
    let _dict = ''
    data.forEach((block) => {
        block.name ? dict += block.name + ',' : null
        block.alias ? dict += block.alias + ',' : null
        block.memo ? dict += block.memo + ',' : null
        block.type == 'd' ? dict += block.content + ',' : null
        block.type == 'h' ? dict += block.content + ',' : null
    })
    return _dict
}
function genActions(context) {
    //这一条语句选择的块结果将会渲染出各种项目
    //加上.sync代表同步执行
    let data = []
    if (context.token) {
        context.kernelApi.sql.sync(
            {
                stmt: `select * from blocks where not type='l' and not type = 'u' and content like "%${context.token.word}%" limit 10`,
            },
            "",
        );
    }
    let data1 = context.kernelApi.sql.sync(
        {
            stmt: `select * from blocks where not type='l' and not type = 'u' order by updated limit 5`,
        },
        "",
    );
    data = data.concat(data1)
    let actions = []
    let genlabel = (context, block) => {
        let word = context.token?context.token.word:context.blocks[0].content
        let index = block.content.indexOf(word);
        let endIndex = index + word.length;
        let truncatedContent = block.content.substring(index, endIndex);
        let contextBefore = block.content.substring(0, index);
        let contextAfter = block.content.substring(endIndex);
        if (contextBefore.length >= 4) {
            truncatedContent = `<mark>${truncatedContent}</mark>`;
        }
        let label = `${block.type}:${contextBefore}${truncatedContent}${contextAfter}`;
        if (label.length > 12) {
            let halfFontSize = "font-size: 80%;";
            label = `${block.type}:${contextBefore.substring(contextBefore.length - 4)}${truncatedContent}${contextAfter.substring(0, 4)}`;
            label = `<span style="${halfFontSize}">${label}</span>`;
        }

        return label;
    }
    data.forEach((block) => {

        actions.push(
            {
                icon: 'iconInsertRight',
                label: (context) => {
                    return genlabel(context, block)
                },
                matchMod: 'includ',
                hints: block.content,
                active: (menu, item) => {
                    if (item.token) {
                        item.token.highlight()
                    }
                    if (item.tokens) {
                        item.tokens.forEach(
                            token => {
                                token.highlight()
                            }
                        )
                    }
                },
                deactive: (menu, item) => {
                    if (item.token) {
                        item.token.dehighlight()
                    }
                    if (item.tokens) {
                        item.tokens.forEach(
                            token => {
                                token.dehighlight()
                            }
                        )
                    }

                },
                //行内关键词触发菜单时的动作
                hintAction: (context) => {
                    if (context.token) {
                        //这个命令会选中当前触发菜单的关键词
                        context.token.select()
                        //然后替换掉它
                        context.protyle.insert(block.content)
                    }
                },
                //块标模式下,对所有块进行批量替换
                //此时上下文没有token,只有每个block有tokens
                iconAction: (context) => {
                    context.blocks.forEach(
                        block => {
                            block.tokenize().forEach(
                                token => {
                                    token.select()
                                    context.protyle.insert(block.content)
                                }
                            )
                        }
                    )
                },
                sort: 0
            }
        )
        //每个块添加一个创块引用动作
        actions.push(
            {
                icon: 'iconRef',
                label: (context) => {
                    return genlabel(context, block)
                },
                matchMod: 'include',
                hints: block.content,
                active: (menu, item) => {
                    if (item.token) {
                        item.token.highlight()
                    }
                    if (item.tokens) {
                        item.tokens.forEach(
                            token => {
                                token.highlight()
                            }
                        )
                    }
                },
                deactive: (menu, item) => {
                    if (item.token) {
                        item.token.dehighlight()
                    }
                    if (item.tokens) {
                        item.tokens.forEach(
                            token => {
                                token.dehighlight()
                            }
                        )
                    }

                },
                //行内关键词触发菜单时的动作
                hintAction: (context) => {
                    if (context.token) {
                        context.token.select()
                        context.protyle.insert(`<span data-type="block-ref" data-subtype="s" data-id="${block.id}" >${block.content}</span>`)
                    }
                },
                //块标模式下,对所有块进行批量替换
                //此时上下文没有token,只有每个block有tokens
                iconAction: (context) => {
                    context.blocks.forEach(
                        block => {
                            block.tokenize().forEach(
                                token => {
                                    token.select()
                                    context.protyle.insert(block.content)
                                }
                            )
                        }
                    )
                },
                sort: 0
            }
        )
    });
    actions.push(
        {
            icon: 'iconTrash',
            label: '删除当前块',
            matchMod: 'include',
            hints: '删除,删除当前块,删块,删掉,干掉当前块',
            hintAction: (context) => {
                context.blocks.forEach(
                    block => { block.remove() }
                )
            }
        }
    )
    actions.push(
        {
            icon: 'iconTrash',
            label: '删除当前文档',
            matchMod: 'include',
            hints: '删除,删除当前文档,删文档,删掉文档,干掉当前文档',
            hintAction: (context) => {
                context.blocks.forEach(
                    block => { block.removeRoot() }
                )
            }
        }
    )
    return actions
}
export default genActions
export { dict as dict }