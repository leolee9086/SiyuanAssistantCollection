/* esm.sh - esbuild bundle(fresh@0.5.2) es2022 production */
var x=Object.create;var v=Object.defineProperty;var E=Object.getOwnPropertyDescriptor;var N=Object.getOwnPropertyNames;var A=Object.getPrototypeOf,O=Object.prototype.hasOwnProperty;var D=(e,r)=>()=>(r||e((r={exports:{}}).exports,r),r.exports),L=(e,r)=>{for(var t in r)v(e,t,{get:r[t],enumerable:!0})},c=(e,r,t,f)=>{if(r&&typeof r=="object"||typeof r=="function")for(let a of N(r))!O.call(e,a)&&a!==t&&v(e,a,{get:()=>r[a],enumerable:!(f=E(r,a))||f.enumerable});return e},s=(e,r,t)=>(c(e,r,"default"),t&&c(t,r,"default")),h=(e,r,t)=>(t=e!=null?x(A(e)):{},c(r||!e||!e.__esModule?v(t,"default",{value:e,enumerable:!0}):t,e));var l=D((P,b)=>{"use strict";var R=/(?:^|,)\s*?no-cache\s*?(?:,|$)/;b.exports=T;function T(e,r){var t=e["if-modified-since"],f=e["if-none-match"];if(!t&&!f)return!1;var a=e["cache-control"];if(a&&R.test(a))return!1;if(f&&f!=="*"){var o=r.etag;if(!o)return!1;for(var p=!0,_=W(f),u=0;u<_.length;u++){var i=_[u];if(i===o||i==="W/"+o||"W/"+i===o){p=!1;break}}if(p)return!1}if(t){var d=r["last-modified"],k=!d||!(m(d)<=m(t));if(k)return!1}return!0}function m(e){var r=e&&Date.parse(e);return typeof r=="number"?r:NaN}function W(e){for(var r=0,t=[],f=0,a=0,o=e.length;a<o;a++)switch(e.charCodeAt(a)){case 32:f===r&&(f=r=a+1);break;case 44:t.push(e.substring(f,r)),f=r=a+1;break;default:r=a+1;break}return t.push(e.substring(f,r)),t}});var n={};L(n,{default:()=>y});var g=h(l());s(n,h(l()));var{default:C,...w}=g,y=C!==void 0?C:w;export{y as default};
/*! Bundled license information:

fresh/index.js:
  (*!
   * fresh
   * Copyright(c) 2012 TJ Holowaychuk
   * Copyright(c) 2016-2017 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
//# sourceMappingURL=fresh.mjs.map