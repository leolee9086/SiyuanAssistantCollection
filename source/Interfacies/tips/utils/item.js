import { genTipsHTML } from "../UI/buildTipsHTML.js";

export function 切换钉住状态(item){
    if (item.pined) {
        item.scores.pined=Infinity
        let tips = sac.statusMonitor.get('tips', 'current').$value || [];
        // 找到item在tips中的位置
        let index = tips.findIndex(tip => tip === item);
            // 找到最后一个被pin的元素的位置
            let lastPinnedIndex = tips.lastIndexOf(tip => tip.pined);
            // 如果没有其他被pin的元素，那么item应该被移动到数组的开始
            if (lastPinnedIndex === -1) {
                lastPinnedIndex = 0;
            }
            // 移动item到最后一个被pin的元素的后面
            tips.splice(index, 1);
            tips.splice(lastPinnedIndex + 1, 0, item);
        }else{
            item.scores.pined=0
        }
}

export function 准备渲染项目(tips条目, 编辑器上下文) {
    tips条目.targetBlocks = tips条目.targetBlocks || [编辑器上下文.blockID];
    tips条目.source = tips条目.source || "unknown";
    tips条目.type = 'keyboardTips';
    tips条目.delete = () => { tips条目.deleted = true; };
    tips条目.pin = () => { tips条目.pined = true; };
    tips条目.unpin = () => { tips条目.pined = false; };
    if (!tips条目.targetBlocks) {
        return;
    }
    if (!tips条目.scores) {
        tips条目.scores = {};
    }
    if (!tips条目.actionId) {
        tips条目.actionId = Lute.NewNodeID();
    }
    if (tips条目.action && 编辑器上下文) {
        tips条目.scores.actionScore = tips条目.scores.actionScore || 3;
        tips条目.$action = () => {
            tips条目.action(编辑器上下文);
        };
    }
    if (tips条目.link) {
        tips条目.link = Lute.EscapeHTMLStr(tips条目.link);
    }
    if (!tips条目.content) {
        tips条目.content = genTipsHTML(tips条目);
    }
    //这是了时间排序
    if (!tips条目.time) {
        tips条目.time = Date.now();
    }
    tips条目.scores.textScore = tips条目.textScore || 0;
    tips条目.scores.vectorScore = tips条目.vectorScore || 0;
    return tips条目;
}

