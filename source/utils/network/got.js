let fix = {
    "http://www.93.gov.cnhttp://www.93.gov.cn:80": "http://www.93.gov.cn:80"
}
export const got = async (urlOptions, options = {}) => {
    let { url, method } = urlOptions
    !url ? url = urlOptions : null
    !method ? method = 'GET' : null
    options.method = method
    if (urlOptions.searchParams) {
        options.searchParams = urlOptions.searchParams
    }
    // Replace the beginning of the url if it matches any key in the fix object
    for (let key in fix) {
        if (url.startsWith(key)) {
            url = url.replace(new RegExp('^' + key), fix[key]);
            break;
        }
    }
    console.log(options)
    let body = {
        url: options.searchParams ? url + '?' + new URLSearchParams(options.searchParams) : url,
        method: options.method || 'GET',
        timeout: options.timeout || 102400,
        contentType: options.headers && options.headers['Content-Type'] || 'text/html',
        headers: options.headers || [{
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.76"
        }],
        payload: options.body,
        payloadEncoding: 'text',
        responseEncoding: 'text',
    }
    if (!body.headers['User-Agent']) {
        body.headers['User-Agent'] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.76";
    }
    if (options.form) {
        body.payload = new URLSearchParams(options.form).toString();
        body.contentType = 'application/x-www-form-urlencoded';
    }

    const response = await fetch('/api/network/forwardProxy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
       body: JSON.stringify(body),
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
got.get = (url, options) => got(url, options)
got.post = (url, options) => got({ url: url, method: "POST" }, options)
got.extend = (options = {}) => {
    const newGot = async (urlOptions, newOptions = {}) => {
        // Merge options
        const finalOptions = { ...options, ...newOptions };

        // Call the original got function with the merged options
        return got(urlOptions, finalOptions);
    };

    // Copy the properties from the original got function to the new one
    for (let prop in got) {
        if (got.hasOwnProperty(prop)) {
            newGot[prop] = got[prop];
        }
    }

    return newGot;
};