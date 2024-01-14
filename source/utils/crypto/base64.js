export function base64UrlEncode(str) {
    let base64 = Buffer.from(str).toString('base64');
    return base64.replace('+', '-').replace('/', '_').replace(/=+$/, '');
}