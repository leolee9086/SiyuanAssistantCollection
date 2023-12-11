/* esm.sh - esbuild bundle(on-finished@2.4.1) es2022 production */
(()=>{var a=typeof Reflect=="object"?Reflect:null,g=a&&typeof a.apply=="function"?a.apply:function(e,t,r){return Function.prototype.apply.call(e,t,r)},p;a&&typeof a.ownKeys=="function"?p=a.ownKeys:Object.getOwnPropertySymbols?p=function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:p=function(e){return Object.getOwnPropertyNames(e)};function D(n){console&&console.warn&&console.warn(n)}var w=Number.isNaN||function(e){return e!==e};function s(){L.call(this)}s.EventEmitter=s;s.prototype._events=void 0;s.prototype._eventsCount=0;s.prototype._maxListeners=void 0;var y=10;function d(n){if(typeof n!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof n)}Object.defineProperty(s,"defaultMaxListeners",{enumerable:!0,get:function(){return y},set:function(n){if(typeof n!="number"||n<0||w(n))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+n+".");y=n}});function L(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0}s.init=L;s.prototype.setMaxListeners=function(e){if(typeof e!="number"||e<0||w(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this};function b(n){return n._maxListeners===void 0?s.defaultMaxListeners:n._maxListeners}s.prototype.getMaxListeners=function(){return b(this)};s.prototype.emit=function(e){for(var t=[],r=1;r<arguments.length;r++)t.push(arguments[r]);var i=e==="error",u=this._events;if(u!==void 0)i=i&&u.error===void 0;else if(!i)return!1;if(i){var o;if(t.length>0&&(o=t[0]),o instanceof Error)throw o;var c=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw c.context=o,c}var l=u[e];if(l===void 0)return!1;if(typeof l=="function")g(l,this,t);else for(var m=l.length,M=x(l,m),r=0;r<m;++r)g(M[r],this,t);return!0};function _(n,e,t,r){var i,u,o;if(d(t),u=n._events,u===void 0?(u=n._events=Object.create(null),n._eventsCount=0):(u.newListener!==void 0&&(n.emit("newListener",e,t.listener?t.listener:t),u=n._events),o=u[e]),o===void 0)o=u[e]=t,++n._eventsCount;else if(typeof o=="function"?o=u[e]=r?[t,o]:[o,t]:r?o.unshift(t):o.push(t),i=b(n),i>0&&o.length>i&&!o.warned){o.warned=!0;var c=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=n,c.type=e,c.count=o.length,D(c)}return n}s.prototype.addListener=function(e,t){return _(this,e,t,!1)};s.prototype.on=s.prototype.addListener;s.prototype.prependListener=function(e,t){return _(this,e,t,!0)};function R(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function E(n,e,t){var r={fired:!1,wrapFn:void 0,target:n,type:e,listener:t},i=R.bind(r);return i.listener=t,r.wrapFn=i,i}s.prototype.once=function(e,t){return d(t),this.on(e,E(this,e,t)),this};s.prototype.prependOnceListener=function(e,t){return d(t),this.prependListener(e,E(this,e,t)),this};s.prototype.removeListener=function(e,t){var r,i,u,o,c;if(d(t),i=this._events,i===void 0)return this;if(r=i[e],r===void 0)return this;if(r===t||r.listener===t)--this._eventsCount===0?this._events=Object.create(null):(delete i[e],i.removeListener&&this.emit("removeListener",e,r.listener||t));else if(typeof r!="function"){for(u=-1,o=r.length-1;o>=0;o--)if(r[o]===t||r[o].listener===t){c=r[o].listener,u=o;break}if(u<0)return this;u===0?r.shift():N(r,u),r.length===1&&(i[e]=r[0]),i.removeListener!==void 0&&this.emit("removeListener",e,c||t)}return this};s.prototype.off=s.prototype.removeListener;s.prototype.removeAllListeners=function(e){var t,r,i;if(r=this._events,r===void 0)return this;if(r.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):r[e]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete r[e]),this;if(arguments.length===0){var u=Object.keys(r),o;for(i=0;i<u.length;++i)o=u[i],o!=="removeListener"&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(t=r[e],typeof t=="function")this.removeListener(e,t);else if(t!==void 0)for(i=t.length-1;i>=0;i--)this.removeListener(e,t[i]);return this};function O(n,e,t){var r=n._events;if(r===void 0)return[];var i=r[e];return i===void 0?[]:typeof i=="function"?t?[i.listener||i]:[i]:t?P(i):x(i,i.length)}s.prototype.listeners=function(e){return O(this,e,!0)};s.prototype.rawListeners=function(e){return O(this,e,!1)};function C(n,e){return typeof n.listenerCount=="function"?n.listenerCount(e):s.prototype.listenerCount.call(n,e)}s.listenerCount=C;s.prototype.listenerCount=function(n){var e=this._events;if(e!==void 0){var t=e[n];if(typeof t=="function")return 1;if(t!==void 0)return t.length}return 0};s.prototype.eventNames=function(){return this._eventsCount>0?p(this._events):[]};function x(n,e){for(var t=new Array(e),r=0;r<e;++r)t[r]=n[r];return t}function N(n,e){for(;e+1<n.length;e++)n[e]=n[e+1];n.pop()}function P(n){for(var e=new Array(n.length),t=0;t<e.length;++t)e[t]=n[t].listener||n[t];return e}function v(n){let e=performance.now(),t=Math.floor(e/1e3),r=Math.floor(e*1e6-t*1e9);if(!n)return[t,r];let[i,u]=n;return[t-i,r-u]}v.bigint=function(){let[n,e]=v();return BigInt(n)*1000000000n+BigInt(e)};var h=class extends s{title="browser";browser=!0;env={};argv=[];pid=0;arch="unknown";platform="browser";version="";versions={};emitWarning=()=>{throw new Error("process.emitWarning is not supported")};binding=()=>{throw new Error("process.binding is not supported")};cwd=()=>{throw new Error("process.cwd is not supported")};chdir=e=>{throw new Error("process.chdir is not supported")};umask=()=>18;nextTick=(e,...t)=>queueMicrotask(()=>e(...t));hrtime=v;constructor(){super()}},f=new h;if(typeof Deno<"u"){f.name="deno",f.browser=!1,f.pid=Deno.pid,f.cwd=()=>Deno.cwd(),f.chdir=e=>Deno.chdir(e),f.arch=Deno.build.arch,f.platform=Deno.build.os,f.version="v18.12.1",f.versions={node:"18.12.1",uv:"1.43.0",zlib:"1.2.11",brotli:"1.0.9",ares:"1.18.1",modules:"108",nghttp2:"1.47.0",napi:"8",llhttp:"6.0.10",openssl:"3.0.7+quic",cldr:"41.0",icu:"71.1",tz:"2022b",unicode:"14.0",ngtcp2:"0.8.1",nghttp3:"0.7.0",...Deno.version},f.env=new Proxy({},{get(e,t){return Deno.env.get(String(t))},ownKeys:()=>Reflect.ownKeys(Deno.env.toObject()),getOwnPropertyDescriptor:(e,t)=>{let r=Deno.env.toObject();if(t in Deno.env.toObject()){let i={enumerable:!0,configurable:!0};return typeof t=="string"&&(i.value=r[t]),i}},set(e,t,r){return Deno.env.set(String(t),String(r)),r}});let n=["","",...Deno.args];Object.defineProperty(n,"0",{get:Deno.execPath}),Object.defineProperty(n,"1",{get:()=>Deno.mainModule.startsWith("file:")?new URL(Deno.mainModule).pathname:join(Deno.cwd(),"$deno$node.js")}),f.argv=n}else{let n="/";f.cwd=()=>n,f.chdir=e=>n=e}var j=f;globalThis.__Process$=j;})();
var __setImmediate$ = (cb, ...args) => setTimeout(cb, 0, ...args);
const __0$ =window.require('async_hooks')// from "/error.js?type=unsupported-node-builtin-module&name=async_hooks&importer=on-finished@2.4.1";
var require=n=>{const e=m=>typeof m.default<"u"?m.default:m,c=m=>Object.assign({},m);switch(n){case"async_hooks":return e(__0$);default:throw new Error("module \""+n+"\" not found");}};
var T=Object.create;var d=Object.defineProperty;var B=Object.getOwnPropertyDescriptor;var E=Object.getOwnPropertyNames;var H=Object.getPrototypeOf,m=Object.prototype.hasOwnProperty;var M=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(n,r)=>(typeof require<"u"?require:n)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')});var b=(e,n)=>()=>(n||e((n={exports:{}}).exports,n),n.exports),z=(e,n)=>{for(var r in n)d(e,r,{get:n[r],enumerable:!0})},h=(e,n,r,o)=>{if(n&&typeof n=="object"||typeof n=="function")for(let t of E(n))!m.call(e,t)&&t!==r&&d(e,t,{get:()=>n[t],enumerable:!(o=B(n,t))||o.enumerable});return e},s=(e,n,r)=>(h(e,n,"default"),r&&h(r,n,"default")),A=(e,n,r)=>(r=e!=null?T(H(e)):{},h(n||!e||!e.__esModule?d(r,"default",{value:e,enumerable:!0}):r,e));var F=b((Z,q)=>{"use strict";q.exports=C;function C(e,n){if(!Array.isArray(e))throw new TypeError("arg must be an array of [ee, events...] arrays");for(var r=[],o=0;o<e.length;o++){var t=e[o];if(!Array.isArray(t)||t.length<2)throw new TypeError("each array member must be [ee, events...]");for(var c=t[0],u=1;u<t.length;u++){var i=t[u],y=D(i,R);c.on(i,y),r.push({ee:c,event:i,fn:y})}}function R(){k(),n.apply(null,arguments)}function k(){for(var f,l=0;l<r.length;l++)f=r[l],f.ee.removeListener(f.event,f.fn)}function _(f){n=f}return _.cancel=k,_}function D(e,n){return function(o){for(var t=new Array(arguments.length),c=this,u=e==="error"?o:null,i=0;i<t.length;i++)t[i]=arguments[i];n(u,c,e,t)}}});var v=b(($,p)=>{"use strict";p.exports=J;p.exports.isFinished=x;var S=Q(),w=F(),G=typeof __setImmediate$=="function"?__setImmediate$:function(e){__Process$.nextTick(e.bind.apply(e,arguments))};function J(e,n){return x(e)!==!1?(G(n,null,e),e):(N(e,U(n)),e)}function x(e){var n=e.socket;if(typeof e.finished=="boolean")return!!(e.finished||n&&!n.writable);if(typeof e.complete=="boolean")return!!(e.upgrade||!n||!n.readable||e.complete&&!e.readable)}function K(e,n){var r,o,t=!1;function c(i){r.cancel(),o.cancel(),t=!0,n(i)}r=o=w([[e,"end","finish"]],c);function u(i){e.removeListener("socket",u),!t&&r===o&&(o=w([[i,"error","close"]],c))}if(e.socket){u(e.socket);return}e.on("socket",u),e.socket===void 0&&P(e,u)}function N(e,n){var r=e.__onFinished;(!r||!r.queue)&&(r=e.__onFinished=O(e),K(e,r)),r.queue.push(n)}function O(e){function n(r){if(e.__onFinished===n&&(e.__onFinished=null),!!n.queue){var o=n.queue;n.queue=null;for(var t=0;t<o.length;t++)o[t](r,e)}}return n.queue=[],n}function P(e,n){var r=e.assignSocket;typeof r=="function"&&(e.assignSocket=function(t){r.call(this,t),n(t)})}function Q(){try{return M("async_hooks")}catch{return{}}}function U(e){var n;return S.AsyncResource&&(n=new S.AsyncResource(e.name||"bound-anonymous-fn")),!n||!n.runInAsyncScope?e:n.runInAsyncScope.bind(n,e,null)}});var a={};z(a,{default:()=>X,isFinished:()=>V});var I=A(v());s(a,A(v()));var{isFinished:V}=I,{default:L,...W}=I,X=L!==void 0?L:W;export{X as default,V as isFinished};
/*! Bundled license information:

ee-first/index.js:
  (*!
   * ee-first
   * Copyright(c) 2014 Jonathan Ong
   * MIT Licensed
   *)

on-finished/index.js:
  (*!
   * on-finished
   * Copyright(c) 2013 Jonathan Ong
   * Copyright(c) 2014 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
//# sourceMappingURL=on-finished.bundle.mjs.map