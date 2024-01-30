import { string2DOM } from "../../builders/index.js"
import { clientApi,plugin } from "../../../asyncModules.js"
export let searchResultPreviewer = string2DOM(
    `<div id="searchPreview" class="fn__flex-1 search__preview protyle" data-loading="finished">
    </div>`
)
searchResultPreviewer.addEventListener(
    'resultID-setted',(e)=>{
        let { id } = e.detail
        new clientApi.Protyle(plugin.app, searchResultPreviewer, {
            blockId: id,//"20231011203156-3htnon3",
            render: {
                gutter: true,
                breadcrumbDocName: true
            },
        });
    }
)