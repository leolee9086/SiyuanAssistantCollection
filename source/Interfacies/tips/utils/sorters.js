// 比较时间差
export function 比较时间差(a, b) {
    return (Math.abs(a.time - b.time) / 1000)-1;
}

// 比较 vectorScore
export function 比较VectorScore(a, b) {
    return b.vectorScore - a.vectorScore;
}

// 比较 textScore
export function 比较TextScore(a, b) {
    return b.textScore - a.textScore;
}

// 比较内容标记长度
export function 比较内容标记长度(a, b) {
    let Amatch = a.content.match(/<mark>(.*?)<\/mark>|<span>(.*?)<\/span>/g);
    let Bmatch = b.content.match(/<mark>(.*?)<\/mark>|<span>(.*?)<\/span>/g);
    let aText = Amatch ? Amatch.join('') : '';
    let bText = Bmatch ? Bmatch.join('') : "";
    return bText.length - aText.length;
}
