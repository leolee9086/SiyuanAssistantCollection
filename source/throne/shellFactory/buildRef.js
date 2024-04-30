import BlockHandler from "../../utils/BlockHandler.js"
export const 创建参考 = (message)=>{

}
export const 创建选中块参考=(message)=>{
    let refs
    let selectedBlocks = document.querySelectorAll('.protyle-wysiwyg--select')
    for (let el of selectedBlocks) {
        let text = `\n[${(new BlockHandler(el.getAttribute('data-node-id'))).content}](siyuan://blocks/${el.getAttribute('data-node-id')})`
        refs += `\n${text}`
    }
    return refs
}