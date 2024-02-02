import { clientApi, kernelApi, sac } from "../../../asyncModules.js"
import { hasClosestByClassName } from "../../../utils/DOM/DOMFinder.js"
import { buildProtylePreview } from "../../../utils/Previewer/blocks.js"

export let 预览内容表 = [
    {
        "name": "正向链接",
        type: 'block-refs',
        meta: {
            async contentFetcher() {
                let content = []
                let currentEditor = sac.statusMonitor.get('editor', 'current').$value
                let currentEditorBlockId
                if (currentEditor && !hasClosestByClassName(currentEditor.element, "layout__center")) {
                    return 
                }
                else if (currentEditor) {
                    currentEditorBlockId = currentEditor.block.id
                } else {
                    return 
                }

                const outGoingLinks = await kernelApi.sql(
                    { stmt: `select * from refs where root_id ="${currentEditorBlockId}"` })
                content.length = 0
                for await (let item of outGoingLinks) {
                    item.breadcrumb = await kernelApi.getBlockBreadcrumb({ id: item.def_block_id })
                    item.title = item.breadcrumb[0].name.split('/').pop()
                    item.previewer = {
                        init: (container) => {
                            let editor = buildProtylePreview(
                                item.def_block_id,
                                {
                                    background: false,
                                    title: false,
                                    gutter: true,
                                    scroll: false,
                                    breadcrumb: true
                                },
                                container
                            )
                            item._previewer = editor
                            item._previewerContainer = container
                            item._previewerDestroied && (item._previewerDestroied.value = false)

                            return editor
                        },
                        destroy: () => {
                            item._previewer.destroy()
                            item._previewerContainer.innerHTML = ""
                            item._previewerDestroied.value = true
                        }
                    }
                    content.push(item)
                }
                return content
            },
        }
    },
]
sac.eventBus.on('statusChange', (e) => {
    if (e.detail.name === 'editor.current') {

        sac.statusMonitor.set('contentList', 'current', 预览内容表)
    }
})