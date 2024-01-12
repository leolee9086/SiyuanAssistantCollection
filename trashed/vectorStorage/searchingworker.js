let dataBase 
onmessage=async(event) => {
    let data = event.data
    if(data&&data.msg=='init'){
        dataBase=new((await import('./dataBase.js'))['default'])('/temp/vectorStorage')
        postMessage({msg:'ready'})

    } 
    if(data.aciton==='build'){
        dataBase.创建数据集(data.data.数据集名称,data.data.主键名)
    }
    if(data.action==='query'){
        console.log(searcher.query(...data.data))
    }
}
