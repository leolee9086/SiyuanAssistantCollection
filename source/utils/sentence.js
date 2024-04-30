export function 将文本拆分为句子(文字内容, 最大句子长度) {
    const 句子分隔符 = /[。！？；;]/g;
    const 短句分隔符 = /[，、]/g;
    const 段落组 = 文字内容.split('\n');
    const 句子数组 = [];
    for (let 段落 of 段落组) {
        if (段落.length > 最大句子长度) {
            const 句子段落 = 段落.split(句子分隔符);
            for (let 句子 of 句子段落) {
                if (句子.length > 最大句子长度) {
                    const 短句数组 = 句子.split(短句分隔符);
                    for (let 短句 of 短句数组) {
                        if (短句.length > 最大句子长度) {
                            短句 = 短句.substring(0, 最大句子长度);
                        }
                        句子数组.push(短句);
                    }
                } else {
                    句子数组.push(句子);
                }
            }
        } else {
            句子数组.push(段落);
        }
    }
    return 句子数组.filter(句子 => 句子.trim() !== '');
}