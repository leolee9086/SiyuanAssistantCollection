/* esm.sh - esbuild bundle(destroy@1.2.0) es2022 production */
import * as __0$ from "./node_events.js";
const __1$ =window.require("fs");

const __2$ =window.require('stream')
const __3$ =window.require('zlib')
var require=n=>{const e=m=>typeof m.default<"u"?m.default:m,c=m=>Object.assign({},m);switch(n){case"events":return e(__0$);case"fs":return e(__1$);case"stream":return e(__2$);case"zlib":return e(__3$);default:throw new Error("module \""+n+"\" not found");}};
var b=Object.create;var u=Object.defineProperty;var v=Object.getOwnPropertyDescriptor;var S=Object.getOwnPropertyNames;var g=Object.getPrototypeOf,h=Object.prototype.hasOwnProperty;var c=(n=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(n,{get:(e,i)=>(typeof require<"u"?require:e)[i]}):n)(function(n){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+n+'" is not supported')});var E=(n,e)=>()=>(e||n((e={exports:{}}).exports,e),e.exports),R=(n,e)=>{for(var i in e)u(n,i,{get:e[i],enumerable:!0})},d=(n,e,i,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of S(e))!h.call(n,r)&&r!==i&&u(n,r,{get:()=>e[r],enumerable:!(s=v(e,r))||s.enumerable});return n},f=(n,e,i)=>(d(n,e,"default"),i&&d(i,e,"default")),y=(n,e,i)=>(i=n!=null?b(g(n)):{},d(e||!n||!n.__esModule?u(i,"default",{value:n,enumerable:!0}):i,n));var l=E((k,p)=>{"use strict";var D=c("events").EventEmitter,q=c("fs").ReadStream,_=c("stream"),o=c("zlib");p.exports=Z;function Z(n,e){return I(n)?x(n):L(n)?w(n):C(n)&&n.destroy(),G(n)&&e&&(n.removeAllListeners("error"),n.addListener("error",A)),n}function x(n){n.destroy(),typeof n.close=="function"&&n.on("open",F)}function z(n){if(n._hadError===!0){var e=n._binding===null?"_binding":"_handle";n[e]={close:function(){this[e]=null}}}n.close()}function w(n){typeof n.destroy=="function"?n._binding?(n.destroy(),n._processing?(n._needDrain=!0,n.once("drain",B)):n._binding.clear()):n._destroy&&n._destroy!==_.Transform.prototype._destroy?n.destroy():n._destroy&&typeof n.close=="function"?(n.destroyed=!0,n.close()):n.destroy():typeof n.close=="function"&&z(n)}function C(n){return n instanceof _&&typeof n.destroy=="function"}function G(n){return n instanceof D}function I(n){return n instanceof q}function L(n){return n instanceof o.Gzip||n instanceof o.Gunzip||n instanceof o.Deflate||n instanceof o.DeflateRaw||n instanceof o.Inflate||n instanceof o.InflateRaw||n instanceof o.Unzip}function A(){}function B(){this._binding.clear()}function F(){typeof this.fd=="number"&&this.close()}});var t={};R(t,{default:()=>U});var O=y(l());f(t,y(l()));var{default:a,...T}=O,U=a!==void 0?a:T;export{U as default};
/*! Bundled license information:

destroy/index.js:
  (*!
   * destroy
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015-2022 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
//# sourceMappingURL=destroy.bundle.mjs.map