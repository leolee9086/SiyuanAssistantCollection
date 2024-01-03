import crypto from '../../../../static/crypto-browserify.js'
export const genRandomSecret=()=>{
    const secret = crypto.randomBytes(64).toString('hex');
    return secret
}
