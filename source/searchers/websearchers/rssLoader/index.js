import ctx from './ctxPolyfills.js';
import rssV1router from './routeMapV1.js'

export const parseRss = (path, options) => {
    const url = new URL(path);
    const pathWithQuery = url.pathname + url.search;  // "/zhihu/zhuanlan/googledevelopers?query=example"
    let _ctx = ctx(pathWithQuery, options)
    return new Promise((resolve, reject) => {
        try {
            rssV1router.routes('/')(_ctx, () => {
                resolve(
                    _ctx)
            });
        } catch (e) {
            reject(e)
        }
    })
}
class RSSList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    async connectedCallback() {
        const src = this.getAttribute('src');
        parseRss(src).then(
            ctx => {
                this.render(ctx);

            }
        )
    }
    render(ctx) {
        console.log(ctx)
        this.shadowRoot.innerHTML = `
        <style>
            .rss-card {
                border: 1px solid #ccc;
                padding: 15px;
                margin-bottom: 10px;
                border-radius: 5px;
                background-color: #f9f9f9;
            }
            .rss-card h2, .rss-card h3 {
                margin: 0 0 10px 0;
                color: #333;
            }
            .rss-card p {
                margin: 0;
                color: #666;
            }
            .rss-card a {
                color: #007BFF;
                text-decoration: none;
            }
            .rss-card a:hover {
                color: #0056b3;
            }
            .rss-card img{
                max-width:100%
            }
        </style>
        <div class="rss-card">
            <h2><a href="${ctx.state.data.link}">${ctx.state.data.title}</a></h2>
            <p>${ctx.state.data.description}</p>
        </div>
        `
        ctx.state.data.item.forEach(
            ctx => {
                this.shadowRoot.innerHTML += `
                <div class="rss-card">
                    <h3><a href="${ctx.link}">${ctx.title}</a></h3>
                    <p>${ctx.description}</p>
                </div>
            `;
            }
        )
    }
}

customElements.define('rss-list', RSSList)
