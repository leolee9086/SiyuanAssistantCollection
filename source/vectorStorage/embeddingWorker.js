let module
onmessage = async (event) => {
    if (event.data !== 'close') {
        if (!module){
            module = await import('/plugins/SiyuanAssistantCollection/source/vectorStorage/embedding.js')
        }
    } 
    if(event.data&&event.data.任务名){
        console.log(event.data)
        let {任务数据,任务名,任务id}=event.data
        let 处理结果
        try{
            处理结果 = await module[任务名](任务数据)
        }catch(e){
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
