import { clientApi, kernelApi, sac } from "../../../asyncModules.js"
export let 预览内容列表 = [
    {
        "name": "正向链接",
        type: 'block-refs',
        meta: {
            block_id: "20200812220555-lj3enxa",
            async contentFetcher() {
                let content = []
                const outGoingLinks = await kernelApi.sql(
                    { stmt: `select * from refs where root_id ="20200812220555-lj3enxa"` })
                console.error(outGoingLinks)
                content.length = 0
                for await (let item of outGoingLinks) {
                    item.breadcrumb = await kernelApi.getBlockBreadcrumb({ id: item.def_block_id })
                    item.title = item.breadcrumb[0].name.split('/').pop()
                    item.previewer = (container) => {
                        let { Protyle } = clientApi
                        let editor = new Protyle(
                            sac.app, container,
                            {
                                blockId: item.def_block_id,
                                render: {
                                    background: false,
                                    title: false,
                                    gutter: true,
                                    scroll: false,
                                    breadcrumb: true,
                                }
                            },
                        )
                        return editor
                    }
                    content.push(item)
                }
                return content
            },
            async itemPreviewer(item, container) {

            }
        }
    },
    {
        "name": "自定义1",
        "meta": [
            {
                type: 'block-refs',
                meta: {
                    def_block_id: "",
                    block_id: "",
                    root: "",
                }
            }
        ]
    },
    {
        "name": "自定义2",
        "meta": [
            {
                type: 'block-refs',
                meta: {
                    def_block_id: "",
                    block_id: "",
                    root: "",
                }
            }
        ]
    }
]