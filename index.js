const { Plugin } = require("siyuan");
const clientApi = require("siyuan");
/**
 * 这个必须同步声明
 */
let path
let plugin
let 依赖 = {}
class PluginConfigurer {
  constructor(plugin, prop, fileName, save) {
    this.plugin = plugin
    this.plugin[prop] = this.plugin[prop] || {}
    this.target = this.plugin[prop]
    this.fileName = fileName || `${prop.json}`
    this.prop = prop
    this.save = save
  }
  async reload() {
    let data = await this.plugin.loadData(`${this.fileName}.json`)
    try {
      递归合并(this.plugin[this.prop], data);
    } catch (e) {
      console.error(e)
    }
    await this.plugin.saveData(`${this.fileName || this.prop}.json`, this.plugin[this.prop])
  }
  async set(...args) {
    if (args.length < 2) {
      throw new Error('You must provide at least two arguments');
    }

    let value = args.pop();
    let path = args;

    let target = this.target;
    for (let i = 0; i < path.length - 1; i++) {
      target[path[i]] = target[path[i]] || {};
      target = target[path[i]];
    }

    target[path[path.length - 1]] = value;

    this.plugin.eventBus.emit(`${this.prop}Change`, { name: path.join('.'), value });

    if (this.save) {
      await this.plugin.saveData(`${this.fileName || this.prop}.json`, this.target);
    }
    return this;
  }
  get(...args) {
    let target = this.target;
    for (let i = 0; i < args.length; i++) {
      if (target[args[i]] === undefined) {
        const undefinedFunction = () => { return undefined };
        undefinedFunction.$value = undefined;
        return undefinedFunction;
      }
      target = target[args[i]];
    }
    const getterFunction = (nextArg) => this.get(...args, nextArg);
    getterFunction.$value = target;
    return getterFunction;
  }
  query(fields, base = '') {
    function generatePaths(obj, currentPath = '') {
      let paths = [];
      for (let key in obj) {
        let newPath = currentPath ? `${currentPath}.${key}` : key;
        if (Array.isArray(obj[key])) {
          for (let subKey of obj[key]) {
            paths.push(`${newPath}.${subKey}`);
          }
          if (obj[key].length === 0) {
            paths.push(newPath);
          }
        } else if (typeof obj[key] === 'object' && Object.keys(obj[key]).length !== 0) {
          paths = paths.concat(generatePaths(obj[key], newPath));
        } else {
          paths.push(newPath);
        }
      }
      return paths;
    }
    function recursiveQuery(path) {
      let fullPath = base ? `${base}.${path}` : path;
      let value = this.get(...(fullPath.split('.'))).$value;
      if (typeof value === 'object' && value !== null && !(value instanceof Array)) {
        return Object.keys(value).reduce((result, key) => {
          let subPath = `${path}.${key}`;
          let subValue = recursiveQuery.call(this, subPath);
          if (Array.isArray(subValue)) {
            result = result.concat(subValue);
          } else {
            result.push({ path: subPath, value: subValue });
          }
          return result;
        }, []);
      } else {
        return [{ path: fullPath, value: value }];
      }
    }

    let paths = generatePaths(fields);
    let data = paths.reduce((result, element) => {
      let subData = recursiveQuery.call(this, element);
      return result.concat(subData);
    }, []);
    data.forEach(obj => {
      if (obj.value === undefined) {
        obj.error = `属性路径${obj.path}不存在,请检查设置和查询参数`
      }
    });
    return data;
  }
  list() {
    return this.target
  }
}
class ccPlugin extends Plugin {
  初始化状态存储() {
    this.statusMonitor = new PluginConfigurer(this, 'status')
  }
  async 初始化设置() {
    this.configurer = new PluginConfigurer(this, 'setting', 'setting', true)
    await this.configurer.reload()
  }

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
        try {
          const module = await import(moduleURL);
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
class SiyuanAssistantCollection extends ccPlugin {
  onload() {
    plugin = this;
    //因为环境变量都是可以同步获取的
    this.初始化环境变量()
    this.初始化插件同步状态()
    //后面的部分还在整理
    this.初始化插件异步状态()
  }
  初始化插件同步状态() {
    this.初始化状态存储()
    this.唤起词数组 = []
    this.protyles = [];
    this.命令历史 = []
    this.依赖 = 依赖

    //设置可以由任意子模块以plugin.configurer.set的形式初始化,这里的只是默认设置.
    //@TODO:所有设置条目初始化时给出设置项UI渲染函数
    //之所以要求给出单独的渲染函数是为了在关键词唤起时能够任意地组合设置界面

    this.设置 = {
      日志设置: {
        aiChat: false,
        aiShell: false,
        dataSet: false,
        MAGI: false,
        event: false,
      },
      向量工具设置: {
        默认文本向量化模型: 'leolee9086/text2vec-base-chinese',
        最大句子长度: 496,
      },
      聊天工具设置: {
        默认AI: "paimon",
        决策级别: 0,
        //在超过这个长度之后,聊天将被总结
        默认聊天短期记忆: 7,
        自动给出参考: 1,
        自动发送当前文档: false,
        自动发送当前搜索结果: false,
        默认参考数量: 10,
        参考文字最大长度: 36,
        基础模型接口: 'OPENAI',
        模型设置: {
          讯飞星火: {
            appid: "",
            api_key: "",
            api_secret: "",
            Spark_url: "",
            domain: "",
          },
          RWKV: {
            apiBaseURL: "",
            apiKey: "",
            apiMaxTokens: 0,
            apiModel: "",
            apiProxy: "",
            apiTimeout: 60,
          },
          ChatGPT: {
            apiBaseURL: "",
            apiKey: "",
            apiMaxTokens: 0,
            apiModel: "",
            apiProxy: "",
            apiTimeout: 60,
          },
        }
      },
      块标动作设置: {
      },
      关键词动作设置: {
      }
    }
    this.setting = this.设置
    this.状态 = {

    }
    this.status = this.状态
    this.eventBus.on("loaded-protyle", (e) => {
      this.log(e)
      this.protyles.push(e.detail);
      this.protyles = Array.from(new Set(this.protyles));
      this.setLute ? this._lute = this.setLute({
        emojiSite: e.detail.options.hint.emojiPath,
        emojis: e.detail.options.hint.emoji,
        headingAnchor: false,
        listStyle: e.detail.options.preview.markdown.listStyle,
        paragraphBeginningSpace: e.detail.options.preview.markdown.paragraphBeginningSpace,
        sanitize: e.detail.options.preview.markdown.sanitize,
      }) : null;
    });
    this.创建顶栏按钮()
    this.创建AI侧栏容器()
    this.创建TIPS侧栏容器()
    this.创建aiTab容器()
  }
  创建顶栏按钮() {
    let topBarButton = this.addTopBar(
      {
        icon: 'iconSparkles',
        title: '打开对话框,右键打开设置',
        position: 'right',
      }
    )
    this.statusMonitor.set('UI', 'topBarButton', topBarButton)
  }
  创建TIPS侧栏容器() {
    const DOCK_TYPE = 'SAC_TIPS'
    let plugin = this
    this.addDock({
      config: {
        position: "LeftBottom",
        size: { width: 200, height: 0 },
        icon: "iconFace",
        title: "Custom Dock",
      },
      data: {
        text: "This is my custom dock"
      },
      type: DOCK_TYPE,
      init() {
        this.element.innerHTML = `
        <div class="fn__flex-1 fn__flex-column" style="max-height:100%">
        <div class="block__icons">
        <div class="block__logo">
            <svg>
                <use xlink:href="#iconFiles"></use>
            </svg>
            TIPS
        </div>
    </div>
    <div class="fn__flex-1" style="min-height: auto;transition: var(--b3-transition)">
    <div id="SAC-TIPS_pinned"  style="overflow:auto;max-height:30%"></div>
    <div id="SAC-TIPS" class='fn__flex-1' style="overflow:auto;max-height:100%"></div>
    </div>
    </div>
    <div class="fn__flex">
        `;
        plugin.statusMonitor.set('tipsConainer', 'main', this.element)
        plugin.eventBus.emit('tipsConainerInited')
      },
      destroy() {
        plugin.log("destroy dock:", DOCK_TYPE);
      }
    });
  }
  log(...args) {
    if (this.日志记录器) {
      this.日志记录器.default.pluginMainlog(...args)
    } else {
      console.log(...args)
    }
  }
  创建AI侧栏容器() {
    const DOCK_TYPE = 'SAC_CHAT'
    let plugin = this
    this.addDock({
      config: {
        position: "LeftBottom",
        size: { width: 200, height: 0 },
        icon: "iconSaving",
        title: "Custom Dock",
      },
      data: {
        text: "This is my custom dock"
      },
      type: DOCK_TYPE,
      init() {
        this.element.innerHTML = `<div id="ai-chat-interface" class='fn__flex-column' style="pointer-events: auto;overflow:hidden;max-height:100%"></div>`;
        plugin.statusMonitor.set('dockContainers', 'main', this.element)
        plugin.eventBus.emit('dockConainerInited', this.element)
      },
      destroy() {
        plugin.log("destroy dock:", DOCK_TYPE);
      }
    });
  }
  创建aiTab容器() {
    const DOCK_TYPE = 'SAC_CHAT'
    let plugin = this
    this.aiTabContainer = this.addTab({
      type: DOCK_TYPE,
      init() {
        plugin.log(this)
        this.element.innerHTML = `<div id="ai-chat-interface" class='fn__flex-column' style="pointer-events: auto;overflow:hidden;max-height:100%"></div>`;
        let tabs = plugin.statusMonitor.get('aiTabContainer', this.data.persona).value || []
        tabs.push(this)
        plugin.statusMonitor.set('aiTabContainer', this.data.persona, tabs)
        plugin.eventBus.emit('TabContainerInited', this)
        plugin.log(this)

      },
      destroy() {
        plugin.log("destroy tab:", DOCK_TYPE);
      }
    });
  }
  async 初始化插件异步状态() {
    await this.初始化设置()
    this.设置器 = this.configurer
    await this.暴露插件环境()
    await this.加载管理器()
    await this.加载子模块();
    await this.初始化依赖项();
    await this.设置Lute();
    path = this.utils.path
    fs = this.workspace
    await this.初始化关键词表();
    await this.blockIndex.开始索引()
  }
  async 暴露插件环境() {
    window[Symbol.for(`plugin_${this.name}`)] = this
    window[Symbol.for(`clientApi`)] = clientApi
    await this.从esm模块('./source/asyncModules.js').合并全部成员为只读属性()
  }
  async 加载管理器() {
    await this.从esm模块('./source/packageManager/index.js').合并子模块('包管理器')
    await this.包管理器.下载基础模型()
    await this.包管理器.解压依赖()
    await this.从esm模块('./source/eventsManager/index.js').合并子模块('事件管理器')
  }
  async 加载子模块() {
    await Promise.all([
      this.从esm模块('./source/utils/index.js').合并子模块(),
      this.从esm模块('./source/vectorStorage/blockIndex.js').合并子模块('块索引器'),
      this.从esm模块('./source/UI/index.js').合并子模块('界面'),
      //用于查询DOM
      this.从esm模块('./source/utils/DOMFinder.js').设置模块为只读属性('DOM查找器'),
      //用于处理选区相关
      this.从esm模块('./source/utils/rangeProcessor.js').设置模块为只读属性('选区处理器'),
      this.从esm模块('./source/utils/textProcessor.js').合并子模块('文本处理器'),
      this.从esm模块('./source/polyfills/kernelApi.js').合并成员为只读属性('default', { '别名': 'kernelApi' }),
      this.从esm模块('./source/polyfills/fs.js').合并成员为只读属性('default', { '别名': 'workspace' }),
      this.从esm模块('./source/utils/copyLute.js').合并成员为只读属性('setLute'),
      this.从esm模块('./source/actionList/index.js').合并子模块(),
      this.从esm模块('./source/logger/index.js').合并子模块('日志记录器')
    ]);
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
function 递归合并(target, source) {
  if (!source) {
    return
  }
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      if (Object.prototype.toString.call(source[key]) === '[object Object]') {
        // 如果当前属性是对象，则递归合并
        target[key] = target[key] || {};
        递归合并(target[key], source[key]);
      } else {
        // 否则，直接复制属性值
        target[key] = source[key];
      }
    }
  }
}
module.exports = SiyuanAssistantCollection;


