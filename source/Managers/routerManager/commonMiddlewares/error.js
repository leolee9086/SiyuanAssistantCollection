import { 柯里化 } from "../../../utils/functionTools.js";
const error = (ctx, err) => {
  console.error(err)
  ctx.body.error = err
}
export const useError = async (ctx, next) => {
  try {
    ctx.error = ctx.error || 柯里化(error)(ctx)
    try {
      await next();
    } catch (e) {
      console.error(e)
    }
  } catch (err) {
    console.error(err)
    ctx.status = err.status || 500;
    ctx.body = err.message;
    if (ctx.app) {
      ctx.app.emit('error', err, err.stack, ctx);
    } else {
      console.error('error', err, err.stack, ctx)
    }
  }
}
