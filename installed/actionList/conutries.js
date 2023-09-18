//word代表了插入结果
let dict = [
    {
        word: '中华人民共和国',
        hints: '中华,中国,我国,中华人民共和国,cn,zh',
        display: '中华人民共和国'
    },
    {
        word: '法兰西共和国',
        hints: '法国,法兰西,法兰西共和国,fr,高卢鸡,高卢',
        display: '法兰西共和国'
    },
    {
        word: '德意志联邦共和国',
        hints: '德国,德意志,德意志联邦共和国,de',
        display: '德意志联邦共和国'
    },
    {
        word: '印度共和国',
        hints: '印度,印度共和国,in',
        display: '印度共和国'
    },
    {
        word: '美利坚合众国',
        hints: '美国,美利坚,合众国,美利坚合众国,us',
        display: '美利坚合众国'
    },
    {
        word: '俄罗斯联邦',
        hints: '俄罗斯,俄罗斯联邦,ru',
        display: '俄罗斯联邦'
    },
    {
        word: '巴西联邦共和国',
        hints: '巴西,巴西联邦共和国,br',
        display: '巴西联邦共和国'
    },
    {
        word: '意大利共和国',
        hints: '意大利,意大利共和国,it',
        display: '意大利共和国'
    },
    {
        word: '阿根廷共和国',
        hints: '阿根廷,阿根廷共和国,ar',
        display: '阿根廷共和国'
    },
    {
        word: '墨西哥合众国',
        hints: '墨西哥,墨西哥合众国,mx',
        display: '墨西哥合众国'
    },
    // 添加更多国家...
    {
        word: '阿富汗伊斯兰共和国',
        hints: '阿富汗,阿富汗伊斯兰共和国,af',
        display: '阿富汗伊斯兰共和国'
    },
    {
        word: '阿尔巴尼亚共和国',
        hints: '阿尔巴尼亚,阿尔巴尼亚共和国,al',
        display: '阿尔巴尼亚共和国'
    },
    {
        word: '阿尔及利亚民主人民共和国',
        hints: '阿尔及利亚,阿尔及利亚民主人民共和国,dz',
        display: '阿尔及利亚民主人民共和国'
    },
    // 继续添加更多国家...
];
/*let data =  await (await fetch('https://restcountries.com/v3.1/all')).json()
    data.forEach(country => {
      let countryObj = {
        word: country.translations.zho?country.translations.zho.official:country.name.common,
        hints: Object.values(country.name).concat(country.cca2, country.cca3).join(','),
        display: country.name.common
      };
      dict.push(countryObj);
    });*/


let actions = []
dict.forEach(item => {
    actions.push(
        {
            icon: "iconInsertRight",
            label: () => {
                return `${item.word}`
            },
            hints: item.hints,
            //当菜单项目被选中时触发
            active: (menu, item) => {
                if (item.token) {
                    item.token.highlight()
                }
                if (item.tokens) {
                    item.tokens.forEach(
                        token => {
                            token.highlight()
                        }
                    )
                }
            },
            deactive: (menu, item) => {
                if (item.token) {

                    item.token.dehighlight()
                }
                if (item.tokens) {
                    item.tokens.forEach(
                        token => {
                            token.dehighlight()
                        }
                    )
                }

            },
            //行内关键词触发菜单时的动作
            hintAction: (context) => {
                if (context.token) {
                    context.token.select()
                    context.protyle.insert(item.word)
                }
            },
            //块标模式下,对所有块进行批量替换
            blockAction: (context) => {
                context.blocks.forEach(
                    block => {
                        plugin.DOM处理器.tokenize(block.element).forEach(
                            token => {
                                if (item.word.startsWith(token.word)) {
                                    token.select()
                                    context.protyle.insert(item.word)
                                }
                            }
                        )
                    }
                )
            },
            sort: 0
        }
    )
})

export default actions