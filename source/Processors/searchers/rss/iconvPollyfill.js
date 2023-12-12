function _decode(str, charset, timeout=1000) {
    var script = document.createElement('script');
    var id = Lute.NewNodeID(); // 生成唯一ID，防止冲突
    script.id = '_urlDecodeFn_' + id;
    var result = null;
    var done = false;
    window['_urlDecodeFn_' + id] = function(decodedStr) {
        result = decodedStr;
        done = true;
    };
    var src = 'data:text/javascript;charset=' + charset + (',_urlDecodeFn_' + id + '("') + str + '");';
    src += 'document.getElementById("_urlDecodeFn_' + id + '").parentNode.removeChild(document.getElementById("_urlDecodeFn_' + id + '"));';
    script.src = src;
    document.body.appendChild(script);

    var start = Date.now();
    // 阻塞轮询，直到回调函数被调用或超时
    while (!done && Date.now() - start < timeout) {
        // 空循环
    }

    // 移除全局函数
    delete window['_urlDecodeFn_' + id];

    if (!done) {
        throw new Error('Decoding operation timed out.');
    }

    return result;
}
function decodeBuffer(buffer, charset, timeout=1000) {
    var str = buffer.toString();
    return _decode(str, charset, timeout);
}
function decode(input, charset, timeout=1000) {
    if (typeof input === 'string') {
        return _decode(input, charset, timeout);
    } else{
        try{
            return decodeBuffer(input, charset, timeout);

        }catch(e){
            throw new Error('Input must be a string or a Buffer.');

        }
    }
}
export default {
    decode
}