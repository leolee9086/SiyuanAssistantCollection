let moduleCache = {}
onmessage = async (event) => {
    if (event.data !== 'close') {
        let moduleName = event.data.moduleName;
        if (!moduleCache[moduleName]){
            moduleCache[moduleName] = await import(moduleName)
        }
    } 
    if(event.data && event.data.任务名){
        let {任务数据, 任务名, 任务id, moduleName} = event.data
        if(任务名==='$prepare'){
            Object.assign(globalThis, 任务数据[0]);
            postMessage({处理结果: 'success', 任务id});
        }
        let 处理结果
        try{
            处理结果 = await 任务名.reduce((module, name) => module[name], moduleCache[moduleName])(...任务数据);        }catch(e){
            postMessage({错误:e.message || '未知错误',任务id})
            return
        }
        if(处理结果 && 处理结果.msg && 处理结果.msg=='错误'){
            postMessage({错误:处理结果.detail,任务id})
        }else{
            postMessage({处理结果:处理结果 || '无处理结果',任务id})
        }
    }else if(event.data=='close'){
        close()
    }else{
        postMessage({错误: '无效的请求'})
    }
}
onerror=async (error)=>{
    console.error({错误: error})
    postMessage({错误: error})
}
