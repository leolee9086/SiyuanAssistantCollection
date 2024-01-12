import { jieba } from "../tokenizer/jieba.js";
let D = []; // 文档集合
let docLengths = []; // 文档长度集合
let avgdl = 0; // 文档平均长度
let N = 0; // 文档数量
let IDF = {}; // 逆文档频率
const k1 = 1.5;
const b = 0.75;

function addDocument(doc) {
  const terms = jieba.cut(doc);
  D.push(terms);
  docLengths.push(terms.length);
  avgdl = docLengths.reduce((a, b) => a + b, 0) / D.length;
  N = D.length;

  // 更新IDF值
  const termSet = new Set(terms);
  termSet.forEach(term => {
    IDF[term] = IDF[term] || 0;
    IDF[term] += 1;
  });

  Object.keys(IDF).forEach(term => {
    IDF[term] = Math.log((N - IDF[term] + 0.5) / (IDF[term] + 0.5) + 1);
  });
}

function calculateScore(docTerms, queryTerms) {
  const f = {};
  docTerms.forEach(term => {
    f[term] = (f[term] || 0) + 1;
  });

  let score = 0;
  queryTerms.forEach(term => {
    if (!IDF.hasOwnProperty(term)) return;
    const idf = IDF[term];
    const tf = f[term] || 0;
    const numerator = tf * (k1 + 1);
    const denominator = tf + k1 * (1 - b + b * docTerms.length / avgdl);
    score += idf * numerator / denominator;
  });

  return score;
}

function query(query) {
  const queryTerms = jieba.cut(query);
  const scores = D.map((docTerms, index) => ({
    score: calculateScore(docTerms, queryTerms),
    index: index
  }));

  return scores.sort((a, b) => b.score - a.score);
}
