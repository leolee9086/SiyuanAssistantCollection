/* esm.sh - esbuild bundle(vary@1.1.2) es2022 production */
var m=Object.create;var p=Object.defineProperty;var _=Object.getOwnPropertyDescriptor;var h=Object.getOwnPropertyNames;var E=Object.getPrototypeOf,A=Object.prototype.hasOwnProperty;var b=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports),H=(r,e)=>{for(var t in e)p(r,t,{get:e[t],enumerable:!0})},f=(r,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of h(e))!A.call(r,a)&&a!==t&&p(r,a,{get:()=>e[a],enumerable:!(n=_(e,a))||n.enumerable});return r},s=(r,e,t)=>(f(r,e,"default"),t&&f(t,e,"default")),c=(r,e,t)=>(t=r!=null?m(E(r)):{},f(e||!r||!r.__esModule?p(t,"default",{value:r,enumerable:!0}):t,r));var v=b((S,d)=>{"use strict";d.exports=k;d.exports.append=y;var T=/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;function y(r,e){if(typeof r!="string")throw new TypeError("header argument is required");if(!e)throw new TypeError("field argument is required");for(var t=Array.isArray(e)?e:l(String(e)),n=0;n<t.length;n++)if(!T.test(t[n]))throw new TypeError("field argument contains an invalid header name");if(r==="*")return r;var a=r,i=l(r.toLowerCase());if(t.indexOf("*")!==-1||i.indexOf("*")!==-1)return"*";for(var u=0;u<t.length;u++){var g=t[u].toLowerCase();i.indexOf(g)===-1&&(i.push(g),a=a?a+", "+t[u]:t[u])}return a}function l(r){for(var e=0,t=[],n=0,a=0,i=r.length;a<i;a++)switch(r.charCodeAt(a)){case 32:n===e&&(n=e=a+1);break;case 44:t.push(r.substring(n,e)),n=e=a+1;break;default:e=a+1;break}return t.push(r.substring(n,e)),t}function k(r,e){if(!r||!r.getHeader||!r.setHeader)throw new TypeError("res argument is required");var t=r.getHeader("Vary")||"",n=Array.isArray(t)?t.join(", "):String(t);(t=y(n,e))&&r.setHeader("Vary",t)}});var o={};H(o,{append:()=>q,default:()=>L});var x=c(v());s(o,c(v()));var{append:q}=x,{default:w,...C}=x,L=w!==void 0?w:C;export{q as append,L as default};
/*! Bundled license information:

vary/index.js:
  (*!
   * vary
   * Copyright(c) 2014-2017 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
//# sourceMappingURL=vary.mjs.map