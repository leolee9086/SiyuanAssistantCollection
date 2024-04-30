export class 事件注册表原型 {
    constructor() {
        this.事件列表 = new Map();
    }
    // 添加事件
    添加事件({ 事件名, 描述, 是否允许AI触发,参数模式 }) {
        if(是否允许AI触发&&!参数模式){
            throw new Error('允许AI触发的事件必须提供参数')
        }
        if(是否允许AI触发&&!描述){
            throw new Error('允许AI触发的事件必须提供事件描述')
        }
        this.事件列表.set(事件名, { 描述, 是否允许AI触发,参数模式 });
    }

    // 删除事件
    删除事件({ 事件名 }) {
        this.事件列表.delete(事件名);
    }

    // 查找事件
    查找事件({ 事件名 }) {
        return this.事件列表.get(事件名);
    }
    // 更新事件
    更新事件({ 事件名, 描述, 是否允许AI触发,参数模式 }) {
        if (!this.事件列表.has(事件名)) {
            throw new Error(`事件 ${事件名} 不存在.`);
        }
        this.添加事件( {事件名, 描述, 是否允许AI触发,参数模式 });
    }
}
let 插件事件注册表 = new 事件注册表原型()
插件事件注册表.添加事件({
    事件名: 'open-menu-blockref',
    描述: '块引用右键菜单打开事件',
    是否允许AI触发: false,
});

插件事件注册表.添加事件({
    事件名: 'open-menu-breadcrumbmore',
    描述: '面包屑更多菜单打开事件',
    是否允许AI触发: false,
});

插件事件注册表.添加事件({
    事件名: 'open-menu-content',
    描述: '文本划选右键菜单打开事件',
    是否允许AI触发: false,
});

插件事件注册表.添加事件({
    事件名: 'open-menu-fileannotationref',
    描述: '附件引用右键菜单打开事件',
    是否允许AI触发: false,
});

插件事件注册表.添加事件({
    事件名: 'open-menu-image',
    描述: '图片菜单打开事件',
    是否允许AI触发: false,
});

插件事件注册表.添加事件({
    事件名: 'open-menu-link',
    描述: '超链接右键菜单打开事件',
    是否允许AI触发: false,
});

插件事件注册表.添加事件({
    事件名: 'open-menu-tag',
    描述: '标签右键菜单打开事件',
    是否允许AI触发: false,
});

插件事件注册表.添加事件({
    事件名: 'open-noneditableblock',
    描述: '文本编辑框打开事件',
    是否允许AI触发: false,
});

插件事件注册表.添加事件({
    事件名: 'open-siyuan-url-block',
    描述: '打开思源超链接 siyuan://blocks/ 事件',
    是否允许AI触发: false,
});

插件事件注册表.添加事件({
    事件名: 'open-siyuan-url-plugin',
    描述: '打开思源超链接 siyuan://plugins/ 事件',
    是否允许AI触发: false,
});

插件事件注册表.添加事件({
    事件名: 'ws-main',
    描述: '编辑事件 & 其他消息事件',
    是否允许AI触发: false,
});



export { 插件事件注册表 as 事件注册表 }