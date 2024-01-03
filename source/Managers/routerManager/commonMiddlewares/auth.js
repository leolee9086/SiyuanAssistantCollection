import jwt from '../../../../static/jsonwebtoken.js'
import { genRandomSecret } from '../../../utils/crypto/secret.js';
async function authMiddleware(ctx, next) {
    const token = ctx.headers['authorization'];
    if (!token) {
        ctx.throw(401, 'Authentication Error: No Token Provided');
    }
    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        ctx.state.user = decoded;
        await next();
    } catch (err) {
        ctx.throw(401, 'Authentication Error: Invalid Token');
    }
}

module.exports = authMiddleware;