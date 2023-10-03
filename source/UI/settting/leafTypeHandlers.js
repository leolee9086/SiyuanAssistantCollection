export const ref = {
    validator: (value, params) => {
        // 校验器：检查引用的路径是否存在
        return value.split('.').every(part => part.trim() !== '');
    },
    uiGenerator: (value, params) => {
        // UI生成器：生成一个显示引用值的元素
        return `<span>${value}</span>`;
    },
    handler: (value, rootSettings, params) => {
        let refPath = value.split('.');
        return refPath.reduce((obj, pathPart) => obj[pathPart], rootSettings);
    }
}


export const multi = {
    validator: (value, params) => {
        // 校验器：检查参数是否是两个数字
        return params.length === 2 && params.every(Number.isFinite);
    },
    uiGenerator: (value, params) => {
        // UI生成器：生成一个多选框
        return `<select multiple>${value.map(option => `<option>${option}</option>`).join('')}</select>`;
    },
    handler: (value, rootSettings, params) => {
        return { type: 'multi', value: value.slice(Number(params[0]), Number(params[1]) + 1) };
    }
}

export default {
    validator: () => true,  // 默认类型，总是有效
    uiGenerator: (value) => `<span>${value}</span>`,  // 默认UI，只是一个显示值的元素
    handler: (value) => value
}
