import { 将文本拆分为句子 } from "../../../../utils/text/sentence.js";
import { 计算加权平均向量 } from "../../../../utils/vector/normalization.js";
import * as transformers from '../../../../../static/transformers@2.5.3.js'
import { withPerformanceLogging } from "../../../../utils/functionAndClass/performanceRun.js";
import { vec2OpenAiEmbeddingResonseObject } from "../../utils/2openAI.js";
transformers.env.backends.onnx.wasm.wasmPaths = '/plugins/SiyuanAssistantCollection/static/';
transformers.env.allowRemoteModels = true;
transformers.env.localModelPath = '/public/onnxModels/';
let extractor
let 当前模型名称
let isExtractorReady
let taskQueue = []
function processTaskQueue(){
    while (taskQueue.length > 0 && isExtractorReady) {
        const task = taskQueue.shift();
        task();
      }
}
export async function 准备管线(模型名称) {
    try {
        if (模型名称 !== 当前模型名称) {
            当前模型名称 = 模型名称

            extractor = await transformers.pipeline('feature-extraction', 模型名称, {
                quantized: true,
            });
            isExtractorReady=true
            processTaskQueue(); // 处理队列中的任务

            return {}
        }else{
            return {}
        }
    } catch (e) {
        return { msg: '错误', detail: 'extractor未能成功初始化:' + e };
    }
}
export async function 提取向量(text, 最大句子长度) {
    if (!extractor) {
        return new Promise((resolve, reject) => {
            // 将任务放入队列
            taskQueue.push(async () => {
              try {
                resolve(await 提取向量(text, 最大句子长度));
              } catch (e) {
                reject({ msg: '错误', detail: e.message });
              }
            });
          });
      
    }
    let 句子组 = 将文本拆分为句子(text, 最大句子长度);
    let 句子长度比例组 = 句子组.map(句子 => 句子.length / text.length);
    try {
        let 句子向量组 = [];
        for (let 句子 of 句子组) {
            if (句子) {
                let output = await extractor(句子, { pooling: 'mean', normalize: true });
                句子向量组.push(Array.from(output.data));
            }
        }
        if (句子向量组.length > 0) {
            let result = {
                data: [vec2OpenAiEmbeddingResonseObject(计算加权平均向量(句子向量组, 句子长度比例组),0)]
            };

            return result
        } else {
            return [];
        }
    } catch (e) {
        console.error(e);
        return { msg: '错误', detail: e.message };
    }
}

export async function 批量提取向量(文本数组, 最大句子长度) {
    let 批量结果 = [];
    for (let 内容对象 of 文本数组) {
        try {
            let 单个结果 = await 提取向量(内容对象.content, 最大句子长度);
            if(单个结果){
             批量结果.push({id:内容对象.id,data:单个结果.data});
            }else{
             批量结果.push({id:内容对象.id,msg:"错误",detail:'索引器返回了空向量'})   
            }
        } catch (e) {
            console.error(e);
            批量结果.push({id:内容对象.id, msg: '错误', detail: e.message });
        }
    }
    return 批量结果;
}