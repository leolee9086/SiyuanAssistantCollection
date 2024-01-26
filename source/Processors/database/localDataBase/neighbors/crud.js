export function 创建邻接表(数据项, 邻接表领域, 类别列表) {
    数据项.neighbors = 数据项.neighbors || {};
    数据项.neighbors[邻接表领域] = 数据项.neighbors[邻接表领域] || [];

    let 领域邻接表 = 数据项.neighbors[邻接表领域];
    if (类别列表) {
        类别列表.forEach(类别名 => {
            // 查找是否已存在该类别的邻接表
            let 类别邻接表 = 领域邻接表.find(邻接表 => 邻接表.type === 类别名);
            // 如果不存在，则创建新的类别邻接表
            if (!类别邻接表) {
                领域邻接表.push({
                    type: 类别名,
                    items: [] // 初始化空的邻居列表
                    // 可以根据需要添加其他属性
                });
            }
        });
    }
}
// 删除邻居
export function 删除邻居(数据项, 邻接表领域, 类别名, 邻居) {
    let 领域邻接表 = 数据项.neighbors && 数据项.neighbors[邻接表领域];
    if (领域邻接表) {
        let 类别邻接表 = 领域邻接表.find(邻接表 => 邻接表.type === 类别名);
        if (类别邻接表) {
            类别邻接表.items = 类别邻接表.items.filter(item => item !== 邻居);
        }
    }
}
// 查询邻居
export function 查询邻居(数据项, 邻接表领域, 类别名) {
    let 领域邻接表 = 数据项.neighbors && 数据项.neighbors[邻接表领域];
    if (领域邻接表) {
        let 类别邻接表 = 领域邻接表.find(邻接表 => 邻接表.type === 类别名);
        return 类别邻接表 ;
    } 
}

// 校验邻居是否存在
export function 校验邻居是否存在(数据项, 邻接表领域, 类别名, 邻居) {
    let 领域邻接表 = 数据项.neighbors && 数据项.neighbors[邻接表领域];
    if (领域邻接表) {
        let 类别邻接表 = 领域邻接表.find(邻接表 => 邻接表.type === 类别名);
        return 类别邻接表 ? 类别邻接表.items.includes(邻居) : false;
    }
    return false;
}

// 更新邻居
export function 更新邻居(数据项, 邻接表领域, 类别名, 旧邻居, 新邻居) {
    let 领域邻接表 = 数据项.neighbors && 数据项.neighbors[邻接表领域];
    if (领域邻接表) {
        let 类别邻接表 = 领域邻接表.find(邻接表 => 邻接表.type === 类别名);
        if (类别邻接表) {
            let 邻居索引 = 类别邻接表.items.indexOf(旧邻居);
            if (邻居索引 !== -1) {
                类别邻接表.items[邻居索引] = 新邻居;
            }
        }
    }
}
