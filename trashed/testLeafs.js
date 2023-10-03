
let TextLeaf = 'foo'
function isValidText(value) {
    // 检查值是否为字符串
    return typeof value === 'string';
}
let numberLeaf = 0
function isValidNumber(value) {
    // 检查值是否为数字
    return typeof value === 'number';
}
let colorLeaf = { $value: 'red', $type: 'color' }
function isValidColor(value) {
    // 检查值是否为一个对象，且包含$value和$type字段
    // 并且$type字段的值为'color'
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'color';
}
let selectLeaf1 = {
    "$value": ["option1", "option2"],
    "$type": "select",
    "$options": ["option1", "option2", "option3"]
}
let selectLeaf2 = {
    "$value": "option1",
    "$type": "select",
    "$options": ["option1", "option2", "option3"]
}
function isValidSelect(value) {
    // 检查值是否为一个对象，且包含$value、$type和$options字段
    // 并且$type字段的值为'select'，$options字段的值为数组
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'select' &&
        '$options' in value && Array.isArray(value.$options);
}
let dateLeaf = {
    "$value": "2022-01-01",
    "$type": "date"
};
function isValidDate(value) {
    // 检查值是否为一个对象，且包含$value和$type字段
    // 并且$type字段的值为'date'
    // 并且$value字段的值可以被Date.parse解析为有效的日期
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'date' &&
        !isNaN(Date.parse(value.$value));
}
let emailLeaf = {
    "$value": "example@example.com",
    "$type": "email"
};
function isValidEmail(value) {
    // 检查值是否为一个对象，且包含$value和$type字段
    // 并且$type字段的值为'email'
    // 并且$value字段的值满足电子邮件的正则表达式
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'email' &&
        emailRegex.test(value.$value);
}
let urlLeaf = {
    "$value": "https://example.com",
    "$type": "url"
};
function isValidUrl(value) {
    // 检查值是否为一个对象，且包含$value和$type字段
    // 并且$type字段的值为'url'
    // 并且$value字段的值可以被URL构造函数解析为有效的URL
    try {
        new URL(value.$value);
        return typeof value === 'object' && value !== null &&
            '$value' in value && '$type' in value && value.$type === 'url';
    } catch (_) {
        return false;
    }
}

let fileLeaf = {
    "$value": "path/to/file",
    "$type": "file"
};
function isValidFile(value) {
    // 检查值是否为一个对象，且包含$value和$type字段
    // 并且$type字段的值为'file'
    // 这里我们无法在JavaScript中检查文件路径是否有效，所以我们只检查结构
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'file';
}
let multiSelectLeaf = {
    "$value": ["option1", "option3"],
    "$type": "multi-select",
    "$options": ["option1", "option2", "option3"]
};
let singleSelectLeaf = {
    "$value": "option2",
    "$type": "select",
    "$options": ["option1", "option2", "option3"]
};
//除了多选器的情况,直接生成array节点是不被允许的
/*let arrayLeaf = {
    "$value": [1, 2, 3],
    "$type": "array"
};*/
//直接生成objectLeafs是不允许的
/*let objectLeaf = {
    "$value": {"key1": "value1", "key2": "value2"},
    "$type": "object"
};*/
let cssVarLeaf = {
    "$value": "#ff0000",
    "$type": "color"
};
let userValidationLeaf = {
    "$value": "username",
    "$type": "string",
    "$validator": "username_validation_function"
};
let shortcutLeaf = {
    "$value": "Ctrl+C",
    "$type": "string"
};
let avatarLeaf = {
    "$value": "path/to/avatar",
    "$type": "file"
};
let phoneLeaf = {
    "$value": "1234567890",
    "$type": "string",
    "$validator": "phone_validation_function"
};
let dateRangeLeaf = {
    "$value": ["2022-01-01", "2022-12-31"],
    "$type": "date-range"
};
let percentageLeaf = {
    "$value": 50,
    "$type": "percentage"
};
let timeLeaf = {
    "$value": "12:34:56",
    "$type": "time"
};
let numberRangeLeaf = {
    "$value": 50,
    "$type": "number",
    "range": "0:1000"
};
let numberRangeLeaf1 = {
    "$value": 50,
    "$type": "int",
    "range": "0:1000"
};
let locationLeaf = {
    "$value": "40.7128, 74.0060",
    "$type": "location"
};
let passwordLeaf = {
    "$value": "password",
    "$type": "password"
};
let zipCodeLeaf = {
    "$value": "10001",
    "$type": "string",
    "$validator": "zip_code_validation_function"
};
let countryLeaf = {
    "$value": "USA",
    "$type": "select",
    "$options": ["USA", "China", "India", "UK", "Germany"]
};
let regexTextLeaf = {
    "$value": "text",
    "$type": "string",
    "regex": "/^[a-zA-Z0-9]+$/"
};
function isValidRegexText(value) {
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'string' &&
        'regex' in value && typeof value.regex === 'string';
}

