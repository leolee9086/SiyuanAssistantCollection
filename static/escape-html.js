/* esm.sh - esbuild bundle(escape-html@1.0.3) es2022 production */
var x=Object.create;var d=Object.defineProperty;var b=Object.getOwnPropertyDescriptor;var v=Object.getOwnPropertyNames;var h=Object.getPrototypeOf,_=Object.prototype.hasOwnProperty;var g=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),k=(t,e)=>{for(var a in e)d(t,a,{get:e[a],enumerable:!0})},i=(t,e,a,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of v(e))!_.call(t,r)&&r!==a&&d(t,r,{get:()=>e[r],enumerable:!(s=b(e,r))||s.enumerable});return t},u=(t,e,a)=>(i(t,e,"default"),a&&i(a,e,"default")),l=(t,e,a)=>(a=t!=null?x(h(t)):{},i(e||!t||!t.__esModule?d(a,"default",{value:t,enumerable:!0}):a,t));var f=g((I,m)=>{"use strict";var H=/["'&<>]/;m.exports=q;function q(t){var e=""+t,a=H.exec(e);if(!a)return e;var s,r="",c=0,o=0;for(c=a.index;c<e.length;c++){switch(e.charCodeAt(c)){case 34:s="&quot;";break;case 38:s="&amp;";break;case 39:s="&#39;";break;case 60:s="&lt;";break;case 62:s="&gt;";break;default:continue}o!==c&&(r+=e.substring(o,c)),o=c+1,r+=s}return o!==c?r+e.substring(o,c):r}});var n={};k(n,{default:()=>C});var w=l(f());u(n,l(f()));var{default:p,...A}=w,C=p!==void 0?p:A;export{C as default};
/*! Bundled license information:

escape-html/index.js:
  (*!
   * escape-html
   * Copyright(c) 2012-2013 TJ Holowaychuk
   * Copyright(c) 2015 Andreas Lubbe
   * Copyright(c) 2015 Tiancheng "Timothy" Gu
   * MIT Licensed
   *)
*/
//# sourceMappingURL=escape-html.mjs.map