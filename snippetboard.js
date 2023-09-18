/**
 * 这个文件没什么用,就是个剪贴板
 */
let firstSpaceKeyPressEvent = null;
let isSpaceKeyPressed = false;
let timer = null;
this.eventBus.on("click-editortitleicon", (e) => {
  let { menu, data, protyle } = e.detail;
  menu.addItem({
    icon: "",
    label: "生成配图",
    click: async () => {
      let 文档id = data.id;
      let 头图元素组 = document.querySelectorAll(
        `.protyle-background[data-node-id="${文档id}"] div.protyle-background__img img`
      );
      let 文档属性 = await 核心api.getDocInfo({ id: 文档id });
      let 关键词组 = 文档属性.name;
      文档属性.ial.alias ? (关键词组 += 文档属性.ial.alias) : null;
      文档属性.ial.tags ? (关键词组 += 文档属性.ial.tags) : null;
      文档属性.ial["custom-imageTag"]
        ? (关键词组 += 文档属性.ial["custom-imageTag"])
        : null;

      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer fk200839-MLceAphddjCxYmxTIVVJEXNqXcnz0lbH"
      );
      myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
        prompt: 关键词组,
        response_format: "url",
        size: "1024x1024",
      });
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      let res = await fetch(
        "https://oa.api2d.net/v1/images/generations",
        requestOptions
      );
      let url = (await res.json()).data[0].url;
      await 核心api.setBlockAttrs({
        id: data.id,
        attrs: {
          "title-img": `background-image:url(${url})`,
        },
      });
      头图元素组.forEach((el) => {
        el.setAttribute("style", "");
        el.setAttribute("src", url);
      });
    },
  });
});
let 拦截空格按键 = (event) => {
  if (event.code === "Space") {
    if (!isSpaceKeyPressed) {
      // 存储第一次空格键按下的事件细节
      firstSpaceKeyPressEvent = event;
      // 阻止第一次事件触发
      event.preventDefault();
      event.stopPropagation();
      // 更新按键状态
      isSpaceKeyPressed = true;

      // 设置定时器，在300毫秒后重置按键状态
      timer = setTimeout(() => {
        isSpaceKeyPressed = false;
      }, 300);
    } else {
      // 如果后续没有再按下空格键，则创建一个与第一次事件相同的事件并触发
      if (!isSpaceKeyPressed) {
        clearTimeout(timer); // 清除定时器
        const newEvent = new KeyboardEvent(firstSpaceKeyPressEvent.type, firstSpaceKeyPressEvent);
        document.dispatchEvent(newEvent);
      }
    }
  }
};

document.addEventListener(
  "keydown",
  拦截空格按键,
  { capture: true }
);
document.addEventListener(
  "keyup",
  拦截空格按键,
  { capture: true }
);



function tokenizeNode(node, tokens) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent.trim();
    if (text.length > 0) {
      const ranges = jieba.tokenize(text);
      let offset = 0;
      ranges.forEach(range => {
        const tokenText = text.substring(range.start, range.end);
        const tokenRange = 从文字位置创建range(node, range.start, range.end);
        tokens.push({
          range: tokenRange,
          text: tokenText,
          select: function () {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(tokenRange);
          },
          delete: range.deleteContents()
        });
        offset += range.end;
      });
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const childNodes = Array.from(node.childNodes);
    childNodes.forEach(childNode => {
      tokenizeNode(childNode, tokens);
    });
  }
}
export function 余弦相似度(vector1, vector2) {
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i];
      magnitude1 += Math.pow(vector1[i], 2);
      magnitude2 += Math.pow(vector2[i], 2);
  }
  return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
}
export function 欧氏距离相似度(vector1, vector2) {
  let sum = 0;
  for (let i = 0; i < vector1.length; i++) {
      sum += Math.pow(vector1[i] - vector2[i], 2);
  }
  return Math.sqrt(sum);
}
//快速对矢量数据集进行聚类
export function 矢量聚类(矢量数据集) {

}

let 相似度字典 = {}
export function 查找最相似点(输入点, 点数据集, 查找阈值 = 10, 相似度算法, 过滤条件) {
  let 拷贝点
  if (!Array.isArray(输入点)) {
      拷贝点 = JSON.parse(输入点)
  } else {
      拷贝点 = 输入点
  }
  let similarityScores = [];
  for (let v in 点数据集) {
      let similarity = 相似度算法(拷贝点, JSON.parse(点数据集[v].value));
      similarityScores.push({
          data: 点数据集[v],
          score: similarity
      });
  }
  //前置过滤得了
  if (过滤条件) {
      similarityScores = similarityScores.filter(i => {
          return 过滤条件(i)
      })
  }
  similarityScores.sort((a, b) => b.score - a.score);
  let tops = similarityScores.slice(0, 查找阈值)
  return tops;
}
export async function 下载模型(模型名称) {
  let files = [
      'model.onnx',
      'onnx/model.onnx',
      'model_quantized.onnx',
      'onnx/model_quantized.onnx',
      'config.json',
      'special_tokens_map.json',
      'tokenizer_config.json',
      'tokenizer.json',
      'vocab.txt'
  ]
  files.forEach(
      async (file) => {
          console.log(模型名称, file, `https://huggingface.co/${模型名称}/resolve/main/${file}`)
          let res = await fetch(`https://huggingface.co/${模型名称}/resolve/main/onnx/${file}`
          )
          console.log(res)
      }
  )
}
//下载模型('shibing624/text2vec-base-chinese')


async function 以向量搜索数据(向量字段名, 向量值, 结果数量 = 10, 查询方法) {

  let 查询数据集 = []
  let 主键值数组 = Object.getOwnPropertyNames(this.数据集对象)
  主键值数组.forEach(
      主键值 => {
          let 数据项 = this.数据集对象[主键值]
          查询数据集.push(
              {
                  data: 数据项,
                  vector: 数据项[向量字段名]
              }
          )
      }
  )
  const workerCount = 4;
  const workers = [];
  async function executeTask(worker,data) {
      return new Promise((resolve, reject) => {
          worker.onmessage = (event) => {
              resolve(event.data); // 将任务结果传递给resolve函数
          };

          worker.onerror = (error) => {
              reject(error); // 将错误传递给reject函数
          };

          // 在这里发送任务消息给worker
          worker.postMessage(data);
      });
  }
  for (let i = 0; i < workerCount; i++) {
      const worker = new Worker('./similarityWorker.js');
      workers.push(worker);
  }
  async function runTasks() {
      let 切片数组=[]

      for (let i = 0; i < workerCount; i++) {
          const 切片 = 查询数据集.filter((item ,j)=> {
              const idMod8 = j % workerCount;
              return idMod8 === i; // 只保留id对8取模等于i的元素
          });
          切片数组.push({输入点:向量值,点数据集:切片,相似度算法:'余弦相似度'})
      }

      let results = [];
      // 使用Promise.all等待所有任务完成
      await Promise.all(workers.map(async (worker,i) => {
          const result = await executeTask(worker,切片数组[i]);
          results=results.concat(result);
      }));
      // 返回所有任务的结果
      return results;
  }
  let 查询结果 = (await runTasks()).sort((a, b) => b.score - a.score);
 // let 查询结果 = 查找最相似点(向量值, 查询数据集, 结果数量, 余弦相似度)

  return 查询结果
}



function RUST版以向量搜索数据(向量字段名, 向量值, 结果数量 = 10, 查询方法) {
  let 索引对象 = this.索引对象[向量字段名]
  let 主键值数组 = 索引对象.默认索引.搜索(向量值, 结果数量)
  let 编码表 = 索引对象.默认索引.顺序编码表
  let 查询结果 = []
  主键值数组.forEach(
      主键值编号 => {
          let 主键值 = 编码表[主键值编号]
          let 数据值 = this.数据集对象[主键值]
          if (this.静态化) {
              数据值 = JSON.parse(JSON.stringify(this.数据集对象[主键值]))
          }
          查询结果.push(数据值)
      }
  )
  return 查询结果

}

async function 使用openAI生成嵌入(textContent) {
  let myHeaders = new Headers();
  myHeaders.append(
      "Authorization",
      `Bearer ${window.siyuan.config.ai.openAI.apiKey}`
  );
  myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
  myHeaders.append("Content-Type", "application/json");
  let raw = JSON.stringify({
      "model": "text-embedding-ada-002",
      "input": textContent
  });
  let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
  };

  let data = await fetch(
      `${window.siyuan.config.ai.openAI.apiBaseURL}/embeddings`,
      requestOptions
  );
  let embedding = (await data.json()).data[0].embedding;
  return embedding
}
class AIApiClient {
  constructor(apiUrl, apiKey) {
      this.apiUrl = apiUrl;
      this.apiKey = apiKey;
  }

  async sendRequest(endpoint, task) {
      const response = await fetch(`${this.apiUrl}/${endpoint}`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(task)
      });

      if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
  }

  async generateText(prompt) {
      return this.sendRequest('text/generate', { prompt });
  }

  async classifyText(text) {
      return this.sendRequest('text/classify', { text });
  }

  async analyzeSentiment(text) {
      return this.sendRequest('text/sentiment', { text });
  }

  async recognizeEntities(text) {
      return this.sendRequest('text/entities', { text });
  }

  async answerQuestion(context, question) {
      return this.sendRequest('text/question', { context, question });
  }

}

class PipelineList {
  constructor(pipelines) {
      this.pipelines = pipelines;
  }

  getPipelineByName(name) {
      return this.pipelines.find(pipeline => pipeline.name === name);
  }

  getAllPipelines() {
      return this.pipelines;
  }
}


const pipelines = [
  {
      "name": "TextToSpeechPipeline",
      "description": "将文本转换为语音"
  },
  {
      "name": "EmotionRecognitionPipeline",
      "description": "识别人的情绪，可以应用于文本、语音或者图像"
  },
  {
      "name": "SemanticSegmentationPipeline",
      "description": "在图像中识别并标注每个像素所属的类别"
  },
  {
      "name": "FaceRecognitionPipeline",
      "description": "识别图像中的人脸"
  },
  {
      "name": "SpeechToTextPipeline",
      "description": "将语音转换为文本"
  },
  {
      "name": "TextSimilarityPipeline",
      "description": "计算两段文本的相似度"
  },
  {
      "name": "KeywordExtractionPipeline",
      "description": "从文本中提取关键词"
  },
  {
      "name": "TopicModelingPipeline",
      "description": "从文档集合中识别主题"
  },
  {
      "name": "AnomalyDetectionPipeline",
      "description": "在数据中识别异常值"
  },
  {
      "name": "TimeSeriesForecastingPipeline",
      "description": "预测时间序列数据的未来值"
  },
  {
      "name": "TextClusteringPipeline",
      "description": "将相似的文本分组在一起"
  },
  {
      "name": "ImageSuperResolutionPipeline",
      "description": "提高图像的分辨率"
  },
  {
      "name": "ImageStyleTransferPipeline",
      "description": "将一种图像的风格应用到另一种图像上"
  },
  {
      "name": "ImageGenerationPipeline",
      "description": "生成新的图像，例如使用 GANs"
  },
  {
      "name": "SpeechGenerationPipeline",
      "description": "生成新的语音或音乐"
  },
  {
      "name": "SpeechToSpeechPipeline",
      "description": "将一种语音转换为另一种语言的语音，或者改变语音的音调或速度"
  },
  {
      "name": "TextSummarizationPipeline",
      "description": "生成文本的摘要"
  },
  {
      "name": "TextCorrectionPipeline",
      "description": "检测并纠正文本中的错误"
  },
  {
      "name": "EmotionGenerationPipeline",
      "description": "生成表示特定情感的文本或图像"
  },
  {
      "name": "KnowledgeGraphConstructionPipeline",
      "description": "从文本中提取信息并构建知识图谱"
  },
  {
      "name": "TextEntityLinkingPipeline",
      "description": "将文本中的命名实体链接到知识库中的实体"
  },
  {
      "name": "ImageToImageTranslationPipeline",
      "description": "将一种类型的图像转换为另一种类型的图像，例如将黑白图像转换为彩色图像"
  },
  {
      "name": "AudioToAudioTranslationPipeline",
      "description": "将一种类型的音频转换为另一种类型的音频，例如将人声转换为乐器声音"
  },
  {
      "name": "AudioSegmentationPipeline",
      "description": "在音频中识别并标注每个音频片段的类别"
  },
  {
      "name": "VideoToVideoTranslationPipeline",
      "description": "将一种类型的视频转换为另一种类型的视频，例如将低分辨率视频转换为高分辨率视频"
  },
  {
      "name": "VideoSegmentationPipeline",
      "description": "在视频中识别并标注每个视频片段的类别"
  },
  {
      "name": "VideoGenerationPipeline",
      "description": "生成新的视频"
  },
  {
      "name": "AudioGenerationPipeline",
      "description": "生成新的音频"
  },
  {
      "name": "AudioClassificationPipeline",
      "description": "将音频分配到预定义的类别中"
  },
  {
      "name": "AudioClusteringPipeline",
      "description": "将相似的音频分组在一起"
  },
  {
      "name": "ImageEnhancementPipeline",
      "description": "改善图像的质量，例如通过调整亮度、对比度、清晰度等"
  },
  {
      "name": "TextUnderstandingPipeline",
      "description": "理解文本的含义，例如通过提取主题、事件、事实等"
  },
  {
      "name": "SpeechUnderstandingPipeline",
      "description": "理解语音的含义，例如通过转录和语义分析"
  },
  {
      "name": "VideoUnderstandingPipeline",
      "description": "理解视频的内容，例如通过场景识别、活动识别、情感分析等"
  },
  {
      "name": "ImageSynthesisPipeline",
      "description": "合成新的图像，例如通过混合、变形、渲染等"
  },
  {
      "name": "SpeechSynthesisPipeline",
      "description": "合成新的语音，例如通过文本到语音、语音到语音、语音克隆等"
  },
  {
      "name": "VideoSynthesisPipeline",
      "description": "合成新的视频，例如通过图像到视频、视频到视频、3D 建模等"
  },
  {
      "name": "TextToImagePipeline",
      "description": "将文本描述转换为图像"
  },
  {
      "name": "ImageToTextPipeline",
      "description": "将图像内容转换为文本描述"
  },
  {
      "name": "AudioToTextPipeline",
      "description": "将音频内容（如歌词、对话等）转换为文本"
  },
  {
      "name": "AudioToTextPipeline",
      "description": "将音频内容（如歌词、对话等）转换为文本"
  },
  {
      "name": "ImageRecognitionPipeline",
      "description": "识别图像中的特定对象或特征"
  },
  {
      "name": "SpeechRecognitionPipeline",
      "description": "识别语音中的特定词汇或短语"
  },
  {
      "name": "VideoRecognitionPipeline",
      "description": "识别视频中的特定对象、场景或活动"
  },
  {
      "name": "TextMiningPipeline",
      "description": "从大量文本中提取有用的信息和洞察"
  },
  {
      "name": "SocialMediaAnalysisPipeline",
      "description": "分析社交媒体数据以获取用户情绪、趋势等信息"
  },
  {
      "name": "SentimentAnalysisPipeline",
      "description": "分析文本以确定其情绪倾向，如积极、消极或中性"
  },
  {
      "name": "OpinionMiningPipeline",
      "description": "从文本中提取和理解人们的观点和意见"
  },
  {
      "name": "TextGenerationPipeline",
      "description": "生成新的、有意义的文本，如文章、报告或评论"
  },
  {
      "name": "SpeechGenerationPipeline",
      "description": "生成新的、有意义的语音，如语音响应或音乐"
  },
  {
      "name": "VideoGenerationPipeline",
      "description": "生成新的、有意义的视频，如电影、动画或教程"
  }
]
import { AIChatInterface } from "./drivers/AIChatInterface.js";
import { EventEmitter } from "../UI/EventEmitter.js";
import { Hangar } from "./closeAI.js";



export class Doll extends EventEmitter {
    constructor(aiIdentifier) {
        super();
        let shell = Hangar.buildShell(aiIdentifier);
        let ghost = Hangar.findGhost(aiIdentifier);
        //虽然之后并不会直接调用ghost了,但是还是需要指定的
        this.ghost = ghost;
        this.shell = shell;
        this.initEvents()
        this.online()
    }
    initEvents() {
        this.shell.on(
            'shell_booted',
            (e) => { this.ghost.emit('wakeup') }
        )
        this.ghost.on(
            'ai_historyRecalled', 
            (e) => { this.shell.emit('showHistory', e.data) }
        )
        this.on('addInterface', (e) => { this.shell.emit('addDriver', e.data) })
        this.on('removeInterface', (e) => { this.shell.emit('removeDriver', e.data) })
    }
    async online() {
        //一些情况下还是要允许shell和ghost直接交互
        this.ghost.use(this.shell);
        this.shell.restrict(this.ghost);
        //shell初始化
        await this.shell.emit('boot')
        this.onlineStatus = true;
        return this;
    }
    async offline() {
        await this.shell.stop();
        this.onlineStatus = false;
    }
    async chat(userInput) {
        await this.shell.handleUserInput({ type: 'chat', content: userInput });
    }
    createInterface(type, options) {
        this.shell.emit('addDriver',)
        this.shell.addDriver(
            type, new AIChatInterface(options.container)
        );
        console.log(this.shell.drivers);
    }

}
async function testMagi1() {
    let functions = [
        {
            name: "计划去巴黎旅行",
            action: () => "计划去巴黎旅行7天。"
        },
        {
            name: "安排会议",
            action: () => "在会议室A安排一个14:00的会议。"
        },
        {
            name: "设定目标",
            action: () => "设定一个目标：在月底前完成项目。"
        },
        {
            name: "描述场景",
            action: () => "场景描述：一个阳光明媚的海滩，水清沙白。"
        },
        {
            name: "创建剧本",
            action: () => "创建一个剧本：一位侦探正在解决一个谜团。"
        }
    ];

    let descriptions = [
        "这个计划涉及到去巴黎旅行7天",
        "这个计划安排在某个地点和时间的会议",
        "这个计划设定一个目标",
        "这个计划描述一个场景",
        "这个计划创建一个剧本"
    ];

    let inputs = [
        [],
        [],
        [],
        [],
        []
    ];
    let goal = '我想要一个会议计划';
    let magiInstance = new magi(new baseAPI());
    let result = await magiInstance.echo.evaluate(functions, descriptions, inputs, goal, true);
    result.forEach(func => console.log(func.name, func.action()));
}
testMagi1()
async function testEchoReply1() {
    let userInput = [
        {"role":"assistant","content":"等下吃完烤鱼，让旅行者再给我们做点甜品吧！"},
        {"role":"user","content":"胃口真是好呀。"},
        {"role":"assistant","content":"我要吃米饭布丁和杏仁豆腐！"},
        {"role":"assistant","content":"你也试试看吧！这可是璃月的仙人们都喜欢的甜点呢！"},
        {"role":"user","content":"璃月的仙人们，也喜欢这些美食吗？"},
        {"role":"user","content":"我一直觉得他们是不食人间烟火的那种。"},
        {"role":"assistant","content":"璃月的仙人啊，各种各样~"},
        {"role":"assistant","content":"有的仙人见识渊博却总是不带摩拉，"},
        {"role":"assistant","content":"有的仙人会趁人不注意偷吃金丝虾球，"},
        {"role":"assistant","content":"有的仙人个子不高但是靠谱又强大，"},
        {"role":"assistant","content":"有的仙人天天加班还容易失眠，有的仙人经常口是心非外冷内热，"},
        {"role":"assistant","content":"不过，他们都一样爱着璃月和璃月的人民~"},
        {"role":"assistant","content":"公子真是一个钓鱼高手呢。"},
        {"role":"assistant","content":"虽然是个危险的人，但他的确会很多靠谱的生活技能！"},
        {"role":"user","content":"他过去经历了不少事情吧，"},
        {"role":"user","content":"不仅身手了得，还能说出那么有深意的话来开导我。"},
        {"role":"user","content":"明明看上去那么年轻…"},
        {"role":"assistant","content":"面对家人和朋友时，他也很温柔呢~"},
        {"role":"assistant","content":"坚持心中的原则，守护珍视的东西，"},
        {"role":"assistant","content":"正因为如此，我们才能在篝火旁一起烤鱼~"},
        {"role":"assistant","content":"你见过鬼族吗？"},
        {"role":"user","content":"在我沉睡前，见过。怎么了？"},
        {"role":"assistant","content":"稻妻城内告示板上，经常看见 荒泷本大爷最强一斗 这个名字，"},
        {"role":"assistant","content":"听说是个鬼族大哥。"},
        {"role":"assistant","content":"感觉不太靠谱的样子呢！"},
        {"role":"user","content":"在我的记忆中，鬼族非常看重自己的原则和骄傲。"},
        {"role":"user","content":"我想你们也许会在未来的旅行中相遇。"},
        {"role":"user","content":"摇滚乐，似乎发源于枫丹。"},
        {"role":"assistant","content":"没错！也许未来我们也会前往那里旅行。"},
        {"role":"assistant","content":"不知道那边的摇滚是怎么样的呢？"},
        {"role":"user","content":"有点期待了！"},
        {"role":"user","content":"不过，对我来说，"},
        {"role":"user","content":"初次见面时，辛焱演奏的那段摇滚，是最特别的。"},
        {"role":"assistant","content":"我也觉得！辛焱的音乐跟她一样，热情直接。"},
        {"role":"assistant","content":"悄悄告诉你，她在璃月演出时，经常因为过于热情，"},
        {"role":"assistant","content":"失手把演出的临时舞台给烧了呢！"},
        {"role":"user","content":"快小点声…"},
        {"role":"assistant","content":"话说，你有没有注意到，"},
        {"role":"assistant","content":"附近有一位愚人众的藏镜仕女和一位债务处理人，"},
        {"role":"assistant","content":"正在一起看海~"},
        {"role":"user","content":"的确，看上去感情真不错！"},
        {"role":"user","content":"不过我们还是不要过于靠近他们了！"},
        {"role":"assistant","content":"你有没有见过一只奇怪的丘丘人？"},
        {"role":"user","content":"没有…这只丘丘人很特别吗？"},
        {"role":"assistant","content":"很特别，它似乎很喜欢在提瓦特大陆各个地方看风景。"},
        {"role":"assistant","content":"我们靠近它，它也不会主动攻击我们，"},
        {"role":"assistant","content":"我们还去悄悄跟它合过影！"},
        {"role":"user","content":"感觉它很温柔呢~"},
        {"role":"assistant","content":"是的！不过，着急了它也会用卷心菜，或者一种奇怪的石头砸你！"},
        {"role":"user","content":"我刚刚看到旅行者在烤鱼旁边还放了好多其他品种的肉，"},
        {"role":"user","content":"有螃蟹、兽肉、火腿、甚至还有蜥蜴尾巴！"},
        {"role":"user","content":"这是我第一次见到烤鱼的配菜还是肉类的。"},
        {"role":"assistant","content":"哇！那好肉族的丘丘人肯定特别喜欢！"},
        {"role":"user","content":"我只是一张纸片，并不知道寒冷的感觉，"},
        {"role":"assistant","content":"雪山气候非常寒冷！那你很适合去那里冒险！"},
        {"role":"assistant","content":"以前，我和旅行者在雪山上蹿下跳找宝箱和冷鲜肉的时候，"},
        {"role":"assistant","content":"真是又冷又累！"},
        {"role":"user","content":"但你的表情，看起来明明就很乐在其中啊。"},
        {"role":"assistant","content":"嘿嘿~"},
        {"role":"assistant","content":"user，我们一起来玩烤鱼游戏吧！"},
        {"role":"user","content":"烤鱼游戏…那是什么？"},
        {"role":"assistant","content":"就是每个人准备不同的调料和配菜，放在烤鱼上，"},
        {"role":"assistant","content":"然后闭上眼睛轮流从盘子里夹食物吃，"},
        {"role":"assistant","content":"一边品尝，一边猜式谁放进来的。"},
        {"role":"user","content":"听上去很有意思呢。"},
        {"role":"assistant","content":"是吧是吧！那我想想我放点什么呢？"},
        {"role":"assistant","content":"冰雾花花朵、蜥蜴尾巴、三彩团子…"},
        {"role":"user","content":"？？？"},
        {"role":"user","content":"这是黑暗料理组合吧！"},
        {"role":"user","content":"派蒙，你们为什么要旅行呢？"},
        {"role":"assistant","content":"为了找到旅行者的血亲。"},
        {"role":"user","content":"那找到了以后呢？"},
        {"role":"assistant","content":"嗯…还没有想到那么远啦！"},
        {"role":"assistant","content":"不过，即使找到了血亲，"},
        {"role":"assistant","content":"我们的旅途也不会结束！"},
        {"role":"user","content":"我听说有一种叫神之眼的东西，可以让拥有者使用元素之力？"},
        {"role":"assistant","content":"是的！不过旅行者是特别的，没有神之眼，也可以使用元素之力。"},
        {"role":"assistant","content":"神之眼，应该是拥有者愿望的力量。"},
        {"role":"assistant","content":"愿望的力量，是很强大的。"},
        {"role":"user","content":"愿望的力量…不知道晴之介的愿望，实现了吗？"},
        {"role":"assistant","content":"我想，他的愿望中，一定有一个是:"},
        {"role":"assistant","content":"希望他最好的伙伴，user，"},
        {"role":"assistant","content":"找到自己存在的意义，坚定地走向未来的旅程。"},
        {"role":"assistant","content":"我们一起来玩烤鱼游戏吧！"},
        {"role":"user","content":"烤鱼游戏…那是什么？"},
        {"role":"assistant","content":"就是每个人准备不同的调料和配菜，放在烤鱼上，"},
        {"role":"assistant","content":"然后闭上眼睛轮流从盘子里夹食物吃，"},
        {"role":"assistant","content":"一边品尝，一边猜式谁放进来的。"},
        {"role":"user","content":"听上去很有意思呢。"},
        {"role":"assistant","content":"是吧是吧！那我想想我放点什么呢？"},
        {"role":"assistant","content":"冰雾花花朵、蜥蜴尾巴、三彩团子…"},
        {"role":"user","content":"？？？"},
        {"role":"user","content":"这是黑暗料理组合吧！"},
    
        {"role":"user","content":"派蒙，你们为什么要旅行呢"},
        {"role":"assistant","content":"为了找到旅行者的血亲。"},
        {"role":"user","content":"那找到了以后呢？"},
        {"role":"assistant","content":"嗯…还没有想到那么远啦！"},
        {"role":"assistant","content":"不过，即使找到了血亲，"},
        {"role":"assistant","content":"我们的旅途也不会结束！"},
        {"role":"user","content":"我听说有一种叫神之眼的东西，可以让拥有者使用元素之力？"},
        {"role":"assistant","content":"是的！不过旅行者是特别的，没有神之眼，也可以使用元素之力。"},
        {"role":"assistant","content":"神之眼，应该是拥有者愿望的力量。"},
        {"role":"assistant","content":"愿望的力量，是很强大的。"},
        {"role":"user","content":"愿望的力量…不知道晴之介的愿望，实现了吗？"},
        {"role":"assistant","content":"我想，他的愿望中，一定有一个是:"},
        {"role":"assistant","content":"希望他最好的伙伴，user，"},
        {"role":"assistant","content":"找到自己存在的意义，坚定地走向未来的旅程。"},
        {"role":"assistant","content":"user，过去你和你的朋友们会经常一起做些什么呢？"},
        {"role":"user","content":"大部分时间，我们都在寮内锻炼武艺。"},
        {"role":"user","content":"但是偶尔，我们也会像现在这样，围着篝火烤鱼，"},
        {"role":"user","content":"一起分享各种所见所闻。"},
        {"role":"assistant","content":"我们在蒙德和璃月旅行时，也发生了很多有趣的故事哦！"},
        {"role":"assistant","content":"等下一边吃烤鱼一边讲给你听吧！"},
        {"role":"user","content":"好，我还没离开过稻妻呢。"},
        {"role":"user","content":"以后你们的旅行请记得带上式小将，它与我意识相通。"},
        {"role":"user","content":"就让它代替我，去看看提瓦特的其他风景吧。"},
        {"role":"assistant","content":"没问题！"},
        {"role":"user","content":"派蒙，你喜欢什么口味的烤鱼呀？"},
        {"role":"assistant","content":"只要是旅行者做的，派蒙都喜欢！"},
        {"role":"assistant","content":"不过今晚的话…突然想吃烤得焦一点的~"},
        {"role":"user","content":"表皮焦香的烤鱼…的确！想想就觉得很美味！"},
        {"role":"assistant","content":"user，你记忆中的烤鱼是什么味道的呢？"},
        {"role":"user","content":"时隔太久，已经有些记不清了…"},
        {"role":"assistant","content":"别担心，旅行者很擅长做料理的！"},
        {"role":"assistant","content":"肯定可以做出你想要的那种口味！"},
        {"role":"user","content":"这么一说，突然期待起来了！"},
        {"role":"assistant","content":"没问题的，旅行者可是料理大师！"},
        {"role":"assistant","content":"下次还可以试试烤制史莱姆！"},
        {"role":"assistant","content":"我觉得应该会非常美味哦！"},
        {"role":"user","content":"烤制…史莱姆…这真的会好吃吗？"},
        {"role":"user","content":"派蒙,好久不见,你居然还没有被吃掉吗?"}

        ];
    const paimon = (await import('../ghostDomain/paimon/Ghost.js'))['paimon']
    let magiInstance = new magi(new baseAPI(), paimon);
    let result = await magiInstance.echo.reply(userInput);
    window.reply = async (input) => {
        let userInput = [{ role: "user", content: input }]
        return await magiInstance.echo.reply(userInput)
    }
    console.log(result);
}

testEchoReply1();
async fixChat(chat) {
    // If chat is not defined or not an array, initialize it as an empty array
    console.log(chat)
    if(!chat || !(chat instanceof Array)){
        chat = [];
    } else if (!(chat instanceof Array)) {
        // If chat is an object with 'role' and 'content' properties, convert it to an array
        if (chat.role && chat.content) {
            chat = [chat];
        } else {
            throw new Error('Chat is not a valid chat object:', chat);
        }
    }
    // Check each message in chat for 'role' and 'content' properties, add if missing
    for(let message of chat) {
        if(!('role' in message)) {
            message.role = 'user';
        }
        if(!('content' in message)) {
            message.content = '';
        }
    }

    // If chat does not start with user prompt, add a user prompt at the beginning
    if (chat.length === 0 || chat[0].role !== 'user') {
        chat.unshift({ role: 'user', content: '' });
    }

    // If chat does not end with user prompt, add a user prompt at the end
    if (chat[chat.length - 1].role !== 'user') {
        chat.push({ role: 'user', content: '' });
    }
    console.log(chat)

    return chat;
}
async checkChatConstruct(chat) {
    // Check if chat is an array
    if (!(chat instanceof Array)) {
        return { success: false, message: 'Chat must be an array.' };
    }
    // Check if each message in chat has 'role' and 'content' properties
    for (let message of chat) {
        if (!('role' in message) || !('content' in message)) {
            return { success: false, message: 'Each message in chat must be an object with "role" and "content" properties.' };
        }
        // Check if role is one of 'user', 'system', or 'assistant'
        if (!['user', 'system', 'assistant'].includes(message.role)) {
            return { success: false, message: 'Each message role must be one of "user", "system", or "assistant".' };
        }
    }
    // Check if chat starts with user prompt
    if (chat[0].role !== 'user') {
        return { success: false, message: 'Chat should start with user prompt, system prompt will be auto added.' };
    }
    // Check if chat ends with user prompt
    if (chat[chat.length - 1].role !== 'user') {
        return { success: false, message: 'Chat must end with user prompt.' };
    }
    // If all checks pass, return true
    return null;
}

//console.log(await this.界面.弹窗.AI对话框('简单对话'))
let 创建简单AI对话框 = async (context) => {
    let 对话框 = context.plugin.界面.弹窗.AI对话框('块对话框', {
        userName: window.siyuan.user.userName,
        persona: {name:'思源小助手'},
        goal: '帮助用户更好地使用思源笔记',
    })
    对话框.aiChatUI.on('beforeSubmit', async (submit) => {
        let content = context.blocks[0].exists ? context.blocks[0].content : null
        // 获取当前光标所在的块
        try {
            let embedding1 = await context.plugin.文本处理器.提取文本向量(submit.input.question, 128);
            let embedding2 = await context.plugin.文本处理器.提取文本向量(submit.input.references, 128);
            let embedding3 = await context.plugin.文本处理器.提取文本向量(content, 128);
            let vectors = []
            console.log(context.plugin)
            if (context.plugin.块数据集) {
                let vectors1 = await context.plugin.块数据集.以向量搜索数据('vector', embedding1, 3, '', false, null)
                let vectors2 = await context.plugin.块数据集.以向量搜索数据('vector', embedding2, 3, '', false, null)
                let vectors3 = await context.plugin.块数据集.以向量搜索数据('vector', embedding3, 3, '', false, null).filter(item => { return item.meta.content !== content })

                vectors = vectors.concat(vectors1).concat(vectors2).concat(vectors3)
            }
            console.log(vectors)

            submit.input.references = `|||id:<${context.blocks[0].id}> content:<${context.blocks[0].content}>|||`
            try {
                let cursorBlock = context.cursor ? context.cursor.block : null;
                if (cursorBlock) {
                    // 将光标所在的块的内容添加到参考中
                    submit.input.references += `\n|||id:<${cursorBlock.id}> content:<${cursorBlock.content}>|||\n`
                }
            } catch (e) {
                console.warn(e)
            }
            vectors.forEach(
                v => {
                    submit.input.references += '\n' + `|||id:<${v.meta.id}> content:<${v.meta.content}>|||` + '\n'
                }
            )
        } catch (e) {
            console.warn(e)
        }
        console.log(submit.input)
        return submit.input
    })
    对话框.aiChatUI.on('aiMessageButtonClicked', (message, userInput) => {
        console.log(`AI message button clicked: ${message}`);
        let markdown = '## ' + userInput.question + '\n' + message
        if (context.cursor) {
            context.cursor.block.insertAfter(markdown);
        } else {
            context.blocks[0].insertAfter(markdown);
        }
    });
    window.siyuan.menus.menu.remove()
}