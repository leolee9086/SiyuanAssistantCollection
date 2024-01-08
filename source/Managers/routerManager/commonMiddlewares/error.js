import { 柯里化 } from "../../../utils/functionTools.js";
const error=(ctx,err)=>{
  console.error(error)
  ctx.body.error=err
}
export const useError = async (ctx, next) => {
  try {
    ctx.error = ctx.error||柯里化(error)
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    if (ctx.app) {
      ctx.app.emit('error', err, err.stack, ctx);
    } else {
      console.error('error', err, err.stack, ctx)
    }
  }
}
