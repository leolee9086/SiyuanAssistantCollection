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