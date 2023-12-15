import _Router from "./router.js"
import { sac } from "../../asyncModules.js"
import configRouter from "./baseRouters/configRouter.js"
import { internalFetch } from "./internalFetch.js"
export const 根路由 = new _Router()

export const Router = _Router
根路由.use('/config',configRouter.routes('/'))

if(window.require){
    const App =(await import ("./webKoa/index.js")).default
    let app=new App()
    app.use(根路由.routes('/'))
    app.listen(80,(server)=>{
        console.log(server)
    })
}

console.log(await internalFetch('/config/query',{
    method:'POST',
    body:{
        query:['向量工具设置','默认文本向量化模型']
    }
}))