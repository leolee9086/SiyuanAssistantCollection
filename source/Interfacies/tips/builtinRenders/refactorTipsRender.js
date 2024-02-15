export class tipsRender {
    async renderEditorTips(editorContext) {
        return {
                title: "移动块",
                description: "移动块到各种地方",
                id: Lute.newNodeID(),
                link: "",
                targetBlocks: [editorContext.blockID],
                item: [{
                    id: Lute.newNodeID(),
                    title: "移动到最近文档",
                    link: `siyuan://blocks/${editorContext.blockID}`,
                    description: "右键点击,显示移动菜单",
                    contextMenu: [
                        {
                            icon: "#iconMove",
                            label: "移动当前块到",
                            click: () => { }
                        }
                    ]
                }
                ]
            }
        
    }
}