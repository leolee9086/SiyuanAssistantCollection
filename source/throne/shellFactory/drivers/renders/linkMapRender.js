import { clientApi } from "../../../../asyncModules.js";
export const renderLinkMap=async(element,linkMap)=>{
    let linkSpans = element.querySelectorAll('[data-type="a"]')
    linkSpans.forEach(link => {
        const idShortCode = link.getAttribute('data-href').replace('ref:', '').split('-').pop().trim();
        const foundLink = Object.keys(linkMap).find(key => key.endsWith(idShortCode));
        if (foundLink) {
            link.setAttribute('data-href', linkMap[foundLink]);
            link.addEventListener('click', (event) => {
                const target = event.target;
                const href = target.getAttribute('data-href');
                window.open(href, '_blank');

            });
        } else {
            if (!link.getAttribute('data-href').startsWith('ref:')) {
                link.setAttribute('data-real-href', link.getAttribute('data-href'));
                link.addEventListener('click', (e) => {
                    clientApi.confirm(
                        "这货又自己编参考来源了",
                        '这个链接好像是它自己找的,你要尝试访问的话就点吧',
                        (confirmed) => {
                            if (confirmed) {
                                window.open(link.getAttribute('data-real-href', '_blank'))
                            }
                        }
                    )
                    e.stopPropagation()
                    e.preventDefault()
                })
            } else {
                link.setAttribute('data-real-href', link.getAttribute('data-href'));
                link.setAttribute('data-href', link.getAttribute('data-href') + "这个肯定是它瞎编的不用想了");
                link.addEventListener('click', (e) => {
                    clientApi.confirm(
                        "这货又自己编参考来源了",
                        '这个链接好像是它编的,你要尝试访问的话就点吧',
                        (confirmed) => {
                            if (confirmed) {
                                window.open(link.getAttribute('data-real-href', '_blank'))
                            }
                        }
                    )
                    e.stopPropagation()
                    e.preventDefault()
                })
            }
        }
    });
}