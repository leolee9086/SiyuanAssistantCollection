import { 智能防抖, 柯里化, 逆序柯里化 } from "../../utils/functionTools.js";
import { 处理并显示tips } from "./UI/render.js";
import { sac } from "./runtime.js";
import { 最小堆 } from "../../utils/Array/minHeap.js";
import { 加载渲染器类 } from "./package/loader.js";
let 触发条件表 = [
    {
        name: 'renderEditorTips',
        assert: (renderInstance, 编辑器上下文) => { return 编辑器上下文 && !编辑器上下文.vector },
    },
    {
        name: "renderEditorVectorTips",
        assert: (renderInstance, 编辑器上下文) => { return 编辑器上下文.vector }
    }
]
let 任务执行状况表 = new Map()
// 创建任务队列的函数
// 创建任务队列的函数
const 任务优先队列 = new 最小堆((a, b) => {
    // 获取任务状态
    const 任务A状态 = 任务执行状况表.get(a.来源) || {};
    const 任务B状态 = 任务执行状况表.get(b.来源) || {};

    // 计算优先级
    const 优先级A = (任务A状态.错误 ? -1000 : 0) + (任务A状态.结束时间 - 任务A状态.开始时间) - a.添加时间;
    const 优先级B = (任务B状态.错误 ? -1000 : 0) + (任务B状态.结束时间 - 任务B状态.开始时间) - b.添加时间;

    return 优先级A - 优先级B;
});
export async function 创建任务队列(编辑器上下文, renderInstancies, signal) {
    const { position, text, tokens, blockID, editableElement, logger, currentToken } = 编辑器上下文;

    for await (let renderInstance of renderInstancies) {
        //renderInstancies.forEach(renderInstance => {
        const 添加时间 = Date.now();
        if (renderInstance.realTime) {
            try {
                const tipsRenderPackages = sac.statusMonitor.get('packages', 'sac-tips-render').$value
                renderInstance = await 加载渲染器实例(tipsRenderPackages, renderInstance.name)
            } catch (e) {
                sac.logger.tipsError(`标记了实时属性的tips渲染器${renderInstance.name}无法完成重载`)
            }
        }
        const renderInstanceName = renderInstance.name;
        const 任务 = {
            添加时间,
            执行: () => {
                if (signal.aborted) {
                    return
                }
                requestIdleCallback(() => 执行任务(renderInstance, 编辑器上下文))
            },
            来源: renderInstanceName,
            编辑器上下文,
            类型: "编辑器tips"
        };
        // 检查堆顶任务的来源，如果来源重复则对新任务进行减分
        const 堆顶任务 = 任务优先队列.peek();
        if (堆顶任务 && 堆顶任务.来源 === 任务.来源) {
            任务.添加时间 += 1000; // 这里的1000是减分值，你可以根据需要调整
        }

        任务优先队列.push(任务); // 将任务添加到优先队列中
    }
    return 任务优先队列;
}


// 任务执行函数
export async function 执行任务(renderInstance, 编辑器上下文) {
    const 显示tips = 逆序柯里化(处理并显示tips)(renderInstance)(编辑器上下文);
    const 开始时间 = Date.now(); // 记录任务开始时间
    try {
        const 生成器名称 = await 检查触发条件(renderInstance, 编辑器上下文);
        if (生成器名称) {
            try {
                const 防抖生成tips = 智能防抖(renderInstance[生成器名称].bind(renderInstance));
                const data = await 防抖生成tips(编辑器上下文);
                const 结束时间 = Date.now(); // 记录tips生成时间
                //const data = withPerformanceLogging(renderInstance[生成器名称].bind(renderInstance))(编辑器上下文)
                if (data) {
                    data.source = renderInstance.name;
                    await 显示tips(data);
                    任务执行状况表.set(renderInstance.name, { 生成器名称, 开始时间, 结束时间, 显示时间: Date.now() }); // 记录显示时间并写入执行状况表，包含生成器名称
                }
            } catch (e) {
                sac.logger.tipsWarn(renderInstance.name, e);
                任务执行状况表.set(renderInstance.name, { 生成器名称, 开始时间, 错误: e }); // 记录错误信息，包含生成器名称
            }
        }
    } catch (e) {
        sac.logger.tipsWarn(renderInstance.name, e);
        任务执行状况表.set(renderInstance.name, { 开始时间, 错误: e }); // 记录错误信息
    }
}




// 将函数拆分为两个部分：触发条件检查和任务执行
// 触发条件检查函数
export async function 检查触发条件(renderInstance, 编辑器上下文) {
    for (const 触发条件 of 触发条件表) {
        const { name, assert } = 触发条件;
        const conditionMet = await assert(renderInstance, 编辑器上下文);
        if (renderInstance[name] && conditionMet) {
            return name; // 返回满足条件的触发条件名称
        }
    }
    return null; // 如果没有条件满足，返回null
}

