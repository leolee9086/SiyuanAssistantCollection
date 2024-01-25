class MaxHeap {
    constructor() {
      this.heap = [];
    }
  
    // 获取父节点的索引
    getParentIndex(i) {
      return Math.floor((i - 1) / 2);
    }
  
    // 获取左子节点的索引
    getLeftChildIndex(i) {
      return 2 * i + 1;
    }
  
    // 获取右子节点的索引
    getRightChildIndex(i) {
      return 2 * i + 2;
    }
  
    // 交换两个节点的值
    swap(i, j) {
      [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
  
    // 插入新值
    push(value) {
      this.heap.push(value);
      let index = this.heap.length - 1;
      let parent = this.getParentIndex(index);
  
      // 上浮操作，直到堆的条件满足
      while (index > 0 && this.heap[parent] < this.heap[index]) {
        this.swap(parent, index);
        index = parent;
        parent = this.getParentIndex(index);
      }
    }
  
    // 删除并返回最大值
    pop() {
      if (this.size() === 0) return null;
      if (this.size() === 1) return this.heap.pop();
  
      const max = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.heapify(0);
  
      return max;
    }
  
    // 堆化操作
    heapify(index) {
      let left = this.getLeftChildIndex(index);
      let right = this.getRightChildIndex(index);
      let largest = index;
  
      if (left < this.size() && this.heap[left] > this.heap[largest]) {
        largest = left;
      }
  
      if (right < this.size() && this.heap[right] > this.heap[largest]) {
        largest = right;
      }
  
      if (largest !== index) {
        this.swap(index, largest);
        this.heapify(largest);
      }
    }
  
    // 获取最大值
    peek() {
      return this.heap[0] || null;
    }
  
    // 获取堆的大小
    size() {
      return this.heap.length;
    }
  
    // 检查堆是否为空
    isEmpty() {
      return this.size() === 0;
    }
  }