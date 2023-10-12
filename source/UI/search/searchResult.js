import { emitEvent, string2DOM } from "../builders/index.js";
import { clientApi, plugin } from "../../asyncModules.js";
import { searchResultPreviewer } from "./searchPreviewer/index.js";
import { searchResultList } from "./searchPreviewer/list.js";
import logger from '../../logger/index.js'
export let searchResult = string2DOM(
    `<div class="search__layout">
<div class="search__drag"></div>
</div>
`
)
searchResult.appendChild(searchResultList)
searchResult.appendChild(searchResultPreviewer)
searchResult.addEventListener(
    'resultID-setted', (e) => {
        emitEvent(searchResultPreviewer, 'resultID-setted', e.detail)
    }
)
searchResult.addEventListener(
    'result-added', (e) => {
        logger.uilog(e)
        if (e.detail && e.detail.data) {
            emitEvent(searchResultList,'result-added',{data})
        }
    }
)