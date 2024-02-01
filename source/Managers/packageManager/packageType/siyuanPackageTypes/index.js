import { got } from "../../runtime.js";
export const siyuanPackageDefines = [{
    name: 'plugin',
    location: '/data/plugins',
    topic: 'siyuan-plugin',
    meta: 'plugin.json',
    adapters: ['github', 'npm', 'siyuan'],
    singleFile: false,
    listRemote: async (result) => {
        try {
            const response = await got('https://raw.githubusercontent.com/siyuan-note/bazaar/main/stage/plugins.json');
            const Data = JSON.parse(response.body);
            console.log(Data)
            const combinedRepos = [...result.repos, ...Data.repos];
            return { repos: combinedRepos };
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    descriptions: {
        default: "思源的插件"
    }
},
{
    name: 'theme',
    location: '/conf/appearance/themes',
    topic: 'siyuan-theme',
    meta: 'theme.json',
    adapters: ['github', 'npm', 'siyuan'],
    singleFile: false,
    listRemote: async (result) => {
        try {
            const response = await got('https://raw.githubusercontent.com/siyuan-note/bazaar/main/stage/themes.json');
            const Data = JSON.parse(response.body);
            console.log(Data)
            const combinedRepos = [...result.repos, ...Data.repos];
            return { repos: combinedRepos };
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    descriptions: {
        default: "思源的主题包"
    }
},
{
    name: 'icon',
    location: '/conf/appearance/icons',
    topic: 'siyuan-icon',
    meta: 'icon.json',
    adapters: ['github', 'npm', 'siyuan'],
    singleFile: false,
    listRemote: async (result) => {
        try {
            const response = await got('https://raw.githubusercontent.com/siyuan-note/bazaar/main/stage/icons.json');
            const Data = JSON.parse(response.body);
            console.log(Data)
            const combinedRepos = [...result.repos, ...Data.repos];
            return { repos: combinedRepos };
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    descriptions: {
        default: "思源的图标"
    }
},
{
    name: 'template',
    location: '/data/templates',
    topic: 'siyuan-template',
    meta: 'template.json',
    adapters: ['github', 'npm', 'siyuan'],
    singleFile: false,
    listRemote: async (result) => {
        try {
            const response = await got('https://raw.githubusercontent.com/siyuan-note/bazaar/main/stage/templates.json');
            const Data = JSON.parse(response.body);
            console.log(Data)
            const combinedRepos = [...result.repos, ...Data.repos];
            return { repos: combinedRepos };
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    descriptions: {
        default: "思源的模板文件"
    }
},
{
    name: 'widget',
    location: '/data/widgets',
    topic: 'siyuan-widget',
    meta: 'widget.json',
    adapters: ['github', 'npm', 'siyuan'],
    singleFile: false,
    listRemote: async (result) => {
        try {
            const response = await got('https://raw.githubusercontent.com/siyuan-note/bazaar/main/stage/widgets.json');
            const Data = JSON.parse(response.body);
            console.log(Data)
            const combinedRepos = [...result.repos, ...Data.repos];
            return { repos: combinedRepos };
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    descriptions: {
        default: '思源的挂件'
    }
}
]