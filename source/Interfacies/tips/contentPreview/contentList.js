import * as cheerio from "../../../../static/cheerio.js"
import { string2DOM } from "../../../UITools/builders/index.js"
import { clientApi, kernelApi, sac } from "../../../asyncModules.js"
import { hasClosestByClassName } from "../../../utils/DOM/DOMFinder.js"
import { buildProtylePreview } from "../../../utils/Previewer/blocks.js"
const getCurrentTabEditor = () => {
    let currentEditor = sac.statusMonitor.get('editor', 'current').$value
    //只有在layout__center中的protyle才是普通tab页面中的
    if (currentEditor && !hasClosestByClassName(currentEditor.element, "layout__center")) {
        return
    }
    return currentEditor
}
const getCurrentTabEditorBlock = () => {
    let currentEditor = getCurrentTabEditor()
    if (!currentEditor) {
        return
    } else {
        return currentEditor.block
    }
}
export let 预览内容表 = [
    {
        "name": "正向链接",
        type: 'block-refs',
        meta: {
            async contentFetcher() {
                let content = []
                let currentEditorBlockId
                let currentEditorBlock = getCurrentTabEditorBlock()
                if (currentEditorBlock) {
                    currentEditorBlockId = currentEditorBlock.id
                } else {
                    return
                }
                //清空旧的结果数组
                content.length = 0
                const webLinks = await kernelApi.sql({
                    stmt: `select * from spans where root_id ="${currentEditorBlockId}"`
                })
                for await (let item of webLinks) {
                    if (item.type === 'textmark a') {
                        let link = sac.lute.Md2HTML(item.markdown)
                        let aElement = string2DOM(link)
                        let href = aElement.querySelector('a').href
                        item.breadcrumb = ""
                        item.title = item.content
                        item.icon = "#iconLanguage"
                        item.previewer = {
                            init: (container) => {
                                let iframe = string2DOM(
                                    `<iframe 
                                    sandbox="allow-forms allow-presentation allow-same-origin allow-scripts allow-modals" 
                                    src="${Lute.EscapeHTMLStr(link.href)}" 
                                    data-src="" 
                                    border="0" 
                                    frameborder="no" 
                                    framespacing="0" 
                                    style="padding:none; width:100%; height:60vh; overflow:auto; scrollbar-width: thin; scrollbar-color: #888 #e0e0e0;"
                                    allowfullscreen="true"></iframe>`
                                )
                                iframe.src = href
                                container.appendChild(iframe)
                                item._previewerContainer = container
                                return iframe
                            },
                            destroy: () => {
                                item._previewer = undefined
                                item._previewerContainer.innerHTML = ""
                            }
                        }
                        content.push(item)
                    }
                }
                const outGoingLinks = await kernelApi.sql(
                    { stmt: `select * from refs where root_id ="${currentEditorBlockId}"` })
                for await (let item of outGoingLinks) {
                    item.breadcrumb = await kernelApi.getBlockBreadcrumb({ id: item.def_block_id })
                    //这一步等于校验了块是否存在
                    if (item.breadcrumb[0]) {
                        item.title = item.breadcrumb[0].name.split('/').pop()
                        item.previewer = {
                            init: (container) => {
                                //如果是块链接的话
                                if (item.def_block_id) {
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
                                    return editor

                                }
                            },
                            destroy: () => {
                                item._previewer.destroy()
                                item._previewer = undefined
                                item._previewerContainer.innerHTML = ""
                            }
                        }
                        content.push(item)
                    }
                }
                return content
            },
        }
    },
      {
          name: "正向提及",
          meta: {
              async contentFetcher() {
                  let content = []
                  let currentEditorBlockId
                  let currentEditorBlock = getCurrentTabEditorBlock()
                  if (currentEditorBlock) {
                      currentEditorBlockId = currentEditorBlock.id
                  } else {
                      return
                  }
                  let docRes = await kernelApi.getDoc({id:currentEditorBlockId,size:512})
                  console.log(docRes)
                  let $ = cheerio.load(docRes.content)
                  let spans=$('[data-type="virtual-block-ref"]')
                  let anchors = Array.from(new Set(Array.from(spans).map(span=>{return span&&span.children[0].data})))
                  console.log(anchors)
                  let sql = `select * from blocks where content = ${anchors.map(item => item && `'${item}'`).join(' or content = ')} limit 64`;                  let blocks = await kernelApi.sql({stmt:sql})
                  for await (let block of blocks){
                      let item ={}
                      item.title =block.content
                      item.id = block.id
                      item.previewer={
                          init: (container) => {
                              //如果是块链接的话
                              if (item.id) {
                                  let editor = buildProtylePreview(
                                      item.id,
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
                                  return editor
                              }
                          },
                          destroy: () => {
                              item._previewer.destroy()
                              item._previewer = undefined
                              item._previewerContainer.innerHTML = ""
                          }
                      }
                      item.contextMenu=[
                          {
                              icon:"",
                              label:"在标签页打开",
                              click:()=>{
                                  window.open(`siyuan://blocks/${block.id}`)
                              }
  
                          },
                          {}
                      ]
                      content.push(item)
  
                  }
                  return content
              }
          }
      }
]
sac.eventBus.on('statusChange', (e) => {
    if (e.detail.name === 'editor.current') {
        sac.statusMonitor.set('contentList', 'current', 预览内容表)
    }
})