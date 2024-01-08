import { sac } from "../../../asyncModules.js";
let 已索引未入库队列 = []
let 正在添加 = false
export const 添加到入库队列 = (数据项) => {
    已索引未入库队列.push(数据项)
}
try {
    await sac.路由管理器.internalFetch('/database/collections/build', {
        method: 'POST',
        body: {
            collection_name: 'blocks',
            main_key: 'id',
            file_path_key: 'box',
        }
    })
} catch (e) {
    console.error(e)
}
async function 处理入库队列() {
    if (正在添加) {
        return
    }
    if (已索引未入库队列.length > 0) {
        正在添加 = true
        console.log(`当前入库队列长度为${已索引未入库队列.length}`)
        await 添加到块数据集(已索引未入库队列); // 将数据项添加到数据库
    }

}

async function 添加到块数据集(数据项) {
    try {
        await sac.路由管理器.internalFetch('/database/collections/build', {
            method: "POST",
            body: {
                collection_name: 'blocks',
                main_key: 'id',
                file_path_key: 'box',

            }
        }
        )
    } catch (e) {
        console.error(e)
    }
    sac.路由管理器.internalFetch(
        '/database/add', {
        method: "POST",
        body: {
            dataBase: 'public',
            collection_name: 'blocks',
            main_key: 'id',
            file_path_key: 'box',
            vectors: 已索引未入库队列
        }
    }
    ).then(
        res => {
            已索引未入库队列 = []
            正在添加 = false
        }
    )
}


// 使用requestIdleCallback在浏览器空闲时执行任务
function 开始处理入库队列() {
    requestIdleCallback(() => {
        处理入库队列();
        开始处理入库队列(); // 递归调用以持续处理队列
    });
}

// 初始化时开始处理队列
开始处理入库队列();