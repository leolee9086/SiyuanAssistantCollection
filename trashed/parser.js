import * as typeHandlers from "./leafTypeHandlers.js"

let settings = {
    "appearance": {
        //单选,值为light
        "theme": ["light", "dark"],
        //颜色格式为rgb
        "cssVar$color>string$format=rgb":'255,255,0',
        //同上
        "cssVar":{
            $type:'color',
            $value:'255,255,0',
            $format:'rgb'
        },
        //文件选择器
        "avatar$file": "file"
    },
    "user": {
        //字符串
        "username": "username",
        //同上
        "password": {
            "$value": "password",
            "$type": "password"
        },
        //有范围的数字
        "age$number$range=[0,50]": 32,
        //同上
        "age":{
            value:32,
            min:0,
            max:50
        },
        //任意的数字
        "age":32,
        //邮箱
        "email$email": "example@example.com",
        //字符串
        "phone": "1234567890",
        //地理位置
        "home$loaction": [40.7128, 74.0060],
        "preferences": {
            //单选
            "language": ["English", "Chinese", "Spanish", "French", "German"],
            //多选,第1项和第三项是选中值
            "timezone$multi$string[0,3]": ["GMT", "EST", "PST", "CST", "IST", "$ref@@appearance.theme"],
            //两个布尔值
            "notifications": {
                "emailNotifications": true,
                "smsNotifications": false,
            }
        }
    },
    "shortcuts": {
        //引用值
        "copy$ref": "user.username", // 引用 username 的值
        "paste": "string"
    }
};
function parseSettings(settings, rootSettings = settings, path = '') {
    let parsedSettings = [];

    for (let key in settings) {
        let value = settings[key];
        let newPath = path ? `${path}.${key}` : key;

        if (isLeaf(value)) {
            // 如果是叶子节点，调用 parseLeaf 进行解析
            parsedSettings.push(parseLeaf(newPath, value, rootSettings));
        } else {
            // 如果不是叶子节点，递归地解析这个对象
            parsedSettings = parsedSettings.concat(parseSettings(value, rootSettings, newPath));
        }
    }
    return parsedSettings;
}


//符合条件的节点将会作为设置树的叶子节点看待
function isLeaf(value) {
    // 检查值的类型
    let type = typeof value;
    // 如果值不是一个对象，那么它是一个叶子节点
    if (type !== 'object') {
        return true;
    }
    // 如果值是 null，那么它是一个叶子节点
    if (value === null) {
        return true;
    }
    // 如果值是一个对象，并且它的任何键以 `$` 开头，那么它是一个叶子节点
    if (Object.keys(value).some(k => k.startsWith('$'))) {
        return true;
    }
    // 如果值是一个数组，并且它的每个元素都是字符串、数字或布尔值，或者是一个以 `$ref` 开头的字符串，那么它是一个叶子节点
    if (Array.isArray(value) && value.every(v => ['string', 'number', 'boolean'].includes(typeof v) || (typeof v === 'string' && v.startsWith('$ref')))) {
        return true;
    }
    // 如果没有满足以上任何条件，那么值不是一个叶子节点
    return false;
}
function parseLeaf(path, rawValue, rootSettings) {
    let type = typeof rawValue;

    if (path.includes('$')) {
        return handlePathIncludesDollar(path, rawValue, rootSettings);
    } else if (Array.isArray(rawValue) && rawValue.every(v => ['string', 'number', 'boolean'].includes(typeof v) || (typeof v === 'string' && v.startsWith('$ref')))) {
        return handleArray(rawValue, path, rootSettings);
    } else {
        switch (type) {
            case 'string':
            case 'number':
            case 'boolean':
                return handleBasicType(type,rawValue, path, rootSettings);
            default:
                return handleBasicType('default',rawValue, path, rootSettings);
        }
    }
}
function handlePathIncludesDollar(path, rawValue, rootSettings) {
    let [realKey, valueType, ...details] = path.split('$');
    return {
        path: realKey,
        target: rootSettings,
        type: valueType,
        detail: { ...rawValue },
        value:rawValue.$value
    };
}

function handleArray(rawValue, path, rootSettings) {
    return {
        path: path,
        target: rootSettings,
        type: 'single',
        detail: { options: rawValue },
        value:rawValue[0]
    };
}

function handleBasicType(type,rawValue ,path, rootSettings) {
    return {
        path: path,
        target: rootSettings,
        type: type,
        detail: {},
        value:rawValue
    };
}



function getHandler(leafType) {
    // 检查是否存在对应的处理器
    if (typeHandlers.hasOwnProperty(leafType)) {
        // 如果存在，返回对应的处理器
        return typeHandlers[leafType].handler;
    } else {
        // 如果不存在，返回默认处理器
        return typeHandlers['default'].handler;
    }
}
let parsedSettings = parseSettings(settings);
