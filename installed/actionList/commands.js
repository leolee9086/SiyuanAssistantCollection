
export default function genActions(context) {
    let actions = []
    context.plugin.app.plugins.forEach(
        命令源插件 => {
            if (命令源插件.commands) {
                命令源插件.displayName?context.utils.jieba.add_word(context.plugin.displayName):null
                命令源插件.commands.forEach(
                    command => {
                        actions.push(
                            {
                                icon: 'iconPlugin',
                                label: () => {
                                    return 命令源插件.displayName+':'+command.langKey
                                },
                                hints: 命令源插件.name + ',' + 命令源插件.displayName + ',' + command.langKey+','+'插件',
                                hintAction: (context) => {
                                    command.editorCallback?command.editorCallback(context.protyle):command.callback()
                                },

                            }
                        )
                    }
                )
            }
        }
    )
    return actions
}
