/**
 * 根据类型获取搜索器
 * @param {string} 搜索器类型 - 搜索器的类型
 * @returns {Object} 返回搜索器对象
 */
export const 以类型获取搜索器 = (搜索器类型) => {
    return 搜索器注册表.get(搜索器类型)
}

/**
 * 模糊获取搜索器
 * @param {string} query - 搜索的文本
 * @param {string} 搜索器类型 - 搜索器的类型
 * @returns {Object} 返回搜索器对象
 */
export const 模糊获取搜索器 = (query, 搜索器类型) => {
   
}