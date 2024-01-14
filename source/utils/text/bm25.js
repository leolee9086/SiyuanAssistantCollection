import { jieba } from "../tokenizer/jieba.js";

export class BM25 {
  constructor() {
    this.D = []; // 文档集合
    this.docLengths = []; // 文档长度集合
    this.avgdl = 0; // 文档平均长度
    this.N = 0; // 文档数量
    this.IDF = {}; // 逆文档频率
    this.k1 = 1.5;
    this.b = 0.75;
  }

  addDocument(doc, contentProperties) {
    let combinedContent = contentProperties.map(prop => doc[prop]).join(' ');
    const terms = jieba.cut(combinedContent);
    this.D.push({ terms: terms, id: doc.id });
    this.docLengths.push(terms.length);
    this.avgdl = this.docLengths.reduce((a, b) => a + b, 0) / this.D.length;
    this.N = this.D.length;

    const termSet = new Set(terms);
    termSet.forEach(term => {
      this.IDF[term] = this.IDF[term] || 0;
      this.IDF[term] += 1;
    });

    Object.keys(this.IDF).forEach(term => {
      this.IDF[term] = Math.log((this.N - this.IDF[term] + 0.5) / (this.IDF[term] + 0.5) + 1);
    });
  }

  calculateScore(docTerms, queryTerms) {
    const f = {};
    docTerms.forEach(term => {
      f[term] = (f[term] || 0) + 1;
    });

    let score = 0;
    queryTerms.forEach(term => {
      if (!this.IDF.hasOwnProperty(term)) return;
      const idf = this.IDF[term];
      const tf = f[term] || 0;
      const numerator = tf * (this.k1 + 1);
      const denominator = tf + this.k1 * (1 - this.b + this.b * docTerms.length / this.avgdl);
      score += idf * numerator / denominator;
    });

    return score;
  }

  query(query) {
    const queryTerms = jieba.cut(query);
    let scores = this.D.map(doc => ({
      score: this.calculateScore(doc.terms, queryTerms),
      id: doc.id
    }));

    // 找到最高分和最低分
    const maxScore = Math.max(...scores.map(s => s.score));
    const minScore = Math.min(...scores.map(s => s.score));

    // 如果所有分数都相同，则归一化没有意义
    if (maxScore === minScore) {
      scores = scores.map(s => ({ ...s, score: 1 }));
    } else {
      // 归一化分数
      scores = scores.map(s => ({
        ...s,
        score: (s.score - minScore) / (maxScore - minScore)
      }));
    }

    // 按归一化分数降序排序
    return scores.sort((a, b) => b.score - a.score);
  }
}
