/* esm.sh - esbuild bundle(parseurl@1.3.3) es2022 production */
import * as __0$ from "./url.js";
var require=n=>{const e=m=>typeof m.default<"u"?m.default:m,c=m=>Object.assign({},m);switch(n){case"url":return e(__0$);default:throw new Error("module \""+n+"\" not found");}};
var w=Object.create;var s=Object.defineProperty;var y=Object.getOwnPropertyDescriptor;var U=Object.getOwnPropertyNames;var A=Object.getPrototypeOf,C=Object.prototype.hasOwnProperty;var O=(r=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(r,{get:(e,a)=>(typeof require<"u"?require:e)[a]}):r)(function(r){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+r+'" is not supported')});var j=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports),k=(r,e)=>{for(var a in e)s(r,a,{get:e[a],enumerable:!0})},o=(r,e,a,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of U(e))!C.call(r,n)&&n!==a&&s(r,n,{get:()=>e[n],enumerable:!(t=y(e,n))||t.enumerable});return r},f=(r,e,a)=>(o(r,e,"default"),a&&o(a,e,"default")),p=(r,e,a)=>(a=r!=null?w(A(r)):{},o(e||!r||!r.__esModule?s(a,"default",{value:r,enumerable:!0}):a,r));var d=j((G,c)=>{"use strict";var _=O("url"),x=_.parse,l=_.Url;c.exports=g;c.exports.original=z;function g(r){var e=r.url;if(e!==void 0){var a=r._parsedUrl;return h(e,a)?a:(a=v(e),a._raw=e,r._parsedUrl=a)}}function z(r){var e=r.originalUrl;if(typeof e!="string")return g(r);var a=r._parsedOriginalUrl;return h(e,a)?a:(a=v(e),a._raw=e,r._parsedOriginalUrl=a)}function v(r){if(typeof r!="string"||r.charCodeAt(0)!==47)return x(r);for(var e=r,a=null,t=null,n=1;n<r.length;n++)switch(r.charCodeAt(n)){case 63:t===null&&(e=r.substring(0,n),a=r.substring(n+1),t=r.substring(n));break;case 9:case 10:case 12:case 13:case 32:case 35:case 160:case 65279:return x(r)}var i=l!==void 0?new l:{};return i.path=r,i.href=r,i.pathname=e,t!==null&&(i.query=a,i.search=t),i}function h(r,e){return typeof e=="object"&&e!==null&&(l===void 0||e instanceof l)&&e._raw===r}});var u={};k(u,{default:()=>E,original:()=>B});var b=p(d());f(u,p(d()));var{original:B}=b,{default:m,...D}=b,E=m!==void 0?m:D;export{E as default,B as original};
/*! Bundled license information:

parseurl/index.js:
  (*!
   * parseurl
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2014-2017 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
//# sourceMappingURL=parseurl.mjs.map