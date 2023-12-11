/* esm.sh - esbuild bundle(http-assert@1.5.0) es2022 production */
import * as __0$ from "./http-errors.js";
import * as __1$ from "./deep-equal.js";
var require=n=>{const e=m=>typeof m.default<"u"?m.default:m,c=m=>Object.assign({},m);switch(n){case"http-errors":return e(__0$);case"deep-equal":return e(__1$);default:throw new Error("module \""+n+"\" not found");}};
var m=Object.create;var f=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var k=Object.getOwnPropertyNames;var v=Object.getPrototypeOf,D=Object.prototype.hasOwnProperty;var q=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(e,n)=>(typeof require<"u"?require:e)[n]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+t+'" is not supported')});var S=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),h=(t,e)=>{for(var n in e)f(t,n,{get:e[n],enumerable:!0})},l=(t,e,n,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let u of k(e))!D.call(t,u)&&u!==n&&f(t,u,{get:()=>e[u],enumerable:!(o=x(e,u))||o.enumerable});return t},i=(t,e,n)=>(l(t,e,"default"),n&&l(n,e,"default")),E=(t,e,n)=>(n=t!=null?m(v(t)):{},l(e||!t||!t.__esModule?f(n,"default",{value:t,enumerable:!0}):n,t));var c=S((I,p)=>{var w=q("http-errors"),s=q("deep-equal");p.exports=r;function r(t,e,n,o){if(!t)throw w(e,n,o)}r.fail=function(t,e,n){r(!1,t,e,n)};r.equal=function(t,e,n,o,u){r(t==e,n,o,u)};r.notEqual=function(t,e,n,o,u){r(t!=e,n,o,u)};r.ok=function(t,e,n,o){r(t,e,n,o)};r.strictEqual=function(t,e,n,o,u){r(t===e,n,o,u)};r.notStrictEqual=function(t,e,n,o,u){r(t!==e,n,o,u)};r.deepEqual=function(t,e,n,o,u){r(s(t,e),n,o,u)};r.notDeepEqual=function(t,e,n,o,u){r(!s(t,e),n,o,u)}});var a={};h(a,{deepEqual:()=>B,default:()=>G,equal:()=>g,fail:()=>b,notDeepEqual:()=>C,notEqual:()=>j,notStrictEqual:()=>A,ok:()=>y,strictEqual:()=>z});var _=E(c());i(a,E(c()));var{fail:b,equal:g,notEqual:j,ok:y,strictEqual:z,notStrictEqual:A,deepEqual:B,notDeepEqual:C}=_,{default:d,...F}=_,G=d!==void 0?d:F;export{B as deepEqual,G as default,g as equal,b as fail,C as notDeepEqual,j as notEqual,A as notStrictEqual,y as ok,z as strictEqual};
//# sourceMappingURL=http-assert.mjs.map