import { sac } from "../runtime.js"
import { hasClosestByAttribute } from "../../../utils/DOM/DOMFinder.js"
export const openFocusedTipsByEvent = (event,待添加数组) => {
    const source = event.target.dataset.source
    if (source) {
        sac.eventBus.emit('tips-ui-open-tab', {
            type: "focusedTips",
            title: source,
            source: source
        })
    }
    let actionIcon = hasClosestByAttribute(event.target, 'data-action-id')
    if (actionIcon) {
        let actionItem = 待添加数组.find(item => {
            return item.actionId === actionIcon.getAttribute('data-action-id')
        })
        actionItem && actionItem.$action()
    }
}