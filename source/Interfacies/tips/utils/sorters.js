// 比较时间差并进行归一化，以五秒钟为限制
export function 比较时间差并归一化(a, b) {
    const timeDifference = Math.abs(a.time - b.time) / 1000;
    const normalizedScore = timeDifference > 5 ? 0 : 1 - (timeDifference / 5);
    return normalizedScore;
}

// 比较 vectorScore
export function 比较VectorScore(a, b) {
    return b.vectorScore - a.vectorScore;
}

// 比较 textScore
export function 比较TextScore(a, b) {
    return b.textScore - a.textScore;
}
// 比较内容标记长度并进行归一化，以两者平均内容长度为限制
export function 比较内容标记长度并归一化(a, b) {
    let Amatch = a.content.match(/<mark>(.*?)<\/mark>|<span>(.*?)<\/span>/g);
    let Bmatch = b.content.match(/<mark>(.*?)<\/mark>|<span>(.*?)<\/span>/g);
    let aText = Amatch ? Amatch.join('') : '';
    let bText = Bmatch ? Bmatch.join('') : "";
    let averageLength = (aText.length + bText.length) / 2;
    let lengthDifference = Math.abs(aText.length - bText.length);
    const normalizedScore = lengthDifference > averageLength ? 0 : 1 - (lengthDifference / averageLength);
    return normalizedScore;
}

