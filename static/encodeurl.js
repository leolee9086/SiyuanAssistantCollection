/* esm.sh - esbuild bundle(encodeurl@1.0.2) es2022 production */
var f=Object.create;var _=Object.defineProperty;var n=Object.getOwnPropertyDescriptor;var d=Object.getOwnPropertyNames;var c=Object.getPrototypeOf,l=Object.prototype.hasOwnProperty;var C=(F,e)=>()=>(e||F((e={exports:{}}).exports,e),e.exports),p=(F,e)=>{for(var r in e)_(F,r,{get:e[r],enumerable:!0})},D=(F,e,r,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of d(e))!l.call(F,t)&&t!==r&&_(F,t,{get:()=>e[t],enumerable:!(a=n(e,t))||a.enumerable});return F},x=(F,e,r)=>(D(F,e,"default"),r&&D(r,e,"default")),A=(F,e,r)=>(r=F!=null?f(c(F)):{},D(e||!F||!F.__esModule?_(r,"default",{value:F,enumerable:!0}):r,F));var E=C((T,o)=>{"use strict";o.exports=P;var s=/(?:[^\x21\x25\x26-\x3B\x3D\x3F-\x5B\x5D\x5F\x61-\x7A\x7E]|%(?:[^0-9A-Fa-f]|[0-9A-Fa-f][^0-9A-Fa-f]|$))+/g,U=/(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]|[\uD800-\uDBFF]([^\uDC00-\uDFFF]|$)/g,i="$1\uFFFD$2";function P(F){return String(F).replace(U,i).replace(s,encodeURI)}});var u={};p(u,{default:()=>G});var m=A(E());x(u,A(E()));var{default:R,...B}=m,G=R!==void 0?R:B;export{G as default};
/*! Bundled license information:

encodeurl/index.js:
  (*!
   * encodeurl
   * Copyright(c) 2016 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
//# sourceMappingURL=encodeurl.mjs.map