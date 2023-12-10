const { Plugin } = require("siyuan");
const clientApi = require("siyuan");
/**
 * 这个必须同步声明
 */
let path
let plugin
let 依赖 = {}
function 获取文件名(moduleURL) {
  // 替换所有的 '\\' 为 '/'
  moduleURL = moduleURL.replace(/\\/g, '/');
  // 移除路径中的 '//'，除非它在 'http://' 或 'https://' 中
  moduleURL = moduleURL.replace(/([^:])\/\//g, '$1/');
  // 从路径中获取文件名
  let fileName = moduleURL.substring(moduleURL.lastIndexOf('/') + 1);
  // 如果文件名是 'index.js'，获取文件夹名
  if (fileName === 'index.js') {
    let parts = moduleURL.split('/');
    // 移除最后两个部分（'index.js' 和 文件夹名）
    parts.pop();
    // 添加文件夹名作为新的文件名
    fileName = parts.pop();
  } else {
    // 移除扩展名
    fileName = fileName.substring(0, fileName.lastIndexOf('.'));
  }
  return fileName;
}
class ccPlugin extends Plugin {
  初始化环境变量() {
    this.selfURL = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/plugins/${this.name}/`;
    this.dataPath = `/data/storage/petal/${this.name}`
    this.tempPath = `/temp/ccTemp/${this.name}/`
    this.publicPath = `/data/public`
    this.selfPath = `/data/plugins/${this.name}`
    if (window.require) {
      this.localPath = window.require('path').join(window.siyuan.config.system.workspaceDir, 'data', 'plugins', this.name)
    }
  }
  resolve(路径) {
    if (路径.startsWith('/') || 路径.startsWith('http://') || 路径.startsWith('https://')) {
      // 如果路径是绝对路径或者外部路径，直接返回原始值
      return 路径;
    } else {
      // 如果路径是相对路径，从this.selfURL开始解析
      return decodeURIComponent(new URL(路径, this.selfURL).toString());
    }
  }
  //这个是白魔法不是黑魔法
  从esm模块(moduleURL) {
    moduleURL = this.resolve(moduleURL)
    console.log(moduleURL)
    const 定义属性 = async (obj, name, value, options = {}) => {
      if (obj.hasOwnProperty(name)) {
        throw new Error(`属性${name}已经存在，不要覆盖它`);
      }
      const { 只读 = true, 别名 = name } = options;
      Object.defineProperty(obj, 别名, {
        value: value,
        writable: !只读,
        configurable: true
      });
    };
    return {
      合并子模块: async (name) => {
        console.log(name)

        try {
          const module = await import(moduleURL);
          console.log(module)
          let fileName = 获取文件名(moduleURL);
          await 定义属性(this, fileName, module);
          name ? await 定义属性(this, name, module) : null
        } catch (error) {
          console.error(`导入模块${moduleURL}失败:`, error);
          throw error;
        }
      },
      合并成员为只读属性: async (name, options) => {
        try {
          const value = (await import(moduleURL))[name];
          await 定义属性(this, name, value, options);
        } catch (error) {
          console.error(`导入模块${moduleURL}的属性${name}失败:`, error);
          throw error;
        }
      },
      合并全部成员为只读属性: async () => {
        try {
          const module = await import(moduleURL);
          for (let name in module) {
            await 定义属性(this, name, module[name]);
          }
        } catch (error) {
          console.error(`导入模块${moduleURL}失败:`, error);
          throw error;
        }
      },
      设置模块为只读属性: async (name, options) => {
        try {
          const module = await import(moduleURL);
          await 定义属性(this, name, module, options);
        } catch (error) {
          console.error(`导入模块${moduleURL}失败:`, error);
          throw error;
        }
      },
      获取依赖: async (name, options) => {
        try {
          if (!this.依赖) {
            this.依赖 = {};
          }
          const module = await import(moduleURL);
          await 定义属性(this.依赖, name, module, options);
        } catch (error) {
          console.error(`导入模块${moduleURL}失败:`, error);
          throw error;
        }
      },
      获取成员为依赖: async (name, options) => {
        try {
          if (!this.依赖) {
            this.依赖 = {};
          }
          const module = await import(moduleURL);
          await 定义属性(this.依赖, name, module[name], options);
        } catch (error) {
          console.error(`导入模块${moduleURL}失败:`, error);
          throw error;
        }
      },
      获取工具: async (name, options) => {
        try {
          if (!this.工具箱) {
            this.工具箱 = {};
          }
          const module = await import(moduleURL);
          await 定义属性(this.工具箱, name, module, options);
        } catch (error) {
          console.error(`导入模块${moduleURL}失败:`, error);
          throw error;
        }
      },
    }
  }
  设置别名(别名字典) {
    for (let 原名 in 别名字典) {
      let 别名列表 = 别名字典[原名];
      if (!Array.isArray(别名列表)) {
        别名列表 = [别名列表];
      }
      for (let 别名 of 别名列表) {
        if (this.hasOwnProperty(别名)) {
          throw new Error(`别名${别名}已经存在，不要覆盖它`);
        }
        Object.defineProperty(this, 别名, {
          get: () => this[原名],
          set: (value) => { this[原名] = value; },
          enumerable: true,
          configurable: true
        });
      }
    }
  }
}
//插件本身作为状态管理和存储管理
class SiyuanAssistantCollection extends ccPlugin {
  onload() {
    plugin = this;
    //因为环境变量都是可以同步获取的
    this.初始化环境变量()
    this.初始化插件同步状态()
    //后面的部分还在整理
    this.初始化插件异步状态()
  }
  //因为同步状态管理也有点多了所以我们重新require一下吧
  require(moduleName) {
    const moduleCache = {
      siyuan: siyuan,
      clientApi: clientApi,
      plugin: this,
    }
    const _require = (moduleName) => {
      return moduleCache[moduleName]
    }
    const exports = {}
    const module = {
      exports
    }
    const modulePath = moduleName
    let code = this.readInternal(modulePath)
    code = "(function anonymous(require, module, exports,__dirname){".concat(code, "\n return module.exports})\n//# sourceURL=").concat(modulePath, "\n")
    let _module = (window.eval(code))(_require, module, exports)
    moduleCache[modulePath] = _module
    return _module
  }
  readInternal(path) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `/plugins/${this.name}/${path}`, false); // false means synchronous
    xhr.send(null);
    return xhr.responseText
  }
  初始化插件同步状态() {
    this.读取基础设置()
    this._setting = this.设置
    this.defaultSettings = this.默认设置
    this.唤起词数组 = []
    this.protyles = [];
    this.命令历史 = []
    this.依赖 = 依赖
    this.状态 = {}
    this.status = this.状态

    //这里是加载一些基础功能
    this.require('./source/syncModule.js')
    //这里是创建UI容器,因为dock等需要同步创建
    //基础设置的读取是同步进行的
    this.require('./source/UIContainers.js')
  }
  读取基础设置() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `/plugins/${this.name}/defaultSetting.json`, false); // false means synchronous
    xhr.send(null);
    this.设置 = JSON.parse(xhr.responseText)
    this.默认设置 = JSON.parse(xhr.responseText)
    let xhr1 = new XMLHttpRequest();
    xhr1.open("GET", `/plugins/${this.name}/plugin.json`, false); // false means synchronous
    xhr1.send(null);
    this.meta = JSON.parse(xhr1.responseText)
  }
  async 初始化插件异步状态() {
    await this.configurer.reload()
    this.设置器 = this.configurer
    await this.暴露插件环境()
    await this.加载管理器()
    await this.加载子模块();
    //  await this.初始化依赖项();
    // await this.设置Lute();
    //  path = this.utils.path
    //  fs = this.workspace
    // await this.初始化关键词表();
    // await import(`${this.selfURL}/source/index.js`)
  }
  async 暴露插件环境() {
    window[Symbol.for(`plugin_${this.name}`)] = this
    window[Symbol.for(`clientApi`)] = clientApi
    await this.从esm模块('./source/asyncModules.js').合并全部成员为只读属性()
  }
  async 加载管理器() {
    //用于管理事件
    this.log('开始加载事件管理器')
    await this.从esm模块('./source/Managers/eventsManager/index.js').合并子模块('事件管理器')
    this.log('事件管理器加载完毕')
    //用于管理各种相关包的下载
    this.log('加载包管理器')
    await this.从esm模块('./source/Managers/packageManager/index.js').合并子模块('包管理器')
    this.log('包管理器加载完毕')
    //用于管理各种路由
    this.log('加载函数路由管理器')
    await this.从esm模块('./source/Managers/routerManager/index.js').合并子模块('路由管理器')
    this.log('函数路由管理器加载完毕')
    //console.log('开始加载搜索管理器')
    //await this.从esm模块('./source/searchers/index.js').设置模块为只读属性("搜索管理器")
    //console.log('搜索管理器加载完毕')
  }
  async 加载子模块() {
      await this.从esm模块('./source/tips/index.js').合并子模块('tips处理器')
    //await Promise.all([
   // await this.从esm模块('./source/utils/index.js').合并子模块(),
   // await this.从esm模块('./source/vectorStorage/blockIndex.js').合并子模块('块索引器')
    //用于查询DOM
  //  await this.从esm模块('./source/utils/DOMFinder.js').设置模块为只读属性('DOM查找器')
    //用于处理选区相关
   // await this.从esm模块('./source/utils/rangeProcessor.js').设置模块为只读属性('选区处理器')
  //  await this.从esm模块('./source/utils/textProcessor.js').合并子模块('文本处理器')
  //  await this.从esm模块('./source/polyfills/kernelApi.js').合并成员为只读属性('default', { '别名': 'kernelApi' })
   // await this.从esm模块('./source/polyfills/fs.js').合并成员为只读属性('default', { '别名': 'workspace' })
   // await this.从esm模块('./source/utils/copyLute.js').合并成员为只读属性('setLute')
  //  await this.从esm模块('./source/actionList/index.js').合并子模块()
   // await this.从esm模块('./source/logger/index.js').合并子模块('日志记录器')
    // ]);
  }
  log(...args) {
    if (this.日志记录器) {
      this.日志记录器.default.pluginMainlog(...args)
    } else {
      console.log(...args)
    }
  }
  async 初始化依赖项() {
    this.jieba = this.utils.jieba;
  }
  async 设置Lute() {
    this._lute = this.setLute({
      headingAnchor: false,
      listStyle: '',
      paragraphBeginningSpace: false,
      sanitize: '',
    });
  }
  get lute() {
    return this._lute
  }
  async 初始化关键词表() {
    await this.actionList.LoadAll()
  }
  //这里是用于块标菜单的渲染，
}
module.exports = SiyuanAssistantCollection;




