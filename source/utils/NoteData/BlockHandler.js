import kernelApi from '../../polyfills/kernelApi.js'
import { clientApi, plugin } from "../../asyncModules.js";
let typeAbbrMap = {
  // 块级元素
  "NodeDocument": "d",
  "NodeHeading": "h",
  "NodeList": "l",
  "NodeListItem": "i",
  "NodeCodeBlock": "c",
  "NodeMathBlock": "m",
  "NodeTable": "t",
  "NodeBlockquote": "b",
  "NodeSuperBlock": "s",
  "NodeParagraph": "p",
  "NodeHTMLBlock": "html",
  "NodeBlockQueryEmbed": "query_embed",
  "NodeKramdownBlockIAL": "ial",
  "NodeIFrame": "iframe",
  "NodeWidget": "widget",
  "NodeThematicBreak": "tb",
  "NodeVideo": "video",
  "NodeAudio": "audio",
  "NodeText": "text",
  "NodeImage": "img",
  "NodeLinkText": "link_text",
  "NodeLinkDest": "link_dest",
  "NodeTextMark": "textmark",
}
class BlockHandler {
  constructor(blockID, initdata, _kernelApi) {
    this.id = blockID;
    if (blockID.id) {
      this.id = blockID.id;
    }
    this.kernelApi = _kernelApi || kernelApi;
    this.typeDict = typeAbbrMap
    this._blockCache = null;
    this._blockCacheTime = null;

  }
  //一个同步请求
  get _block() {
    const now = Date.now();
    if (this._blockCache && now - this._blockCacheTime < 20) {
      return this._blockCache;
    }
    let res= this.kernelApi.SQL.sync({
      stmt: `select * from blocks where id = '${this.id}' `,
    })[0];
    if(res.id){
    this._blockCacheTime = now;
    this._blockCache =res
    return this._blockCache;
    }else{
      return {}
    }
  }
  async netImg2LocalAssets() {
    await this.kernelApi.netImg2LocalAssets({ id: this.id })
  }
  get exists() {
    return this.kernelApi.checkBlockExist.sync({ id: this.id })
  }
  get markdown() {
    return  this._block.markdown 
  }
  get content() {
    return this._block.content
  }
  get path() {
    return  this._block.path 
  }
  get root() {
    return this.exists ? new BlockHandler(this.kernelApi.getBlockInfo.sync({ id: this.id }).rootID) : undefined;
  }
  get box() {
    return this.exists ? this.kernelApi.getBlockInfo.sync({ id: this.id }).box : undefined;
  }
  get attrs() {
    return new Proxy(
      {},
      {
        get: (obj, prop) => {
          return this.kernelApi.getBlockAttrs.sync({ id: this.id })[prop];
        },
        set: (obj, prop, value) => {
          let attrs = {};
          attrs[prop] = value;
          this.kernelApi.setBlockAttrs.sync({ id: this.id, attrs: attrs });
        },
      }
    );
  }
  set attrs(attrs) {
    this.kernelApi.setBlockAttrs.sync({ id: this.id, attrs: attrs });
  }
  get style() {
    let styleProxy
    if (this.firstElement) {
      styleProxy = new Proxy(
        this.firstElement.style, {

        set: (target, prop, value) => {
          target[prop] = value;
          this.kernelApi.setBlockAttrs.sync({ id: this.id, attrs: { style: this.firstElement.getAttribute('style') } });
          // 在这里执行更新样式的操作，例如将样式应用到实际的DOM元素
          // this.applyStyleToDOM();
          return true;
        },
      }
      )
    } else {
      let style = this.kernelApi.getBlockAttrs.sync({ id: this.id }).style
      let div = document.createElement('div')
      div.setAttribute('style', style)
      styleProxy = new Proxy(
        div.style, {

        set: (target, prop, value) => {
          target[prop] = value;
          this.kernelApi.setBlockAttrs.sync({ id: this.id, attrs: { style: div.getAttribute('style') } });
          // 在这里执行更新样式的操作，例如将样式应用到实际的DOM元素
          // this.applyStyleToDOM();
          return true;
        },

      }
      )

    }
    return styleProxy
  }
  get alias() {
    return this.attrs.alias
  }
  set alias(value) {
    this.kernelApi.setBlockAttrs.sync({ id: this.id, attrs: { alias: value } });
  }
  get firstElement() {

    return document.querySelector(
      `.protyle-wysiwyg [data-node-id="${this.id}"]`
    ) || document.querySelector(
      `div.protyle-title[data-node-id="${this.id}"]`
    ).nextElementSibling
  }
  get type() {
    if (this.firstElement) {
      return typeMatcher(this.firstElement.getAttribute('data-type') || this.firstElement.getAttribute('data-doc-type'))
    } else {
      return this._block.type
    }
  }
  get elements() {
    let blockElements = document.querySelectorAll(
      `.protyle-wysiwyg [data-node-id="${this.id}"]`
    )
    return blockElements
  }
  baseAttrs = ["id", "type", "subtype"];

  get _parent() {
    return this.kernelApi.SQL.sync({
      stmt: `select * from blocks where id in (select parent_id from blocks where id =  '${this.id}') `,
    })[0];

  }
  async removeRoot() {
    this.kernelApi.removeDoc({
      notebook: this._block.box,
      path: this._block.path,
    });
  }
  async removeBlock() {
    this.kernelApi.deleteBlock({
      id: this._block.id,
    });
  }
  async remove() {
    if (this._block.type === "d") {
      await this.removeRoot();
    } else {
      await this.removeBlock();
    }
  }
  async removeParent() {
    let { parent_id } = this._block;
    if (parent_id) {
      let parentBlock = new BlockHandler(parent_id);
      await parentBlock.remove();
    }
  }
  async getAttribute(name) {
    const attributes = await this.kernelApi.getBlockAttrs({
      id: this.id,
    });
    return attributes[name];
  }
  async setAttribute(name, value) {
    let obj = {};
    obj[name] = value;
    await this.kernelApi.setBlockAttrs({
      id: this.id,
      attrs: obj,
    });
  }
  async setAttributes(obj) {
    await this.kernelApi.setBlockAttrs({
      id: this.id,
      attrs: obj,
    });
  }
  //如果不提供previousID,会被插入到文档的什么位置?
  async moveTo(parentID, previousID) {

    if (!this.id) {
      console.log('没有id')
      return;
    }
    //type为d时就不执行了
    if (this.type === "d") {
      console.log('没有目标id')

      return;
    }
    if (!parentID) {
      console.log('没有目标id')

      return;
    }
    await this.kernelApi.moveBlock(
      {
        id: this.id,
        parentID,
        previousID,
      },
      ""
    );
  }
  async moveDocTo(targetID) {
    this.refresh();
    let { path: fromPath, box: fromNotebook } = await this.kernelApi.获取文档(
      { id: this.id, size: 102400 },
      ""
    );
    let {
      path: toPath,
      box: toNotebook,
      rootID,
    } = await this.kernelApi.获取文档({ id: targetID, size: 102400 }, "");
    await this.kernelApi.批量移动文档({
      fromPaths: [fromPath],
      fromNotebook,
      toPath,
      toNotebook,
    });
  }
  async toChildDoc() {
    if (this.type !== "h") {
      return;
    }
    this.kernelApi.heading2Doc({
      targetNoteBook: this.box,
      srcHeadingID: this.id,
      targetPath: this.path,
      pushMode: 0,
    });
  }
  //只有文档块有子文档
  async mergeChildDoc(recursion) {
    if (this.type !== "d") {
      return;
    }
    let 子文档列表 = await this.核心api.listDocsByPath({
      notebook: this.box,
      path: this.path,
      sort: window.siyuan.config.fileTree.sort,
    });
    for await (let 文档属性 of 子文档列表) {
      let 子文档 = new BlockHandler(文档属性);
      if (recursion) {
        if (文档属性.subFileCount) {
          await 文档.mergeChildDoc(position, true);
        }
      }
      await 子文档.toHeading(this.id);
    }
  }
  async toHeading(targetID) {
    if (this.type !== "d") {
      return;
    }
    let 目标文档内容 = await kernelApi.getDoc({
      id: targetID,
      size: 102400,
    });
    let div = document.createElement("div");
    div.innerHTML = 目标文档内容.content;
    let 目标块id = div
      .querySelector("[data-node-id]")
      .getAttribute("data-node-id");
    let data = await kernelApi.doc2Heading({
      srcID: this.id,
      after: false,
      targetID: 目标块id,
    });
    if (data && data.srcTreeBox) {
      await kernelApi.removeDoc({
        noteBook: data.srcTreeBox,
        path: data.srcTreePath,
      });
    }
  }
  async getDoc(size) {
    return await this.kernelApi.getDoc({
      id: this.id,
      size: size ? size : 102400,
    });
  }
  async getFullContent() {
    let { content } = await this.getDoc();
    console.log(content);
    let vDoc = new DOMParser().parseFromString(content, "text/html");
    console.log(vDoc);
    return vDoc.body.innerText;
  }
  async prepend(content, type) {
    let firstCild = await this.listChildren()[0]
    if (firstCild) {
      this.kernelApi.insertBlock(
        {
          "dataType": type || 'markdown',
          "data": content,
          "nextID": firstCild.id,
        })
    }
  }
  async append(content, type) {
    if (!this.exists) {
      return
    }
    return this.kernelApi.insertBlock(
      {
        "dataType": type || 'markdown',
        "data": content,
        "parentID": this.id,
      })
  }
  async insertAfter(content, type) {
    if (!this.exists) {
      return
    }
    return this.kernelApi.insertBlock(
      {
        "dataType": type || 'markdown',
        "data": content,
        "previousID": this.id,
      })
  }
  async insertBefore(content, type) {
    if (!this.exists) {
      return
    }
    return this.kernelApi.insertBlock(
      {
        "dataType": type || 'markdown',
        "data": content,
        "nextID": this.id,
      })
  }
  async convert(目标类型, 目标子类) {
    if (this.type !== 'p') {
      console.warn('当前只支持段落块的转换')
      return
    } else {
      let kramDown = this.kernelApi.getBlockKramdown.sync({ id: this.id })
      this.kernelApi.updateBlock(
        {
          id: this.id,
          data: '## ' + kramDown,
          type: 'markdown'
        }
      )
    }
  }
  async open() {
    if (this.exists) {
      await clientApi.openTab({
        app: plugin.app,
        doc: {
          id: this.id,
        }
      });

    }

  }
  async 转化为标题(级别) {
    if (!this.type == 'p') {
      console.warn('目前只支持段落转化')
      return
    }
    else {
      let { dom } = await this.kernelApi.getBlockDOM({ id: this.id })
      let div = document.createElement('div')
      div.innerHTML = dom
      dom = div.querySelector(`[data-node-id='${this.id}']`)
      dom.setAttribute('data-type', 'NodeHeading')
      dom.setAttribute('data-subtype', `h${级别}`)
      dom.setAttribute('class', `h${级别}`)
      dom.setAttribute('updated', geTimeStamp())
      await this.kernelApi.updateBlock(
        {
          id: this.id,
          data: div.innerHTML,
          dataType: 'dom'
        }
      )
    }
  }

  async 转化为一级标题() {
    return this.转化为标题(1);
  }

  async 转化为二级标题() {
    return this.转化为标题(2);
  }

  async 转化为三级标题() {
    return this.转化为标题(3);
  }

  async 转化为四级标题() {
    return this.转化为标题(4);
  }

  async 转化为五级标题() {
    return this.转化为标题(5);
  }

  async 转化为六级标题() {
    return this.转化为标题(6);
  }
}

function typeMatcher(type) {
  return typeAbbrMap[type]
}

function geTimeStamp() {
  let date = new Date();
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以需要+1
  let day = date.getDate().toString().padStart(2, '0');
  let hour = date.getHours().toString().padStart(2, '0');
  let minute = date.getMinutes().toString().padStart(2, '0');
  let second = date.getSeconds().toString().padStart(2, '0');
  let timestamp = `${year}${month}${day}${hour}${minute}${second}`;
  return timestamp
}
export { BlockHandler as BlockHandler };
export default BlockHandler