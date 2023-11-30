export const got = async (url, options = {}) => {
    const response = await fetch('/api/network/forwardProxy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
             url: options.searchParams ? url + '?' + new URLSearchParams(options.searchParams) : url,
            method: options.method || 'GET',
            timeout: options.timeout || 7000,
            contentType: options.headers && options.headers['Content-Type'] || 'text/html',
            headers: options.headers || [{
                "User-Agent"
                    :
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.76"
            }],
            payload: options.body,
            payloadEncoding: 'text',
            responseEncoding: 'text',
        }),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.code !== 0) {
        throw new Error(`Server error! msg: ${data.msg}`);
    }

    let res = {
        body: data.data.body,
        headers: data.data.headers,
        statusCode: data.data.status
    };
    try {
        res.data = JSON.parse(res.body);
    } catch (e) {
        res.data = res.body;
    }
    res.status = res.statusCode;
    return res
};
got.all = (list) => Promise.all(list);