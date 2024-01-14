import crypto from '../../../static/crypto-browserify.js'
import { base64UrlEncode } from './base64.js';
export const genRandomSecret=()=>{
    const secret = crypto.randomBytes(64).toString('hex');
    return secret
};

export const createHmac = async (alg, key, msg) => {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const msgData = encoder.encode(msg);

    const cryptoKey = await window.crypto.subtle.importKey(
        'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );

    const signature = await window.crypto.subtle.sign(
        { name: 'HMAC', hash: 'SHA-256' }, cryptoKey, msgData
    );

    let base64Signature = base64UrlEncode(new Uint8Array(signature));
    return base64Signature;
};
