class HNSWIndex {
    constructor(dimension, maxElements, m, efConstruction, mMax, efSearch, randomSeed, verbose) {
      this.dimension = dimension;
      this.maxElements = maxElements;
      this.m = m;
      this.efConstruction = efConstruction;
      this.mMax = mMax;
      this.efSearch = efSearch;
      this.randomSeed = randomSeed;
      this.verbose = verbose;
      this.init();
    }
  
    async init() {
      const horajs = await import('../../../static/horajs/index.js').then(module => module.default());
      horajs.init_env();
      this.index = horajs.HNSWIndexUsize.new(
        this.dimension,
        this.maxElements,
        this.m,
        this.efConstruction,
        this.mMax,
        this.efSearch,
        this.randomSeed,
        this.verbose
      );
      this.inited = true;
    }
  
    addItems(items) {
      items.forEach(item => {
        if (item.id !== undefined && item.vector !== undefined) {
          this.index.add(item.vector, item.id);
        } else {
          throw new Error('Item must have an id and a vector property');
        }
      });
    }
  
    buildIndex(space = "euclidean") {
      this.index.build(space);
    }
  
    search(feature, k) {
      return this.index.search(feature, k);
    }
    dump(){
        return this.index.dump()
    }
  }
  async function testHNSWIndex() {
    // 创建 HNSWIndex 实例
    const dimension = 128; // 假设每个向量的维度是 128
    const maxElements = 1000; // 假设最多可以添加 1000 个元素
    const m = 16; // HNSW 算法的参数
    const efConstruction = 200; // HNSW 算法的参数
    const mMax = 32; // HNSW 算法的参数
    const efSearch = 50; // HNSW 算法的参数
    const randomSeed = 42; // 随机种子
    const verbose = false; // 是否输出详细信息
    const hnswIndex = new HNSWIndex(dimension, maxElements, m, efConstruction, mMax, efSearch, randomSeed, verbose);
    await hnswIndex.init(); // 确保初始化完成
    // 添加数据项
    const items = [
      { id: "11112", vector: new Array(dimension).fill(0).map((_, i) => i) },
      { id: "11111", vector: new Array(dimension).fill(0).map((_, i) => (dimension - i)) },
      // ... 可以添加更多的数据项
    ];
  
    hnswIndex.addItems(items); // 添加数据项到索引
  
    // 构建索引
    hnswIndex.buildIndex();
  
    // 执行搜索
    const feature = new Array(dimension).fill(0).map((_, i) => i / 2); // 创建一个测试特征向量
    const k = 2; // 搜索最近的 k 个邻居
    const searchResults = hnswIndex.search(feature, k);
  
    console.log('Search results:', searchResults);
  }
  
  testHNSWIndex().catch(console.error);