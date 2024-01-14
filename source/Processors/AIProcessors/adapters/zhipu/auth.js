import { createHmac } from "../../../../utils/crypto/secret.js";
import { base64UrlEncode } from "../../../../utils/crypto/base64.js";
export const generateToken=async(api_key)=> {
    try {
        const [id, secret] = api_key.split(".");
        const header = {
            "alg": "HS256",
            "sign_type": "SIGN"
        };

        const payload = {
            "api_key": id,
            "exp": Math.floor(Date.now()) + 60 * 1000,
            "timestamp": Math.floor(Date.now()),
        };

        const tokenData = base64UrlEncode(JSON.stringify(header)) + '.' + base64UrlEncode(JSON.stringify(payload));
        const signature = await createHmac('HS256', secret, tokenData);
        return tokenData + '.' + signature;
    } catch (e) {
        throw new Error("Invalid API key: " + e.message);
    }
}



