import Router from "../router.js";
import { sac } from "../../../asyncModules.js";
import { fs } from "../../../polyfills/fs.js"
import { genRandomSecret } from "../../../utils/crypto/secret.js";
let adminRouter = new Router()

// 获取配置信息
adminRouter.post('/secret', async (ctx, next) => {
    let usage =ctx.body.usage
    if(ctx.state.user.role!=='admin'){
        ctx.body = {
            success: false,
            message: error.message
        };
    }else{
        let secretPath = `${sac.dataPath}/secrets/${usage}`
        try {
            if(await fs.exists(secretPath)){
                const secret= await fs.readFile(secretPath)
                ctx.body = {
                    success: true,
                    secret: secret
                };    
            }else{
                const secret= await genRandomSecret()
                await fs.writeFile(secretPath,secret)
                ctx.body = {
                    success: true,
                    secret: secret
                }
            }
        } catch (error) {
            ctx.body = {
                success: false,
                message: error.message
            };
        }
    
    }
})

// 设置配置信息
adminRouter.post('/set', (ctx, next) => {
    // 设置配置信息逻辑
})

// 用户管理
adminRouter.post('/user', (ctx, next) => {
    // 用户管理逻辑
    // 检查用户角色，根据角色提供不同的访问权限
})

// 角色管理
adminRouter.post('/role', (ctx, next) => {
    // 角色管理逻辑
    // 检查用户角色，根据角色提供不同的访问权限
})

// 权限管理
adminRouter.post('/permission', (ctx, next) => {
    // 权限管理逻辑
    // 检查用户角色，根据角色提供不同的访问权限
})

export default adminRouter;