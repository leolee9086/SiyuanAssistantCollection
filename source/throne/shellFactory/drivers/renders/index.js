import { kernelApi } from "../../../../asyncModules.js";
export  function 获取嵌入块内容(嵌入块, docid) {
    let smt = 嵌入块.getAttribute("data-content");
    let id数组 = [];
    let 当前文档id = docid;
    let 嵌入块id = 嵌入块.getAttribute("data-node-id");
    id数组=[嵌入块id,当前文档id]
    let res =
      ( kernelApi.searchEmbedBlock.sync(
        {
          breadcrumb:false,
          stmt: smt,
          excludeIDs: id数组,
          headingMode: 0,
          embedBlockID:嵌入块id
        },
        "",
  
      )) || {};
    let blocks = res.blocks || [];
  
    let 嵌入块内容 = "";
    blocks.forEach((el) => {
      嵌入块内容 = 嵌入块内容 + el.block.content;
    });
  
    嵌入块.innerHTML = 嵌入块内容 + 嵌入块.innerHTML;
    return 嵌入块.innerHTML;
  }