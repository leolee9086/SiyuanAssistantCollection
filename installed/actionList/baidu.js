export default[
    {
        label:"百度搜索",
        hints: '搜索',
        matchMod: 'any',
        icon: "",
        tipRender:(context)=>{
            let searchUrl = `https://m.baidu.com/s?word=${encodeURIComponent(context.blocks[0].content)}`;
            let div = document.createElement('div')
            div.innerHTML = `<webview src="${searchUrl}" width="100%" height="300px"></webview>`
            return {element:div,markdown:""};
        }
    }
]