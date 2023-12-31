import _Router from "./router.js"
import configRouter from "./baseRouters/configRouter.js"
import { buildInternalFetch } from "./internalFetch.js"
import { useError } from "./commonMiddlewares/error.js"
export const 根路由 = new _Router()
export const internalFetch=buildInternalFetch(根路由)
export const Router = _Router
根路由.use(useError)

根路由.use('/config',configRouter.routes('/'))
if(window.require){
    const App =(await import ("./webKoa/index.js")).default
    let app=new App()
    app.use(根路由.routes('/'))
    app.listen(80,(server)=>{
        console.log(server)
    })
}
