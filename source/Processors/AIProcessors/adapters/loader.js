import { Adapter as Zhipu } from "./zhipu/index.js"
import { Adapter as Qwen } from "./qwen/index.js"
import { Adapter as moonshot } from "./moonshotAI/index.js";
class ModelLoader {
    constructor() {
      this.modelMap = {};
      this.adapters = [];
    }
  
    // 注册适配器
    registerAdapter(adapter) {
      this.adapters.push(new adapter());
    }
  
    // 初始化所有适配器并加载模型
    init() {
      this.adapters.forEach(adapter => {
        let { models } = adapter.init();
        Object.keys(models).forEach(key => {
          models[key].forEach(modelInfo => {
            let { id } = modelInfo;
            let scopedId = adapter.nameSpace + '-' + id;
            this.modelMap[scopedId] = modelInfo;
          });
        });
      });
    }
  
    // 获取模型处理器
    getModelProcess(modelName) {
      if (this.modelMap[modelName]) {
        return this.modelMap[modelName];
      } else {
        throw new Error('未找到模型');
      }
    }
  
    // 列出所有模型
    listModels() {
      return JSON.parse(JSON.stringify(this.modelMap));
    }
  }
  
  const modelLoader = new ModelLoader();
  modelLoader.registerAdapter(Zhipu);
  modelLoader.registerAdapter(Qwen);
  modelLoader.registerAdapter(moonshot)
  modelLoader.init();
  
  export { modelLoader };