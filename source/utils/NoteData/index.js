export function 创建笔记本字典(全块数组) {
    let boxMap = new Map();
    for (let item of 全块数组) {
      const box = item.box;
      if (!boxMap.has(box)) {
        boxMap.set(box, []);
      }
      boxMap.get(box).push(item);
    }
    return boxMap;
}
