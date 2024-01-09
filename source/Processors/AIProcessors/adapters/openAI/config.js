import { mixin } from "../../../../utils/object/mixin.js";
import { sac } from "../../../../asyncModules.js";
export const getOpenAISetting = (options, mixinOptions) => {
    let _options = {
        apiKey: "",
        apiTimeout: 60,
        apiProxy: "",
        apiModel: "",
        apiMaxTokens: 0,
        apiBaseURL: "",
        ...globalThis.siyuan.config.ai.openAI, // 使用 siyuan.config.ai.openAI 对象进行初始化
    }
    _options = mixin(
        _options,
        sac.configurer.get('模型设置', 'OPENAI').$value,
        options,
        mixinOptions //因为有些接口的设置跟文本补全接口不一样
    );
    return _options;
}