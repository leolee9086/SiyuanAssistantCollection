import { 将文本拆分为句子 } from "../../../../utils/sentence.js";
import { 计算加权平均向量 } from "../../../../utils/vector/normalization.js";
import * as transformers from '../../../../../static/transformers@2.5.3.js'
import { withPerformanceLogging } from "../../../../utils/functionAndClass/performanceRun.js";
import { vec2OpenAiEmbeddingResonseObject } from "../../utils/2openAI.js";
transformers.env.backends.onnx.wasm.wasmPaths = '/plugins/SiyuanAssistantCollection/static/';
transformers.env.allowRemoteModels = true;
transformers.env.localModelPath = '/public/onnxModels/';
let extractor
let 当前模型名称
export async function 准备管线(模型名称) {
    try {
        if (模型名称 !== 当前模型名称) {
            当前模型名称 = 模型名称

            extractor = await transformers.pipeline('feature-extraction', 模型名称, {
                quantized: true,
            });
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
        return { msg: '错误', detail: 'extractor没有初始化' };
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
            console.log(内容对象.content.length)
            let 单个结果 = await withPerformanceLogging(提取向量)(内容对象.content, 最大句子长度);
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