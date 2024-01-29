export class MinHeap {
    constructor(比较函数=(a,b)=>a-b,目标数组=[]) {
      this.比较函数= 比较函数
      if(Array.isArray(目标数组)){
        this.数据堆=目标数组
      }else{
        throw '只能堆化数组'
      }
      if(this.数据堆.length){
        this.堆化(0)
      }
    }
    获取父节点索引(i) { return Math.floor((i - 1) / 2); }
    获取左侧子节点索引(i) { return 2 * i + 1; }
    获取右侧子节点索引(i) { return 2 * i + 2; }
    交换节点(i, j) { [this.数据堆[i], this.数据堆[j]] = [this.数据堆[j], this.数据堆[i]]; }
    push(value){
      this.添加(value)
    }
    添加(value) {
      this.数据堆.push(value);
      
      let index = this.数据堆.length - 1;
      let parent = this.获取父节点索引(index);
      while (index > 0 &&this.比较函数(this.数据堆[parent],this.数据堆[index])>0) {
        this.交换节点(parent, index);
        index = parent;
        parent = this.获取父节点索引(index);
      }
    }
    batchPush(valueArray){
      this.批量插入(valueArray)
    }
    批量插入(值数组) {
      // 直接将所有元素添加到堆数组中
      this.数据堆 = this.数据堆.concat(值数组);
      // 从最后一个非叶子节点开始向上构造最小堆
      const 起始索引 = this.获取父节点索引(this.数据堆.length - 1);
      for (let i = 起始索引; i >= 0; i--) {
        this.堆化(i);
      }
    }
    pop(){
      return this.取出顶部元素()
    }
    取出顶部元素() {
      if (this.获取堆大小() === 0) return null;
      if (this.获取堆大小() === 1) return this.数据堆.pop();
      const 最小项 = this.数据堆[0];
      this.数据堆[0] = this.数据堆.pop();
      this.堆化(0);
      return 最小项;
    }
  
    堆化(目标索引) {
      let 左节点索引 = this.获取左侧子节点索引(目标索引);
      let 右节点索引 = this.获取右侧子节点索引(目标索引);
      let 最小节点索引 = 目标索引;
      if (左节点索引 < this.获取堆大小() && this.比较函数(this.数据堆[左节点索引],this.数据堆[最小节点索引])<0) {
        最小节点索引 = 左节点索引;
      }
      if (右节点索引 < this.获取堆大小() && this.比较函数(this.数据堆[右节点索引],this.数据堆[最小节点索引])<0) {
        最小节点索引 = 右节点索引;
      }
      if (最小节点索引 !== 目标索引) {
        this.交换节点(目标索引, 最小节点索引);
        this.堆化(最小节点索引);
      }
    }
    peek(){
      return this.查看顶部元素()
    }
    查看顶部元素() { return this.数据堆[0] || null; }
    size(){
      return this.获取堆大小()
    }
    map(...args){
      return this.数据堆.map(...args)
    }
    获取堆大小() { return this.数据堆.length; }
    isEmpty(){
      return this.是否空堆()
    }
    是否空堆() { return this.获取堆大小() === 0; }
    转化为数组(){return this.数据堆}
    toArray(){return this.数据堆}
  }

  export {MinHeap as 最小堆}