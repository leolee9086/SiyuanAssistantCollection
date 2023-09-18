window.noobRegistryRoot = window.noobRegistryRoot || {};
class 注册表 {
  id;
  constructor(id) {
    this.id = id;
    //为了在多次引入时，避免各个注册表实例获取到的items不一样，所以这里把它们放置到全局变量中
    //这样来保证每个同类型的注册表最终操作的是同一个items
    if (window.noobRegistryRoot[this.id]) {
      this.items = window.noobRegistryRoot[this.id]["items"];
    } else {
      this.items = [];
      window.noobRegistryRoot[this.id] = { items: this.items };
    }
  }
  items = [];
  注册(value) {
    const 存在元素索引 = this.items.findIndex((item) => item.id === value.id);
    if (存在元素索引 >= 0) {
      // 如果元素已存在，则替换元素value
      this.items[存在元素索引] = value;
    } else {
      // 否则添加新元素
      this.items.push(value);
    }
  }
  regist = this.注册;
  注销(id) {
    const 要移除的索引 = this.items.findIndex((item) => item.id === id);
    if (要移除的索引 >= 0) {
      // 如果元素已存在，则将其移除
      this.items.splice(要移除的索引, 1);
    } else {
      console.warn(`元素${id}在 ${this} 中未注册`);
    }
  }
  unregist = this.注销;
  获取(id) {
    const 元素 = this.items.find((item) => {
      return item.id === id;
    });
    return 元素 ? 元素 : undefined;
  }
  get = this.获取;
  列出() {
    return this.items;
  }
  list = this.列出;
  过滤(过滤方法) {
    return this.items.filter((item, index) => {
      return 过滤方法(item, index);
    });
  }
  filter = this.过滤;
}
if (!window.noobRegistryRoot.initRegistry) {
  Object.defineProperty(window.noobRegistryRoot, "initRegistry", {
    value: (name) => {
      return new 注册表(name);
    },
  });
}
export default 注册表