import { string2DOM } from "../../builders/index.js"
export let searchResultList = string2DOM(
    `
    <div id="searchList" class="fn__flex-1 search__list b3-list b3-list--background">
 
</div>
    `
)
export const genSearchResultItem = (block) => {
    return string2DOM(`
    <div data-type="search-item" class="b3-list-item b3-list-item--focus" data-node-id="${block.id}" data-root-id="${block.root_id}">
    <svg class="b3-list-item__graphic"><use xlink:href="#iconParagraph"></use></svg>
    <span class="b3-list-item__text">${block.content}</span>
    <span class="b3-list-item__meta b3-list-item__meta--ellipsis ariaLabel" aria-label="${block.content}">${block.content}</span>
</div>
    `)
}
searchResultList.addEventListener('result-added', (e) => {
    let { data } = e.detail
    data.forEach(block => {
        searchResultList.appendChild(genSearchResultItem(block))
    });
})