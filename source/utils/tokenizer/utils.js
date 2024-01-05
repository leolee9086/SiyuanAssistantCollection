
export function 校验是否包含(假定子词, 假定父词) {
    return 假定子词.start >= 假定父词.start && 假定子词.end <= 假定父词.end;
}
export function 校验分词是否连续(假定前词, 假定后词) {
    return 假定前词.end === 假定后词.start || 假定后词.end === 假定前词.start;
}
