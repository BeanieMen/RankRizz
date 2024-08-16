import{r as S,B as E,C,z as T,Y as j,Z as A,$ as O,E as D}from"./CtvG9C47.js";const y=/^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;function R(e,i){if(typeof e!="string")throw new TypeError("argument str must be a string");const t={},a=(i||{}).decode||N;let c=0;for(;c<e.length;){const r=e.indexOf("=",c);if(r===-1)break;let n=e.indexOf(";",c);if(n===-1)n=e.length;else if(n<r){c=e.lastIndexOf(";",r-1)+1;continue}const f=e.slice(c,r).trim();if(t[f]===void 0){let s=e.slice(r+1,n).trim();s.codePointAt(0)===34&&(s=s.slice(1,-1)),t[f]=x(s,a)}c=n+1}return t}function b(e,i,t){const o=t||{},a=o.encode||P;if(typeof a!="function")throw new TypeError("option encode is invalid");if(!y.test(e))throw new TypeError("argument name is invalid");const c=a(i);if(c&&!y.test(c))throw new TypeError("argument val is invalid");let r=e+"="+c;if(o.maxAge!==void 0&&o.maxAge!==null){const n=o.maxAge-0;if(Number.isNaN(n)||!Number.isFinite(n))throw new TypeError("option maxAge is invalid");r+="; Max-Age="+Math.floor(n)}if(o.domain){if(!y.test(o.domain))throw new TypeError("option domain is invalid");r+="; Domain="+o.domain}if(o.path){if(!y.test(o.path))throw new TypeError("option path is invalid");r+="; Path="+o.path}if(o.expires){if(!I(o.expires)||Number.isNaN(o.expires.valueOf()))throw new TypeError("option expires is invalid");r+="; Expires="+o.expires.toUTCString()}if(o.httpOnly&&(r+="; HttpOnly"),o.secure&&(r+="; Secure"),o.priority)switch(typeof o.priority=="string"?o.priority.toLowerCase():o.priority){case"low":{r+="; Priority=Low";break}case"medium":{r+="; Priority=Medium";break}case"high":{r+="; Priority=High";break}default:throw new TypeError("option priority is invalid")}if(o.sameSite)switch(typeof o.sameSite=="string"?o.sameSite.toLowerCase():o.sameSite){case!0:{r+="; SameSite=Strict";break}case"lax":{r+="; SameSite=Lax";break}case"strict":{r+="; SameSite=Strict";break}case"none":{r+="; SameSite=None";break}default:throw new TypeError("option sameSite is invalid")}return o.partitioned&&(r+="; Partitioned"),r}function I(e){return Object.prototype.toString.call(e)==="[object Date]"||e instanceof Date}function x(e,i){try{return i(e)}catch{return e}}function N(e){return e.includes("%")?decodeURIComponent(e):e}function P(e){return encodeURIComponent(e)}function u(e){if(typeof e!="object")return e;var i,t,o=Object.prototype.toString.call(e);if(o==="[object Object]"){if(e.constructor!==Object&&typeof e.constructor=="function"){t=new e.constructor;for(i in e)e.hasOwnProperty(i)&&t[i]!==e[i]&&(t[i]=u(e[i]))}else{t={};for(i in e)i==="__proto__"?Object.defineProperty(t,i,{value:u(e[i]),configurable:!0,enumerable:!0,writable:!0}):t[i]=u(e[i])}return t}if(o==="[object Array]"){for(i=e.length,t=Array(i);i--;)t[i]=u(e[i]);return t}return o==="[object Set]"?(t=new Set,e.forEach(function(a){t.add(u(a))}),t):o==="[object Map]"?(t=new Map,e.forEach(function(a,c){t.set(u(c),u(a))}),t):o==="[object Date]"?new Date(+e):o==="[object RegExp]"?(t=new RegExp(e.source,e.flags),t.lastIndex=e.lastIndex,t):o==="[object DataView]"?new e.constructor(u(e.buffer)):o==="[object ArrayBuffer]"?e.slice(0):o.slice(-6)==="Array]"?new e.constructor(e):e}const M={path:"/",watch:!0,decode:e=>A(decodeURIComponent(e)),encode:e=>encodeURIComponent(typeof e=="string"?e:JSON.stringify(e))},g=window.cookieStore;function z(e,i){var f;const t={...M,...i},o=k(t)||{};let a;t.maxAge!==void 0?a=t.maxAge*1e3:t.expires&&(a=t.expires.getTime()-Date.now());const c=a!==void 0&&a<=0,r=u(c?void 0:o[e]??((f=t.default)==null?void 0:f.call(t))),n=a&&!c?_(r,a,t.watch&&t.watch!=="shallow"):S(r);{let s=null;try{!g&&typeof BroadcastChannel<"u"&&(s=new BroadcastChannel(`nuxt:cookies:${e}`))}catch{}const l=()=>{t.readonly||O(n.value,o[e])||(U(e,n.value,t),o[e]=u(n.value),s==null||s.postMessage({value:t.encode(n.value)}))},p=d=>{var h;const m=d.refresh?(h=k(t))==null?void 0:h[e]:t.decode(d.value);w=!0,o[e]=n.value=m,D(()=>{w=!1})};let w=!1;E()&&C(()=>{w=!0,l(),s==null||s.close()}),g?g.onchange=d=>{const m=d.changed.find(h=>h.name===e);m&&p({value:m.value})}:s&&(s.onmessage=({data:d})=>p(d)),t.watch?T(n,()=>{w||l()},{deep:t.watch!=="shallow"}):l()}return n}function k(e={}){return R(document.cookie,e)}function L(e,i,t={}){return i==null?b(e,i,{...t,maxAge:-1}):b(e,i,t)}function U(e,i,t={}){document.cookie=L(e,i,t)}const v=2147483647;function _(e,i,t){let o,a,c=0;const r=t?S(e):{value:e};return E()&&C(()=>{a==null||a(),clearTimeout(o)}),j((n,f)=>{t&&(a=T(r,f));function s(){c=0,clearTimeout(o);const l=i-c,p=l<v?l:v;o=setTimeout(()=>{if(c+=p,c<i)return s();r.value=void 0,f()},p)}return{get(){return n(),r.value},set(l){s(),r.value=l,f()}}})}export{z as u};
