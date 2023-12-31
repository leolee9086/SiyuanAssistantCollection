import { plugin } from "../runtime.js"
//这个可以用来修改设置界面的提醒
plugin.statusMonitor.set('settingDescribe','动作设置.关键词动作设置.blockStyle_js','用来设置块的背景色和文字颜色,颜色来自中国传统配色')

/**
 * 中文颜色对照表
 * 就非常简单粗暴
 */
let 颜色对照表 =
[
    {
        "name": "乳白",
        "hex": "#f9f4dc"
    },
    {
        "name": "杏仁黄",
        "hex": "#f7e8aa"
    },
    {
        "name": "茉莉黄",
        "hex": "#f8df72"
    },
    {
        "name": "麦秆黄",
        "hex": "#f8df70"
    },
    {
        "name": "油菜花黄",
        "hex": "#fbda41"
    },
    {
        "name": "佛手黄",
        "hex": "#fed71a"
    },
    {
        "name": "篾黄",
        "hex": "#f7de98"
    },
    {
        "name": "葵扇黄",
        "hex": "#f8d86a"
    },
    {
        "name": "柠檬黄",
        "hex": "#fcd337"
    },
    {
        "name": "金瓜黄",
        "hex": "#fcd217"
    },
    {
        "name": "藤黄",
        "hex": "#ffd111"
    },
    {
        "name": "酪黄",
        "hex": "#f6dead"
    },
    {
        "name": "香水玫瑰黄",
        "hex": "#f7da94"
    },
    {
        "name": "淡密黄",
        "hex": "#f9d367"
    },
    {
        "name": "大豆黄",
        "hex": "#fbcd31"
    },
    {
        "name": "素馨黄",
        "hex": "#fccb16"
    },
    {
        "name": "向日葵黄",
        "hex": "#fecc11"
    },
    {
        "name": "雅梨黄",
        "hex": "#fbc82f"
    },
    {
        "name": "黄连黄",
        "hex": "#fcc515"
    },
    {
        "name": "金盏黄",
        "hex": "#fcc307"
    },
    {
        "name": "蛋壳黄",
        "hex": "#f8c387"
    },
    {
        "name": "肉色",
        "hex": "#f7c173"
    },
    {
        "name": "鹅掌黄",
        "hex": "#fbb929"
    },
    {
        "name": "鸡蛋黄",
        "hex": "#fbb612"
    },
    {
        "name": "鼬黄",
        "hex": "#fcb70a"
    },
    {
        "name": "榴萼黄",
        "hex": "#f9a633"
    },
    {
        "name": "淡橘橙",
        "hex": "#fba414"
    },
    {
        "name": "枇杷黄",
        "hex": "#fca106"
    },
    {
        "name": "橙皮黄",
        "hex": "#fca104"
    },
    {
        "name": "北瓜黄",
        "hex": "#fc8c23"
    },
    {
        "name": "杏黄",
        "hex": "#f28e16"
    },
    {
        "name": "雄黄",
        "hex": "#ff9900"
    },
    {
        "name": "万寿菊黄",
        "hex": "#fb8b05"
    },
    {
        "name": "菊蕾白",
        "hex": "#e9ddb6"
    },
    {
        "name": "秋葵黄",
        "hex": "#eed045"
    },
    {
        "name": "硫华黄",
        "hex": "#f2ce2b"
    },
    {
        "name": "柚黄",
        "hex": "#f1ca17"
    },
    {
        "name": "芒果黄",
        "hex": "#ddc871"
    },
    {
        "name": "蒿黄",
        "hex": "#dfc243"
    },
    {
        "name": "姜黄",
        "hex": "#e2c027"
    },
    {
        "name": "香蕉黄",
        "hex": "#e4bf11"
    },
    {
        "name": "草黄",
        "hex": "#d2b42c"
    },
    {
        "name": "新禾绿",
        "hex": "#d2b116"
    },
    {
        "name": "月灰",
        "hex": "#b7ae8f"
    },
    {
        "name": "淡灰绿",
        "hex": "#ad9e5f"
    },
    {
        "name": "草灰绿",
        "hex": "#8e804b"
    },
    {
        "name": "苔绿",
        "hex": "#887322"
    },
    {
        "name": "碧螺春绿",
        "hex": "#867018"
    },
    {
        "name": "燕羽灰",
        "hex": "#685e48"
    },
    {
        "name": "蟹壳灰",
        "hex": "#695e45"
    },
    {
        "name": "潭水绿",
        "hex": "#645822"
    },
    {
        "name": "橄榄绿",
        "hex": "#5e5314"
    },
    {
        "name": "蚌肉白",
        "hex": "#f9f1db"
    },
    {
        "name": "豆汁黄",
        "hex": "#f8e8c1"
    },
    {
        "name": "淡茧黄",
        "hex": "#f9d770"
    },
    {
        "name": "乳鸭黄",
        "hex": "#ffc90c"
    },
    {
        "name": "荔肉白",
        "hex": "#f2e6ce"
    },
    {
        "name": "象牙黄",
        "hex": "#f0d695"
    },
    {
        "name": "炒米黄",
        "hex": "#f4ce69"
    },
    {
        "name": "鹦鹉冠黄",
        "hex": "#f6c430"
    },
    {
        "name": "木瓜黄",
        "hex": "#f9c116"
    },
    {
        "name": "浅烙黄",
        "hex": "#f9bd10"
    },
    {
        "name": "莲子白",
        "hex": "#e5d3aa"
    },
    {
        "name": "谷黄",
        "hex": "#e8b004"
    },
    {
        "name": "栀子黄",
        "hex": "#ebb10d"
    },
    {
        "name": "芥黄",
        "hex": "#d9a40e"
    },
    {
        "name": "银鼠灰",
        "hex": "#b5aa90"
    },
    {
        "name": "尘灰",
        "hex": "#b6a476"
    },
    {
        "name": "枯绿",
        "hex": "#b78d12"
    },
    {
        "name": "鲛青",
        "hex": "#87723e"
    },
    {
        "name": "粽叶绿",
        "hex": "#876818"
    },
    {
        "name": "灰绿",
        "hex": "#8a6913"
    },
    {
        "name": "鹤灰",
        "hex": "#4a4035"
    },
    {
        "name": "淡松烟",
        "hex": "#4d4030"
    },
    {
        "name": "暗海水绿",
        "hex": "#584717"
    },
    {
        "name": "棕榈绿",
        "hex": "#5b4913"
    },
    {
        "name": "米色",
        "hex": "#f9e9cd"
    },
    {
        "name": "淡肉色",
        "hex": "#f8e0b0"
    },
    {
        "name": "麦芽糖黄",
        "hex": "#f9d27d"
    },
    {
        "name": "琥珀黄",
        "hex": "#feba07"
    },
    {
        "name": "甘草黄",
        "hex": "#f3bf4c"
    },
    {
        "name": "初熟杏黄",
        "hex": "#f8bc31"
    },
    {
        "name": "浅驼色",
        "hex": "#e2c17c"
    },
    {
        "name": "沙石黄",
        "hex": "#e5b751"
    },
    {
        "name": "虎皮黄",
        "hex": "#eaad1a"
    },
    {
        "name": "土黄",
        "hex": "#d6a01d"
    },
    {
        "name": "百灵鸟灰",
        "hex": "#b4a992"
    },
    {
        "name": "山鸡黄",
        "hex": "#b78b26"
    },
    {
        "name": "龟背黄",
        "hex": "#826b48"
    },
    {
        "name": "苍黄",
        "hex": "#806332"
    },
    {
        "name": "莱阳梨黄",
        "hex": "#815f25"
    },
    {
        "name": "蜴蜊绿",
        "hex": "#835e1d"
    },
    {
        "name": "松鼠灰",
        "hex": "#4f4032"
    },
    {
        "name": "橄榄灰",
        "hex": "#503e2a"
    },
    {
        "name": "蟹壳绿",
        "hex": "#513c20"
    },
    {
        "name": "古铜绿",
        "hex": "#533c1b"
    },
    {
        "name": "焦茶绿",
        "hex": "#553b18"
    },
    {
        "name": "粉白",
        "hex": "#fbf2e3"
    },
    {
        "name": "落英淡粉",
        "hex": "#f9e8d0"
    },
    {
        "name": "瓜瓤粉",
        "hex": "#f9cb8b"
    },
    {
        "name": "蜜黄",
        "hex": "#fbb957"
    },
    {
        "name": "金叶黄",
        "hex": "#ffa60f"
    },
    {
        "name": "金莺黄",
        "hex": "#f4a83a"
    },
    {
        "name": "鹿角棕",
        "hex": "#e3bd8d"
    },
    {
        "name": "凋叶棕",
        "hex": "#e7a23f"
    },
    {
        "name": "玳瑁黄",
        "hex": "#daa45a"
    },
    {
        "name": "软木黄",
        "hex": "#de9e44"
    },
    {
        "name": "风帆黄",
        "hex": "#dc9123"
    },
    {
        "name": "桂皮淡棕",
        "hex": "#c09351"
    },
    {
        "name": "猴毛灰",
        "hex": "#97846c"
    },
    {
        "name": "山鸡褐",
        "hex": "#986524"
    },
    {
        "name": "驼色",
        "hex": "#66462a"
    },
    {
        "name": "茶褐",
        "hex": "#5d3d21"
    },
    {
        "name": "古铜褐",
        "hex": "#5c3719"
    },
    {
        "name": "荷花白",
        "hex": "#fbecde"
    },
    {
        "name": "玫瑰粉",
        "hex": "#f8b37f"
    },
    {
        "name": "橘橙",
        "hex": "#f97d1c"
    },
    {
        "name": "美人焦橙",
        "hex": "#fa7e23"
    },
    {
        "name": "润红",
        "hex": "#f7cdbc"
    },
    {
        "name": "淡桃红",
        "hex": "#f6cec1"
    },
    {
        "name": "海螺橙",
        "hex": "#f0945d"
    },
    {
        "name": "桃红",
        "hex": "#f0ada0"
    },
    {
        "name": "颊红",
        "hex": "#eeaa9c"
    },
    {
        "name": "淡罂粟红",
        "hex": "#eea08c"
    },
    {
        "name": "晨曦红",
        "hex": "#ea8958"
    },
    {
        "name": "蟹壳红",
        "hex": "#f27635"
    },
    {
        "name": "金莲花橙",
        "hex": "#f86b1d"
    },
    {
        "name": "草莓红",
        "hex": "#ef6f48"
    },
    {
        "name": "龙睛鱼红",
        "hex": "#ef632b"
    },
    {
        "name": "蜻蜓红",
        "hex": "#f1441d"
    },
    {
        "name": "大红",
        "hex": "#f04b22"
    },
    {
        "name": "柿红",
        "hex": "#f2481b"
    },
    {
        "name": "榴花红",
        "hex": "#f34718"
    },
    {
        "name": "银朱",
        "hex": "#f43e06"
    },
    {
        "name": "朱红",
        "hex": "#ed5126"
    },
    {
        "name": "鲑鱼红",
        "hex": "#f09c5a"
    },
    {
        "name": "金黄",
        "hex": "#f26b1f"
    },
    {
        "name": "鹿皮褐",
        "hex": "#d99156"
    },
    {
        "name": "醉瓜肉",
        "hex": "#db8540"
    },
    {
        "name": "麂棕",
        "hex": "#de7622"
    },
    {
        "name": "淡银灰",
        "hex": "#c1b2a3"
    },
    {
        "name": "淡赭",
        "hex": "#be7e4a"
    },
    {
        "name": "槟榔综",
        "hex": "#c1651a"
    },
    {
        "name": "银灰",
        "hex": "#918072"
    },
    {
        "name": "海鸥灰",
        "hex": "#9a8878"
    },
    {
        "name": "淡咖啡",
        "hex": "#945833"
    },
    {
        "name": "岩石棕",
        "hex": "#964d22"
    },
    {
        "name": "芒果棕",
        "hex": "#954416"
    },
    {
        "name": "石板灰",
        "hex": "#624941"
    },
    {
        "name": "珠母灰",
        "hex": "#64483d"
    },
    {
        "name": "丁香棕",
        "hex": "#71361d"
    },
    {
        "name": "咖啡",
        "hex": "#753117"
    },
    {
        "name": "筍皮棕",
        "hex": "#732e12"
    },
    {
        "name": "燕颔红",
        "hex": "#fc6315"
    },
    {
        "name": "玉粉红",
        "hex": "#e8b49a"
    },
    {
        "name": "金驼",
        "hex": "#e46828"
    },
    {
        "name": "铁棕",
        "hex": "#d85916"
    },
    {
        "name": "蛛网灰",
        "hex": "#b7a091"
    },
    {
        "name": "淡可可棕",
        "hex": "#b7511d"
    },
    {
        "name": "中红灰",
        "hex": "#8b614d"
    },
    {
        "name": "淡土黄",
        "hex": "#8c4b31"
    },
    {
        "name": "淡豆沙",
        "hex": "#873d24"
    },
    {
        "name": "椰壳棕",
        "hex": "#883a1e"
    },
    {
        "name": "淡铁灰",
        "hex": "#5b423a"
    },
    {
        "name": "中灰驼",
        "hex": "#603d30"
    },
    {
        "name": "淡栗棕",
        "hex": "#673424"
    },
    {
        "name": "可可棕",
        "hex": "#652b1c"
    },
    {
        "name": "柞叶棕",
        "hex": "#692a1b"
    },
    {
        "name": "野蔷薇红",
        "hex": "#fb9968"
    },
    {
        "name": "菠萝红",
        "hex": "#fc7930"
    },
    {
        "name": "藕荷",
        "hex": "#edc3ae"
    },
    {
        "name": "陶瓷红",
        "hex": "#e16723"
    },
    {
        "name": "晓灰",
        "hex": "#d4c4b7"
    },
    {
        "name": "余烬红",
        "hex": "#cf7543"
    },
    {
        "name": "火砖红",
        "hex": "#cd6227"
    },
    {
        "name": "火泥棕",
        "hex": "#aa6a4c"
    },
    {
        "name": "绀红",
        "hex": "#a6522c"
    },
    {
        "name": "橡树棕",
        "hex": "#773d31"
    },
    {
        "name": "海报灰",
        "hex": "#483332"
    },
    {
        "name": "玫瑰灰",
        "hex": "#4b2e2b"
    },
    {
        "name": "火山棕",
        "hex": "#482522"
    },
    {
        "name": "豆沙",
        "hex": "#481e1c"
    },
    {
        "name": "淡米粉",
        "hex": "#fbeee2"
    },
    {
        "name": "初桃粉红",
        "hex": "#f6dcce"
    },
    {
        "name": "介壳淡粉红",
        "hex": "#f7cfba"
    },
    {
        "name": "淡藏花红",
        "hex": "#f6ad8f"
    },
    {
        "name": "瓜瓤红",
        "hex": "#f68c60"
    },
    {
        "name": "芙蓉红",
        "hex": "#f9723d"
    },
    {
        "name": "莓酱红",
        "hex": "#fa5d19"
    },
    {
        "name": "法螺红",
        "hex": "#ee8055"
    },
    {
        "name": "落霞红",
        "hex": "#cf4813"
    },
    {
        "name": "淡玫瑰灰",
        "hex": "#b89485"
    },
    {
        "name": "蟹蝥红",
        "hex": "#b14b28"
    },
    {
        "name": "火岩棕",
        "hex": "#863020"
    },
    {
        "name": "赭石",
        "hex": "#862617"
    },
    {
        "name": "暗驼棕",
        "hex": "#592620"
    },
    {
        "name": "酱棕",
        "hex": "#5a1f1b"
    },
    {
        "name": "栗棕",
        "hex": "#5c1e19"
    },
    {
        "name": "洋水仙红",
        "hex": "#f4c7ba"
    },
    {
        "name": "谷鞘红",
        "hex": "#f17666"
    },
    {
        "name": "苹果红",
        "hex": "#f15642"
    },
    {
        "name": "铁水红",
        "hex": "#f5391c"
    },
    {
        "name": "桂红",
        "hex": "#f25a47"
    },
    {
        "name": "极光红",
        "hex": "#f33b1f"
    },
    {
        "name": "粉红",
        "hex": "#f2b9b2"
    },
    {
        "name": "舌红",
        "hex": "#f19790"
    },
    {
        "name": "曲红",
        "hex": "#f05a46"
    },
    {
        "name": "红汞红",
        "hex": "#f23e23"
    },
    {
        "name": "淡绯",
        "hex": "#f2cac9"
    },
    {
        "name": "无花果红",
        "hex": "#efafad"
    },
    {
        "name": "榴子红",
        "hex": "#f1908c"
    },
    {
        "name": "胭脂红",
        "hex": "#f03f24"
    },
    {
        "name": "合欢红",
        "hex": "#f0a1a8"
    },
    {
        "name": "春梅红",
        "hex": "#f1939c"
    },
    {
        "name": "香叶红",
        "hex": "#f07c82"
    },
    {
        "name": "珊瑚红",
        "hex": "#f04a3a"
    },
    {
        "name": "萝卜红",
        "hex": "#f13c22"
    },
    {
        "name": "淡茜红",
        "hex": "#e77c8e"
    },
    {
        "name": "艳红",
        "hex": "#ed5a65"
    },
    {
        "name": "淡菽红",
        "hex": "#ed4845"
    },
    {
        "name": "鱼鳃红",
        "hex": "#ed3b2f"
    },
    {
        "name": "樱桃红",
        "hex": "#ed3321"
    },
    {
        "name": "淡蕊香红",
        "hex": "#ee4866"
    },
    {
        "name": "石竹红",
        "hex": "#ee4863"
    },
    {
        "name": "草茉莉红",
        "hex": "#ef475d"
    },
    {
        "name": "茶花红",
        "hex": "#ee3f4d"
    },
    {
        "name": "枸枢红",
        "hex": "#ed3333"
    },
    {
        "name": "秋海棠红",
        "hex": "#ec2b24"
    },
    {
        "name": "丽春红",
        "hex": "#eb261a"
    },
    {
        "name": "夕阳红",
        "hex": "#de2a18"
    },
    {
        "name": "鹤顶红",
        "hex": "#d42517"
    },
    {
        "name": "鹅血石红",
        "hex": "#ab372f"
    },
    {
        "name": "覆盆子红",
        "hex": "#ac1f18"
    },
    {
        "name": "貂紫",
        "hex": "#5d3131"
    },
    {
        "name": "暗玉紫",
        "hex": "#5c2223"
    },
    {
        "name": "栗紫",
        "hex": "#5a191b"
    },
    {
        "name": "葡萄酱紫",
        "hex": "#5a1216"
    },
    {
        "name": "牡丹粉红",
        "hex": "#eea2a4"
    },
    {
        "name": "山茶红",
        "hex": "#ed556a"
    },
    {
        "name": "海棠红",
        "hex": "#f03752"
    },
    {
        "name": "玉红",
        "hex": "#c04851"
    },
    {
        "name": "高粱红",
        "hex": "#c02c38"
    },
    {
        "name": "满江红",
        "hex": "#a7535a"
    },
    {
        "name": "枣红",
        "hex": "#7c1823"
    },
    {
        "name": "葡萄紫",
        "hex": "#4c1f24"
    },
    {
        "name": "酱紫",
        "hex": "#4d1018"
    },
    {
        "name": "淡曙红",
        "hex": "#ee2746"
    },
    {
        "name": "唐菖蒲红",
        "hex": "#de1c31"
    },
    {
        "name": "鹅冠红",
        "hex": "#d11a2d"
    },
    {
        "name": "莓红",
        "hex": "#c45a65"
    },
    {
        "name": "枫叶红",
        "hex": "#c21f30"
    },
    {
        "name": "苋菜红",
        "hex": "#a61b29"
    },
    {
        "name": "烟红",
        "hex": "#894e54"
    },
    {
        "name": "暗紫苑红",
        "hex": "#82202b"
    },
    {
        "name": "殷红",
        "hex": "#82111f"
    },
    {
        "name": "猪肝紫",
        "hex": "#541e24"
    },
    {
        "name": "金鱼紫",
        "hex": "#500a16"
    },
    {
        "name": "草珠红",
        "hex": "#f8ebe6"
    },
    {
        "name": "淡绛红",
        "hex": "#ec7696"
    },
    {
        "name": "品红",
        "hex": "#ef3473"
    },
    {
        "name": "凤仙花红",
        "hex": "#ea7293"
    },
    {
        "name": "粉团花红",
        "hex": "#ec9bad"
    },
    {
        "name": "夹竹桃红",
        "hex": "#eb507e"
    },
    {
        "name": "榲桲红",
        "hex": "#ed2f6a"
    },
    {
        "name": "姜红",
        "hex": "#eeb8c3"
    },
    {
        "name": "莲瓣红",
        "hex": "#ea517f"
    },
    {
        "name": "水红",
        "hex": "#f1c4cd"
    },
    {
        "name": "报春红",
        "hex": "#ec8aa4"
    },
    {
        "name": "月季红",
        "hex": "#ce5777"
    },
    {
        "name": "豇豆红",
        "hex": "#ed9db2"
    },
    {
        "name": "霞光红",
        "hex": "#ef82a0"
    },
    {
        "name": "松叶牡丹红",
        "hex": "#eb3c70"
    },
    {
        "name": "喜蛋红",
        "hex": "#ec2c64"
    },
    {
        "name": "鼠鼻红",
        "hex": "#e3b4b8"
    },
    {
        "name": "尖晶玉红",
        "hex": "#cc163a"
    },
    {
        "name": "山黎豆红",
        "hex": "#c27c88"
    },
    {
        "name": "锦葵红",
        "hex": "#bf3553"
    },
    {
        "name": "鼠背灰",
        "hex": "#73575c"
    },
    {
        "name": "甘蔗紫",
        "hex": "#621624"
    },
    {
        "name": "石竹紫",
        "hex": "#63071c"
    },
    {
        "name": "苍蝇灰",
        "hex": "#36282b"
    },
    {
        "name": "卵石紫",
        "hex": "#30161c"
    },
    {
        "name": "李紫",
        "hex": "#2b1216"
    },
    {
        "name": "茄皮紫",
        "hex": "#2d0c13"
    },
    {
        "name": "吊钟花红",
        "hex": "#ce5e8a"
    },
    {
        "name": "兔眼红",
        "hex": "#ec4e8a"
    },
    {
        "name": "紫荆红",
        "hex": "#ee2c79"
    },
    {
        "name": "菜头紫",
        "hex": "#951c48"
    },
    {
        "name": "鹞冠紫",
        "hex": "#621d34"
    },
    {
        "name": "葡萄酒红",
        "hex": "#62102e"
    },
    {
        "name": "磨石紫",
        "hex": "#382129"
    },
    {
        "name": "檀紫",
        "hex": "#381924"
    },
    {
        "name": "火鹅紫",
        "hex": "#33141e"
    },
    {
        "name": "墨紫",
        "hex": "#310f1b"
    },
    {
        "name": "晶红",
        "hex": "#eea6b7"
    },
    {
        "name": "扁豆花红",
        "hex": "#ef498b"
    },
    {
        "name": "白芨红",
        "hex": "#de7897"
    },
    {
        "name": "嫩菱红",
        "hex": "#de3f7c"
    },
    {
        "name": "菠根红",
        "hex": "#d13c74"
    },
    {
        "name": "酢酱草红",
        "hex": "#c5708b"
    },
    {
        "name": "洋葱紫",
        "hex": "#a8456b"
    },
    {
        "name": "海象紫",
        "hex": "#4b1e2f"
    },
    {
        "name": "绀紫",
        "hex": "#461629"
    },
    {
        "name": "古铜紫",
        "hex": "#440e25"
    },
    {
        "name": "石蕊红",
        "hex": "#f0c9cf"
    },
    {
        "name": "芍药耕红",
        "hex": "#eba0b3"
    },
    {
        "name": "藏花红",
        "hex": "#ec2d7a"
    },
    {
        "name": "初荷红",
        "hex": "#e16c96"
    },
    {
        "name": "马鞭草紫",
        "hex": "#ede3e7"
    },
    {
        "name": "丁香淡紫",
        "hex": "#e9d7df"
    },
    {
        "name": "丹紫红",
        "hex": "#d2568c"
    },
    {
        "name": "玫瑰红",
        "hex": "#d2357d"
    },
    {
        "name": "淡牵牛紫",
        "hex": "#d1c2d3"
    },
    {
        "name": "凤信紫",
        "hex": "#c8adc4"
    },
    {
        "name": "萝兰紫",
        "hex": "#c08eaf"
    },
    {
        "name": "玫瑰紫",
        "hex": "#ba2f7b"
    },
    {
        "name": "藤萝紫",
        "hex": "#8076a3"
    },
    {
        "name": "槿紫",
        "hex": "#806d9e"
    },
    {
        "name": "蕈紫",
        "hex": "#815c94"
    },
    {
        "name": "桔梗紫",
        "hex": "#813c85"
    },
    {
        "name": "魏紫",
        "hex": "#7e1671"
    },
    {
        "name": "芝兰紫",
        "hex": "#e9ccd3"
    },
    {
        "name": "菱锰红",
        "hex": "#d276a3"
    },
    {
        "name": "龙须红",
        "hex": "#cc5595"
    },
    {
        "name": "蓟粉红",
        "hex": "#e6d2d5"
    },
    {
        "name": "电气石红",
        "hex": "#c35691"
    },
    {
        "name": "樱草紫",
        "hex": "#c06f98"
    },
    {
        "name": "芦穗灰",
        "hex": "#bdaead"
    },
    {
        "name": "隐红灰",
        "hex": "#b598a1"
    },
    {
        "name": "苋菜紫",
        "hex": "#9b1e64"
    },
    {
        "name": "芦灰",
        "hex": "#856d72"
    },
    {
        "name": "暮云灰",
        "hex": "#4f383e"
    },
    {
        "name": "斑鸠灰",
        "hex": "#482936"
    },
    {
        "name": "淡藤萝紫",
        "hex": "#f2e7e5"
    },
    {
        "name": "淡青紫",
        "hex": "#e0c8d1"
    },
    {
        "name": "青蛤壳紫",
        "hex": "#bc84a8"
    },
    {
        "name": "豆蔻紫",
        "hex": "#ad6598"
    },
    {
        "name": "扁豆紫",
        "hex": "#a35c8f"
    },
    {
        "name": "芥花紫",
        "hex": "#983680"
    },
    {
        "name": "青莲",
        "hex": "#8b2671"
    },
    {
        "name": "芓紫",
        "hex": "#894276"
    },
    {
        "name": "葛巾紫",
        "hex": "#7e2065"
    },
    {
        "name": "牵牛紫",
        "hex": "#681752"
    },
    {
        "name": "紫灰",
        "hex": "#5d3f51"
    },
    {
        "name": "龙睛鱼紫",
        "hex": "#4e2a40"
    },
    {
        "name": "荸荠紫",
        "hex": "#411c35"
    },
    {
        "name": "古鼎灰",
        "hex": "#36292f"
    },
    {
        "name": "乌梅紫",
        "hex": "#1e131d"
    },
    {
        "name": "深牵牛紫",
        "hex": "#1c0d1a"
    },
    {
        "name": "银白",
        "hex": "#f1f0ed"
    },
    {
        "name": "芡食白",
        "hex": "#e2e1e4"
    },
    {
        "name": "远山紫",
        "hex": "#ccccd6"
    },
    {
        "name": "淡蓝紫",
        "hex": "#a7a8bd"
    },
    {
        "name": "山梗紫",
        "hex": "#61649f"
    },
    {
        "name": "螺甸紫",
        "hex": "#74759b"
    },
    {
        "name": "玛瑙灰",
        "hex": "#cfccc9"
    },
    {
        "name": "野菊紫",
        "hex": "#525288"
    },
    {
        "name": "满天星紫",
        "hex": "#2e317c"
    },
    {
        "name": "锌灰",
        "hex": "#7a7374"
    },
    {
        "name": "野葡萄紫",
        "hex": "#302f4b"
    },
    {
        "name": "剑锋紫",
        "hex": "#3e3841"
    },
    {
        "name": "龙葵紫",
        "hex": "#322f3b"
    },
    {
        "name": "暗龙胆紫",
        "hex": "#22202e"
    },
    {
        "name": "晶石紫",
        "hex": "#1f2040"
    },
    {
        "name": "暗蓝紫",
        "hex": "#131124"
    },
    {
        "name": "景泰蓝",
        "hex": "#2775b6"
    },
    {
        "name": "尼罗蓝",
        "hex": "#2474b5"
    },
    {
        "name": "远天蓝",
        "hex": "#d0dfe6"
    },
    {
        "name": "星蓝",
        "hex": "#93b5cf"
    },
    {
        "name": "羽扇豆蓝",
        "hex": "#619ac3"
    },
    {
        "name": "花青",
        "hex": "#2376b7"
    },
    {
        "name": "睛蓝",
        "hex": "#5698c3"
    },
    {
        "name": "虹蓝",
        "hex": "#2177b8"
    },
    {
        "name": "湖水蓝",
        "hex": "#b0d5df"
    },
    {
        "name": "秋波蓝",
        "hex": "#8abcd1"
    },
    {
        "name": "涧石蓝",
        "hex": "#66a9c9"
    },
    {
        "name": "潮蓝",
        "hex": "#2983bb"
    },
    {
        "name": "群青",
        "hex": "#1772b4"
    },
    {
        "name": "霁青",
        "hex": "#63bbd0"
    },
    {
        "name": "碧青",
        "hex": "#5cb3cc"
    },
    {
        "name": "宝石蓝",
        "hex": "#2486b9"
    },
    {
        "name": "天蓝",
        "hex": "#1677b3"
    },
    {
        "name": "柏林蓝",
        "hex": "#126bae"
    },
    {
        "name": "海青",
        "hex": "#22a2c3"
    },
    {
        "name": "钴蓝",
        "hex": "#1a94bc"
    },
    {
        "name": "鸢尾蓝",
        "hex": "#158bb8"
    },
    {
        "name": "牵牛花蓝",
        "hex": "#1177b0"
    },
    {
        "name": "飞燕草蓝",
        "hex": "#0f59a4"
    },
    {
        "name": "品蓝",
        "hex": "#2b73af"
    },
    {
        "name": "银鱼白",
        "hex": "#cdd1d3"
    },
    {
        "name": "安安蓝",
        "hex": "#3170a7"
    },
    {
        "name": "鱼尾灰",
        "hex": "#5e616d"
    },
    {
        "name": "鲸鱼灰",
        "hex": "#475164"
    },
    {
        "name": "海参灰",
        "hex": "#fffefa"
    },
    {
        "name": "沙鱼灰",
        "hex": "#35333c"
    },
    {
        "name": "钢蓝",
        "hex": "#0f1423"
    },
    {
        "name": "云水蓝",
        "hex": "#baccd9"
    },
    {
        "name": "晴山蓝",
        "hex": "#8fb2c9"
    },
    {
        "name": "靛青",
        "hex": "#1661ab"
    },
    {
        "name": "大理石灰",
        "hex": "#c4cbcf"
    },
    {
        "name": "海涛蓝",
        "hex": "#15559a"
    },
    {
        "name": "蝶翅蓝",
        "hex": "#4e7ca1"
    },
    {
        "name": "海军蓝",
        "hex": "#346c9c"
    },
    {
        "name": "水牛灰",
        "hex": "#2f2f35"
    },
    {
        "name": "牛角灰",
        "hex": "#2d2e36"
    },
    {
        "name": "燕颔蓝",
        "hex": "#131824"
    },
    {
        "name": "云峰白",
        "hex": "#d8e3e7"
    },
    {
        "name": "井天蓝",
        "hex": "#c3d7df"
    },
    {
        "name": "云山蓝",
        "hex": "#2f90b9"
    },
    {
        "name": "釉蓝",
        "hex": "#1781b5"
    },
    {
        "name": "鸥蓝",
        "hex": "#c7d2d4"
    },
    {
        "name": "搪磁蓝",
        "hex": "#11659a"
    },
    {
        "name": "月影白",
        "hex": "#c0c4c3"
    },
    {
        "name": "星灰",
        "hex": "#b2bbbe"
    },
    {
        "name": "淡蓝灰",
        "hex": "#5e7987"
    },
    {
        "name": "鷃蓝",
        "hex": "#144a74"
    },
    {
        "name": "嫩灰",
        "hex": "#74787a"
    },
    {
        "name": "战舰灰",
        "hex": "#495c69"
    },
    {
        "name": "瓦罐灰",
        "hex": "#47484c"
    },
    {
        "name": "青灰",
        "hex": "#2b333e"
    },
    {
        "name": "鸽蓝",
        "hex": "#1c2938"
    },
    {
        "name": "钢青",
        "hex": "#142334"
    },
    {
        "name": "暗蓝",
        "hex": "#101f30"
    },
    {
        "name": "月白",
        "hex": "#eef7f2"
    },
    {
        "name": "海天蓝",
        "hex": "#c6e6e8"
    },
    {
        "name": "清水蓝",
        "hex": "#93d5dc"
    },
    {
        "name": "瀑布蓝",
        "hex": "#51c4d3"
    },
    {
        "name": "蔚蓝",
        "hex": "#29b7cb"
    },
    {
        "name": "孔雀蓝",
        "hex": "#0eb0c9"
    },
    {
        "name": "甸子蓝",
        "hex": "#10aec2"
    },
    {
        "name": "石绿",
        "hex": "#57c3c2"
    },
    {
        "name": "竹篁绿",
        "hex": "#b9dec9"
    },
    {
        "name": "粉绿",
        "hex": "#83cbac"
    },
    {
        "name": "美蝶绿",
        "hex": "#12aa9c"
    },
    {
        "name": "毛绿",
        "hex": "#66c18c"
    },
    {
        "name": "蔻梢绿",
        "hex": "#5dbe8a"
    },
    {
        "name": "麦苗绿",
        "hex": "#55bb8a"
    },
    {
        "name": "蛙绿",
        "hex": "#45b787"
    },
    {
        "name": "铜绿",
        "hex": "#2bae85"
    },
    {
        "name": "竹绿",
        "hex": "#1ba784"
    },
    {
        "name": "蓝绿",
        "hex": "#12a182"
    },
    {
        "name": "穹灰",
        "hex": "#c4d7d6"
    },
    {
        "name": "翠蓝",
        "hex": "#1e9eb3"
    },
    {
        "name": "胆矾蓝",
        "hex": "#0f95b0"
    },
    {
        "name": "樫鸟蓝",
        "hex": "#1491a8"
    },
    {
        "name": "闪蓝",
        "hex": "#7cabb1"
    },
    {
        "name": "冰山蓝",
        "hex": "#a4aca7"
    },
    {
        "name": "虾壳青",
        "hex": "#869d9d"
    },
    {
        "name": "晚波蓝",
        "hex": "#648e93"
    },
    {
        "name": "蜻蜓蓝",
        "hex": "#3b818c"
    },
    {
        "name": "玉鈫蓝",
        "hex": "#126e82"
    },
    {
        "name": "垩灰",
        "hex": "#737c7b"
    },
    {
        "name": "夏云灰",
        "hex": "#617172"
    },
    {
        "name": "苍蓝",
        "hex": "#134857"
    },
    {
        "name": "黄昏灰",
        "hex": "#474b4c"
    },
    {
        "name": "灰蓝",
        "hex": "#21373d"
    },
    {
        "name": "深灰蓝",
        "hex": "#132c33"
    },
    {
        "name": "玉簪绿",
        "hex": "#a4cab6"
    },
    {
        "name": "青矾绿",
        "hex": "#2c9678"
    },
    {
        "name": "草原远绿",
        "hex": "#9abeaf"
    },
    {
        "name": "梧枝绿",
        "hex": "#69a794"
    },
    {
        "name": "浪花绿",
        "hex": "#92b3a5"
    },
    {
        "name": "海王绿",
        "hex": "#248067"
    },
    {
        "name": "亚丁绿",
        "hex": "#428675"
    },
    {
        "name": "镍灰",
        "hex": "#9fa39a"
    },
    {
        "name": "明灰",
        "hex": "#8a988e"
    },
    {
        "name": "淡绿灰",
        "hex": "#70887d"
    },
    {
        "name": "飞泉绿",
        "hex": "#497568"
    },
    {
        "name": "狼烟灰",
        "hex": "#5d655f"
    },
    {
        "name": "绿灰",
        "hex": "#314a43"
    },
    {
        "name": "苍绿",
        "hex": "#223e36"
    },
    {
        "name": "深海绿",
        "hex": "#1a3b32"
    },
    {
        "name": "长石灰",
        "hex": "#363433"
    },
    {
        "name": "苷蓝绿",
        "hex": "#1f2623"
    },
    {
        "name": "莽丛绿",
        "hex": "#141e1b"
    },
    {
        "name": "淡翠绿",
        "hex": "#c6dfc8"
    },
    {
        "name": "明绿",
        "hex": "#9eccab"
    },
    {
        "name": "田园绿",
        "hex": "#68b88e"
    },
    {
        "name": "翠绿",
        "hex": "#20a162"
    },
    {
        "name": "淡绿",
        "hex": "#61ac85"
    },
    {
        "name": "葱绿",
        "hex": "#40a070"
    },
    {
        "name": "孔雀绿",
        "hex": "#229453"
    },
    {
        "name": "艾绿",
        "hex": "#cad3c3"
    },
    {
        "name": "蟾绿",
        "hex": "#3c9566"
    },
    {
        "name": "宫殿绿",
        "hex": "#20894d"
    },
    {
        "name": "松霜绿",
        "hex": "#83a78d"
    },
    {
        "name": "蛋白石绿",
        "hex": "#579572"
    },
    {
        "name": "薄荷绿",
        "hex": "#207f4c"
    },
    {
        "name": "瓦松绿",
        "hex": "#6e8b74"
    },
    {
        "name": "荷叶绿",
        "hex": "#1a6840"
    },
    {
        "name": "田螺绿",
        "hex": "#5e665b"
    },
    {
        "name": "白屈菜绿",
        "hex": "#485b4d"
    },
    {
        "name": "河豚灰",
        "hex": "#393733"
    },
    {
        "name": "蒽油绿",
        "hex": "#373834"
    },
    {
        "name": "槲寄生绿",
        "hex": "#2b312c"
    },
    {
        "name": "云杉绿",
        "hex": "#15231b"
    },
    {
        "name": "嫩菊绿",
        "hex": "#f0f5e5"
    },
    {
        "name": "艾背绿",
        "hex": "#dfecd5"
    },
    {
        "name": "嘉陵水绿",
        "hex": "#add5a2"
    },
    {
        "name": "玉髓绿",
        "hex": "#41b349"
    },
    {
        "name": "鲜绿",
        "hex": "#43b244"
    },
    {
        "name": "宝石绿",
        "hex": "#41ae3c"
    },
    {
        "name": "海沬绿",
        "hex": "#e2e7bf"
    },
    {
        "name": "姚黄",
        "hex": "#d0deaa"
    },
    {
        "name": "橄榄石绿",
        "hex": "#b2cf87"
    },
    {
        "name": "水绿",
        "hex": "#8cc269"
    },
    {
        "name": "芦苇绿",
        "hex": "#b7d07a"
    },
    {
        "name": "槐花黄绿",
        "hex": "#d2d97a"
    },
    {
        "name": "苹果绿",
        "hex": "#bacf65"
    },
    {
        "name": "芽绿",
        "hex": "#96c24e"
    },
    {
        "name": "蝶黄",
        "hex": "#e2d849"
    },
    {
        "name": "橄榄黄绿",
        "hex": "#bec936"
    },
    {
        "name": "鹦鹉绿",
        "hex": "#5bae23"
    },
    {
        "name": "油绿",
        "hex": "#253d24"
    },
    {
        "name": "象牙白",
        "hex": "#fffef8"
    },
    {
        "name": "汉白玉",
        "hex": "#f8f4ed"
    },
    {
        "name": "雪白",
        "hex": "#fffef9"
    },
    {
        "name": "鱼肚白",
        "hex": "#f7f4ed"
    },
    {
        "name": "珍珠灰",
        "hex": "#e4dfd7"
    },
    {
        "name": "浅灰",
        "hex": "#dad4cb"
    },
    {
        "name": "铅灰",
        "hex": "#bbb5ac"
    },
    {
        "name": "中灰",
        "hex": "#bbb5ac"
    },
    {
        "name": "瓦灰",
        "hex": "#867e76"
    },
    {
        "name": "夜灰",
        "hex": "#847c74"
    },
    {
        "name": "雁灰",
        "hex": "#80766e"
    },
    {
        "name": "深灰",
        "hex": "#81776e"
    }
]

let actions = []
let dict = ''
颜色对照表.forEach(
    颜色项 => {
        dict+=颜色项.name+','+颜色项.pinyin+','
        actions.push(
            {
                icon: "iconFont",
                label: () => {
                    return {
                        zh_CN: `修改颜色为${颜色项.name}`,
                        en_US: `set color to ${颜色项.pinyin}`
                    }
                },
                hints: `${颜色项.name},颜色,color`,
                active: (menu, element) => {
                    if (element.token) {
                        element.token.highlight()
                    }
                },
                hintAction: (context) => {
                    context.blocks.forEach(block => {
                        block.style.color = 颜色项.hex
                    });
                    if (context.token) {
                        context.token.select()
                        context.token.delete()
                    }
                },
                blockAction: (context) => {
                    context.blocks.forEach(
                        block=>   block.style.color = 颜色项.hex
                    )
                }
            },
        )
        actions.push(
            {
                iconHTML: `<button class="color__square" data-type="backgroundColor" style="background-color:${颜色项.hex}"></button>`,
                label: () => {
                    return {
                        zh_CN: `修改背景颜色为${颜色项.name}`,
                        en_US: `set background to ${颜色项.pinyin}`
                    }
                },
                hints: `${颜色项.name},背景色,background`,
                active: (menu, element) => {
                    if (element.token) {
                        element.token.select()
                    }
                },
                hintAction: (context) => {
                    context.blocks.forEach(block => {
                        block.style.backgroundColor = 颜色项.hex
                    });
                    if (context.token) {
                        context.token.select()
                        context.token.delete()
                    }
                },
                blockAction: (context) => {
                    context.blocks.forEach(
                       block=> block.style.backgroundColor = 颜色项.hex
                    )
                }
            },
        )
    }
)
export default actions
export { dict as dict }