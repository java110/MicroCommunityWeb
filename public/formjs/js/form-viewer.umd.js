/**
 * 云尚小区管理系统作者 吴学文（mail:928255095@qq.com） 对原有的https://bpmn.io 的 formjs 框架做了 相应修改 主要修改如下：
 * 加入 多行文本框，时间组件，日期组件，部分汉化功能
 * 
 * 云尚小区管理系统官方尊重作者的贡献未去除bpmn 版权信息，如果您想去除请先联系 bpmn作者，经作者同意后，可以在1758行去除bpmn版权，
 * 在未经作者允许的情况下去除bpmn版权造成的侵权问题，HC小区管理系统将不会承担任何责任，由去除版权的公司或者个人承担相应的责任！
 * 
 * 版权归 https://bpmn.io/ 所有，非常感谢bpmn.io 提供这么优秀的框架
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FormViewer = {}));
  }(this, (function (exports) { 'use strict';
  
    /**
     * Flatten array, one level deep.
     *
     * @param {Array<?>} arr
     *
     * @return {Array<?>}
     */
  
    var nativeToString = Object.prototype.toString;
    var nativeHasOwnProperty = Object.prototype.hasOwnProperty;
    function isUndefined(obj) {
      return obj === undefined;
    }
    function isDefined(obj) {
      return obj !== undefined;
    }
    function isNil(obj) {
      return obj == null;
    }
    function isArray(obj) {
      return nativeToString.call(obj) === '[object Array]';
    }
    function isNumber(obj) {
      return nativeToString.call(obj) === '[object Number]';
    }
    function isFunction(obj) {
      var tag = nativeToString.call(obj);
      return tag === '[object Function]' || tag === '[object AsyncFunction]' || tag === '[object GeneratorFunction]' || tag === '[object AsyncGeneratorFunction]' || tag === '[object Proxy]';
    }
    function isString(obj) {
      return nativeToString.call(obj) === '[object String]';
    }
    /**
     * Return true, if target owns a property with the given key.
     *
     * @param {Object} target
     * @param {String} key
     *
     * @return {Boolean}
     */
  
    function has(target, key) {
      return nativeHasOwnProperty.call(target, key);
    }
    /**
     * Iterate over collection; returning something
     * (non-undefined) will stop iteration.
     *
     * @param  {Array|Object} collection
     * @param  {Function} iterator
     *
     * @return {Object} return result that stopped the iteration
     */
  
    function forEach(collection, iterator) {
      var val, result;
  
      if (isUndefined(collection)) {
        return;
      }
  
      var convertKey = isArray(collection) ? toNum : identity;
  
      for (var key in collection) {
        if (has(collection, key)) {
          val = collection[key];
          result = iterator(val, convertKey(key));
  
          if (result === false) {
            return val;
          }
        }
      }
    }
  
    function identity(arg) {
      return arg;
    }
  
    function toNum(arg) {
      return Number(arg);
    }
    /**
     * Bind function against target <this>.
     *
     * @param  {Function} fn
     * @param  {Object}   target
     *
     * @return {Function} bound function
     */
  
    function bind(fn, target) {
      return fn.bind(target);
    }
  
    function _extends() {
      _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
  
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
  
        return target;
      };
  
      return _extends.apply(this, arguments);
    }
  
    /**
     * Convenience wrapper for `Object.assign`.
     *
     * @param {Object} target
     * @param {...Object} others
     *
     * @return {Object} the target
     */
  
    function assign(target) {
      for (var _len = arguments.length, others = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        others[_key - 1] = arguments[_key];
      }
  
      return _extends.apply(void 0, [target].concat(others));
    }
    /**
     * Sets a nested property of a given object to the specified value.
     *
     * This mutates the object and returns it.
     *
     * @param {Object} target The target of the set operation.
     * @param {(string|number)[]} path The path to the nested value.
     * @param {any} value The value to set.
     */
  
    function set(target, path, value) {
      var currentTarget = target;
      forEach(path, function (key, idx) {
        if (key === '__proto__') {
          throw new Error('illegal key: __proto__');
        }
  
        var nextKey = path[idx + 1];
        var nextTarget = currentTarget[key];
  
        if (isDefined(nextKey) && isNil(nextTarget)) {
          nextTarget = currentTarget[key] = isNaN(+nextKey) ? {} : [];
        }
  
        if (isUndefined(nextKey)) {
          if (isUndefined(value)) {
            delete currentTarget[key];
          } else {
            currentTarget[key] = value;
          }
        } else {
          currentTarget = nextTarget;
        }
      });
      return target;
    }
    /**
     * Gets a nested property of a given object.
     *
     * @param {Object} target The target of the get operation.
     * @param {(string|number)[]} path The path to the nested value.
     * @param {any} [defaultValue] The value to return if no value exists.
     */
  
    function get(target, path, defaultValue) {
      var currentTarget = target;
      forEach(path, function (key) {
        // accessing nil property yields <undefined>
        if (isNil(currentTarget)) {
          currentTarget = undefined;
          return false;
        }
  
        currentTarget = currentTarget[key];
      });
      return isUndefined(currentTarget) ? defaultValue : currentTarget;
    }
  
    var e={"":["<em>","</em>"],_:["<strong>","</strong>"],"*":["<strong>","</strong>"],"~":["<s>","</s>"],"\n":["<br />"]," ":["<br />"],"-":["<hr />"]};function n(e){return e.replace(RegExp("^"+(e.match(/^(\t| )+/)||"")[0],"gm"),"")}function r(e){return (e+"").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function t(a,c){var o,l,g,s,p,u=/((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^``` *(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:!\[([^\]]*?)\]\(([^)]+?)\))|(\[)|(\](?:\(([^)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*]|~~)/gm,m=[],h="",i=c||{},d=0;function f(n){var r=e[n[1]||""],t=m[m.length-1]==n;return r?r[1]?(t?m.pop():m.push(n),r[0|t]):r[0]:n}function $(){for(var e="";m.length;)e+=f(m[m.length-1]);return e}for(a=a.replace(/^\[(.+?)\]:\s*(.+)$/gm,function(e,n,r){return i[n.toLowerCase()]=r,""}).replace(/^\n+|\n+$/g,"");g=u.exec(a);)l=a.substring(d,g.index),d=u.lastIndex,o=g[0],l.match(/[^\\](\\\\)*\\$/)||((p=g[3]||g[4])?o='<pre class="code '+(g[4]?"poetry":g[2].toLowerCase())+'"><code'+(g[2]?' class="language-'+g[2].toLowerCase()+'"':"")+">"+n(r(p).replace(/^\n+|\n+$/g,""))+"</code></pre>":(p=g[6])?(p.match(/\./)&&(g[5]=g[5].replace(/^\d+/gm,"")),s=t(n(g[5].replace(/^\s*[>*+.-]/gm,""))),">"==p?p="blockquote":(p=p.match(/\./)?"ol":"ul",s=s.replace(/^(.*)(\n|$)/gm,"<li>$1</li>")),o="<"+p+">"+s+"</"+p+">"):g[8]?o='<img src="'+r(g[8])+'" alt="'+r(g[7])+'">':g[10]?(h=h.replace("<a>",'<a href="'+r(g[11]||i[l.toLowerCase()])+'">'),o=$()+"</a>"):g[9]?o="<a>":g[12]||g[14]?o="<"+(p="h"+(g[14]?g[14].length:g[13]>"="?1:2))+">"+t(g[12]||g[15],i)+"</"+p+">":g[16]?o="<code>"+r(g[16])+"</code>":(g[17]||g[1])&&(o=f(g[17]||"--"))),h+=l,h+=o;return (h+a.substring(d)+$()).replace(/^\n+|\n+$/g,"")}
  
    var n$1,u,i,t$1,r$1,o={},f=[],e$1=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function c(n,l){for(var u in l)n[u]=l[u];return n}function s(n){var l=n.parentNode;l&&l.removeChild(n);}function a(n,l,u){var i,t,r,o=arguments,f={};for(r in l)"key"==r?i=l[r]:"ref"==r?t=l[r]:f[r]=l[r];if(arguments.length>3)for(u=[u],r=3;r<arguments.length;r++)u.push(o[r]);if(null!=u&&(f.children=u),"function"==typeof n&&null!=n.defaultProps)for(r in n.defaultProps)void 0===f[r]&&(f[r]=n.defaultProps[r]);return v(n,f,i,t,null)}function v(l,u,i,t,r){var o={type:l,props:u,key:i,ref:t,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++n$1.__v:r};return null!=n$1.vnode&&n$1.vnode(o),o}function y(n){return n.children}function p(n,l){this.props=n,this.context=l;}function d(n,l){if(null==l)return n.__?d(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?d(n):null}function _(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return _(n)}}function k(l){(!l.__d&&(l.__d=!0)&&u.push(l)&&!m.__r++||t$1!==n$1.debounceRendering)&&((t$1=n$1.debounceRendering)||i)(m);}function m(){for(var n;m.__r=u.length;)n=u.sort(function(n,l){return n.__v.__b-l.__v.__b}),u=[],n.some(function(n){var l,u,i,t,r,o;n.__d&&(r=(t=(l=n).__v).__e,(o=l.__P)&&(u=[],(i=c({},t)).__v=t.__v+1,T(o,t,i,l.__n,void 0!==o.ownerSVGElement,null!=t.__h?[r]:null,u,null==r?d(t):r,t.__h),j(u,t),t.__e!=r&&_(t)));});}function b(n,l,u,i,t,r,e,c,s,a){var h,p,_,k,m,b,w,A=i&&i.__k||f,P=A.length;for(u.__k=[],h=0;h<l.length;h++)if(null!=(k=u.__k[h]=null==(k=l[h])||"boolean"==typeof k?null:"string"==typeof k||"number"==typeof k?v(null,k,null,null,k):Array.isArray(k)?v(y,{children:k},null,null,null):k.__b>0?v(k.type,k.props,k.key,null,k.__v):k)){if(k.__=u,k.__b=u.__b+1,null===(_=A[h])||_&&k.key==_.key&&k.type===_.type)A[h]=void 0;else for(p=0;p<P;p++){if((_=A[p])&&k.key==_.key&&k.type===_.type){A[p]=void 0;break}_=null;}T(n,k,_=_||o,t,r,e,c,s,a),m=k.__e,(p=k.ref)&&_.ref!=p&&(w||(w=[]),_.ref&&w.push(_.ref,null,k),w.push(p,k.__c||m,k)),null!=m?(null==b&&(b=m),"function"==typeof k.type&&null!=k.__k&&k.__k===_.__k?k.__d=s=g(k,s,n):s=x(n,k,_,A,m,s),a||"option"!==u.type?"function"==typeof u.type&&(u.__d=s):n.value=""):s&&_.__e==s&&s.parentNode!=n&&(s=d(_));}for(u.__e=b,h=P;h--;)null!=A[h]&&("function"==typeof u.type&&null!=A[h].__e&&A[h].__e==u.__d&&(u.__d=d(i,h+1)),L(A[h],A[h]));if(w)for(h=0;h<w.length;h++)I(w[h],w[++h],w[++h]);}function g(n,l,u){var i,t;for(i=0;i<n.__k.length;i++)(t=n.__k[i])&&(t.__=n,l="function"==typeof t.type?g(t,l,u):x(u,t,t,n.__k,t.__e,l));return l}function w(n,l){return l=l||[],null==n||"boolean"==typeof n||(Array.isArray(n)?n.some(function(n){w(n,l);}):l.push(n)),l}function x(n,l,u,i,t,r){var o,f,e;if(void 0!==l.__d)o=l.__d,l.__d=void 0;else if(null==u||t!=r||null==t.parentNode)n:if(null==r||r.parentNode!==n)n.appendChild(t),o=null;else {for(f=r,e=0;(f=f.nextSibling)&&e<i.length;e+=2)if(f==t)break n;n.insertBefore(t,r),o=r;}return void 0!==o?o:t.nextSibling}function A(n,l,u,i,t){var r;for(r in u)"children"===r||"key"===r||r in l||C(n,r,null,u[r],i);for(r in l)t&&"function"!=typeof l[r]||"children"===r||"key"===r||"value"===r||"checked"===r||u[r]===l[r]||C(n,r,l[r],u[r],i);}function P(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||e$1.test(l)?u:u+"px";}function C(n,l,u,i,t){var r;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else {if("string"==typeof i&&(n.style.cssText=i=""),i)for(l in i)u&&l in u||P(n.style,l,"");if(u)for(l in u)i&&u[l]===i[l]||P(n.style,l,u[l]);}else if("o"===l[0]&&"n"===l[1])r=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+r]=u,u?i||n.addEventListener(l,r?H:$,r):n.removeEventListener(l,r?H:$,r);else if("dangerouslySetInnerHTML"!==l){if(t)l=l.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==l&&"list"!==l&&"form"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null!=u&&(!1!==u||"a"===l[0]&&"r"===l[1])?n.setAttribute(l,u):n.removeAttribute(l));}}function $(l){this.l[l.type+!1](n$1.event?n$1.event(l):l);}function H(l){this.l[l.type+!0](n$1.event?n$1.event(l):l);}function T(l,u,i,t,r,o,f,e,s){var a,v,h,d,_,k,m,g,w,x,A,P=u.type;if(void 0!==u.constructor)return null;null!=i.__h&&(s=i.__h,e=u.__e=i.__e,u.__h=null,o=[e]),(a=n$1.__b)&&a(u);try{n:if("function"==typeof P){if(g=u.props,w=(a=P.contextType)&&t[a.__c],x=a?w?w.props.value:a.__:t,i.__c?m=(v=u.__c=i.__c).__=v.__E:("prototype"in P&&P.prototype.render?u.__c=v=new P(g,x):(u.__c=v=new p(g,x),v.constructor=P,v.render=M),w&&w.sub(v),v.props=g,v.state||(v.state={}),v.context=x,v.__n=t,h=v.__d=!0,v.__h=[]),null==v.__s&&(v.__s=v.state),null!=P.getDerivedStateFromProps&&(v.__s==v.state&&(v.__s=c({},v.__s)),c(v.__s,P.getDerivedStateFromProps(g,v.__s))),d=v.props,_=v.state,h)null==P.getDerivedStateFromProps&&null!=v.componentWillMount&&v.componentWillMount(),null!=v.componentDidMount&&v.__h.push(v.componentDidMount);else {if(null==P.getDerivedStateFromProps&&g!==d&&null!=v.componentWillReceiveProps&&v.componentWillReceiveProps(g,x),!v.__e&&null!=v.shouldComponentUpdate&&!1===v.shouldComponentUpdate(g,v.__s,x)||u.__v===i.__v){v.props=g,v.state=v.__s,u.__v!==i.__v&&(v.__d=!1),v.__v=u,u.__e=i.__e,u.__k=i.__k,v.__h.length&&f.push(v);break n}null!=v.componentWillUpdate&&v.componentWillUpdate(g,v.__s,x),null!=v.componentDidUpdate&&v.__h.push(function(){v.componentDidUpdate(d,_,k);});}v.context=x,v.props=g,v.state=v.__s,(a=n$1.__r)&&a(u),v.__d=!1,v.__v=u,v.__P=l,a=v.render(v.props,v.state,v.context),v.state=v.__s,null!=v.getChildContext&&(t=c(c({},t),v.getChildContext())),h||null==v.getSnapshotBeforeUpdate||(k=v.getSnapshotBeforeUpdate(d,_)),A=null!=a&&a.type===y&&null==a.key?a.props.children:a,b(l,Array.isArray(A)?A:[A],u,i,t,r,o,f,e,s),v.base=u.__e,u.__h=null,v.__h.length&&f.push(v),m&&(v.__E=v.__=null),v.__e=!1;}else null==o&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=z(i.__e,u,i,t,r,o,f,s);(a=n$1.diffed)&&a(u);}catch(l){u.__v=null,(s||null!=o)&&(u.__e=e,u.__h=!!s,o[o.indexOf(e)]=null),n$1.__e(l,u,i);}}function j(l,u){n$1.__c&&n$1.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u);});}catch(l){n$1.__e(l,u.__v);}});}function z(n,l,u,i,t,r,e,c){var a,v,h,y,p=u.props,d=l.props,_=l.type,k=0;if("svg"===_&&(t=!0),null!=r)for(;k<r.length;k++)if((a=r[k])&&(a===n||(_?a.localName==_:3==a.nodeType))){n=a,r[k]=null;break}if(null==n){if(null===_)return document.createTextNode(d);n=t?document.createElementNS("http://www.w3.org/2000/svg",_):document.createElement(_,d.is&&d),r=null,c=!1;}if(null===_)p===d||c&&n.data===d||(n.data=d);else {if(r=r&&f.slice.call(n.childNodes),v=(p=u.props||o).dangerouslySetInnerHTML,h=d.dangerouslySetInnerHTML,!c){if(null!=r)for(p={},y=0;y<n.attributes.length;y++)p[n.attributes[y].name]=n.attributes[y].value;(h||v)&&(h&&(v&&h.__html==v.__html||h.__html===n.innerHTML)||(n.innerHTML=h&&h.__html||""));}if(A(n,d,p,t,c),h)l.__k=[];else if(k=l.props.children,b(n,Array.isArray(k)?k:[k],l,u,i,t&&"foreignObject"!==_,r,e,n.firstChild,c),null!=r)for(k=r.length;k--;)null!=r[k]&&s(r[k]);c||("value"in d&&void 0!==(k=d.value)&&(k!==n.value||"progress"===_&&!k)&&C(n,"value",k,p.value,!1),"checked"in d&&void 0!==(k=d.checked)&&k!==n.checked&&C(n,"checked",k,p.checked,!1));}return n}function I(l,u,i){try{"function"==typeof l?l(u):l.current=u;}catch(l){n$1.__e(l,i);}}function L(l,u,i){var t,r,o;if(n$1.unmount&&n$1.unmount(l),(t=l.ref)&&(t.current&&t.current!==l.__e||I(t,null,u)),i||"function"==typeof l.type||(i=null!=(r=l.__e)),l.__e=l.__d=void 0,null!=(t=l.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount();}catch(l){n$1.__e(l,u);}t.base=t.__P=null;}if(t=l.__k)for(o=0;o<t.length;o++)t[o]&&L(t[o],u,i);null!=r&&s(r);}function M(n,l,u){return this.constructor(n,u)}function N(l,u,i){var t,r,e;n$1.__&&n$1.__(l,u),r=(t="function"==typeof i)?null:i&&i.__k||u.__k,e=[],T(u,l=(!t&&i||u).__k=a(y,null,[l]),r||o,o,void 0!==u.ownerSVGElement,!t&&i?[i]:r?null:u.firstChild?f.slice.call(u.childNodes):null,e,!t&&i?i:r?r.__e:u.firstChild,t),j(e,l);}function q(n,l){var u={__c:l="__cC"+r$1++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,i;return this.getChildContext||(u=[],(i={})[l]=this,this.getChildContext=function(){return i},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(k);},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n);};}),n.children}};return u.Provider.__=u.Consumer.contextType=u}n$1={__e:function(n,l){for(var u,i,t;l=l.__;)if((u=l.__c)&&!u.__)try{if((i=u.constructor)&&null!=i.getDerivedStateFromError&&(u.setState(i.getDerivedStateFromError(n)),t=u.__d),null!=u.componentDidCatch&&(u.componentDidCatch(n),t=u.__d),t)return u.__E=u}catch(l){n=l;}throw n},__v:0},p.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=c({},this.state),"function"==typeof n&&(n=n(c({},u),this.props)),n&&c(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),k(this));},p.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),k(this));},p.prototype.render=y,u=[],i="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,m.__r=0,r$1=0;
  
    function o$1(_,o,e,n,t){var f={};for(var l in o)"ref"!=l&&(f[l]=o[l]);var s,u,a={type:_,props:f,key:e,ref:o&&o.ref,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:++n$1.__v,__source:n,__self:t};if("function"==typeof _&&(s=_.defaultProps))for(u in s)void 0===f[u]&&(f[u]=s[u]);return n$1.vnode&&n$1.vnode(a),a}
  
    var t$2,u$1,r$2,o$2=0,i$1=[],c$1=n$1.__b,f$1=n$1.__r,e$2=n$1.diffed,a$1=n$1.__c,v$1=n$1.unmount;function m$1(t,r){n$1.__h&&n$1.__h(u$1,t,o$2||r),o$2=0;var i=u$1.__H||(u$1.__H={__:[],__h:[]});return t>=i.__.length&&i.__.push({}),i.__[t]}function l(n){return o$2=1,p$1(w$1,n)}function p$1(n,r,o){var i=m$1(t$2++,2);return i.t=n,i.__c||(i.__=[o?o(r):w$1(void 0,r),function(n){var t=i.t(i.__[0],n);i.__[0]!==t&&(i.__=[t,i.__[1]],i.__c.setState({}));}],i.__c=u$1),i.__}function d$1(n,u){var r=m$1(t$2++,7);return k$1(r.__H,u)&&(r.__=n(),r.__H=u,r.__h=n),r.__}function A$1(n,t){return o$2=8,d$1(function(){return n},t)}function F(n){var r=u$1.context[n.__c],o=m$1(t$2++,9);return o.__c=n,r?(null==o.__&&(o.__=!0,r.sub(u$1)),r.props.value):n.__}function x$1(){i$1.forEach(function(t){if(t.__P)try{t.__H.__h.forEach(g$1),t.__H.__h.forEach(j$1),t.__H.__h=[];}catch(u){t.__H.__h=[],n$1.__e(u,t.__v);}}),i$1=[];}n$1.__b=function(n){u$1=null,c$1&&c$1(n);},n$1.__r=function(n){f$1&&f$1(n),t$2=0;var r=(u$1=n.__c).__H;r&&(r.__h.forEach(g$1),r.__h.forEach(j$1),r.__h=[]);},n$1.diffed=function(t){e$2&&e$2(t);var o=t.__c;o&&o.__H&&o.__H.__h.length&&(1!==i$1.push(o)&&r$2===n$1.requestAnimationFrame||((r$2=n$1.requestAnimationFrame)||function(n){var t,u=function(){clearTimeout(r),b$1&&cancelAnimationFrame(t),setTimeout(n);},r=setTimeout(u,100);b$1&&(t=requestAnimationFrame(u));})(x$1)),u$1=void 0;},n$1.__c=function(t,u){u.some(function(t){try{t.__h.forEach(g$1),t.__h=t.__h.filter(function(n){return !n.__||j$1(n)});}catch(r){u.some(function(n){n.__h&&(n.__h=[]);}),u=[],n$1.__e(r,t.__v);}}),a$1&&a$1(t,u);},n$1.unmount=function(t){v$1&&v$1(t);var u=t.__c;if(u&&u.__H)try{u.__H.__.forEach(g$1);}catch(t){n$1.__e(t,u.__v);}};var b$1="function"==typeof requestAnimationFrame;function g$1(n){var t=u$1;"function"==typeof n.__c&&n.__c(),u$1=t;}function j$1(n){var t=u$1;n.__c=n.__(),u$1=t;}function k$1(n,t){return !n||n.length!==t.length||t.some(function(t,u){return t!==n[u]})}function w$1(n,t){return "function"==typeof t?t(n):t}
  
    var e$3,o$3={};function n$2(r,t,e){if(3===r.nodeType){var o="textContent"in r?r.textContent:r.nodeValue||"";if(!1!==n$2.options.trim){var a=0===t||t===e.length-1;if((!(o=o.match(/^[\s\n]+$/g)&&"all"!==n$2.options.trim?" ":o.replace(/(^[\s\n]+|[\s\n]+$)/g,"all"===n$2.options.trim||a?"":" "))||" "===o)&&e.length>1&&a)return null}return o}if(1!==r.nodeType)return null;var p=String(r.nodeName).toLowerCase();if("script"===p&&!n$2.options.allowScripts)return null;var l,s,u=n$2.h(p,function(r){var t=r&&r.length;if(!t)return null;for(var e={},o=0;o<t;o++){var a=r[o],i=a.name,p=a.value;"on"===i.substring(0,2)&&n$2.options.allowEvents&&(p=new Function(p)),e[i]=p;}return e}(r.attributes),(s=(l=r.childNodes)&&Array.prototype.map.call(l,n$2).filter(i$2))&&s.length?s:null);return n$2.visitor&&n$2.visitor(u),u}var a$2,i$2=function(r){return r},p$2={};function l$1(r){var t=(r.type||"").toLowerCase(),e=l$1.map;e&&e.hasOwnProperty(t)?(r.type=e[t],r.props=Object.keys(r.props||{}).reduce(function(t,e){var o;return t[(o=e,o.replace(/-(.)/g,function(r,t){return t.toUpperCase()}))]=r.props[e],t},{})):r.type=t.replace(/[^a-z0-9-]/i,"");}var Markup = (function(t){function i(){t.apply(this,arguments);}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i.setReviver=function(r){a$2=r;},i.prototype.shouldComponentUpdate=function(r){var t=this.props;return r.wrap!==t.wrap||r.type!==t.type||r.markup!==t.markup},i.prototype.setComponents=function(r){if(this.map={},r)for(var t in r)if(r.hasOwnProperty(t)){var e=t.replace(/([A-Z]+)([A-Z][a-z0-9])|([a-z0-9]+)([A-Z])/g,"$1$3-$2$4").toLowerCase();this.map[e]=r[t];}},i.prototype.render=function(t){var i=t.wrap;void 0===i&&(i=!0);var s,u=t.type,c=t.markup,m=t.components,v=t.reviver,f=t.onError,d=t["allow-scripts"],h=t["allow-events"],y=t.trim,w=function(r,t){var e={};for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&-1===t.indexOf(o)&&(e[o]=r[o]);return e}(t,["wrap","type","markup","components","reviver","onError","allow-scripts","allow-events","trim"]),C=v||this.reviver||this.constructor.prototype.reviver||a$2||a;this.setComponents(m);var g={allowScripts:d,allowEvents:h,trim:y};try{s=function(r,t,a,i,s){var u=function(r,t){var o,n,a,i,p="html"===t?"text/html":"application/xml";"html"===t?(i="body",a="<!DOCTYPE html>\n<html><body>"+r+"</body></html>"):(i="xml",a='<?xml version="1.0" encoding="UTF-8"?>\n<xml>'+r+"</xml>");try{o=(new DOMParser).parseFromString(a,p);}catch(r){n=r;}if(o||"html"!==t||((o=e$3||(e$3=function(){if(document.implementation&&document.implementation.createHTMLDocument)return document.implementation.createHTMLDocument("");var r=document.createElement("iframe");return r.style.cssText="position:absolute; left:0; top:-999em; width:1px; height:1px; overflow:hidden;",r.setAttribute("sandbox","allow-forms"),document.body.appendChild(r),r.contentWindow.document}())).open(),o.write(a),o.close()),o){var l=o.getElementsByTagName(i)[0],s=l.firstChild;return r&&!s&&(l.error="Document parse failed."),s&&"parsererror"===String(s.nodeName).toLowerCase()&&(s.removeChild(s.firstChild),s.removeChild(s.lastChild),l.error=s.textContent||s.nodeValue||n||"Unknown error",l.removeChild(s)),l}}(r,t);if(u&&u.error)throw new Error(u.error);var c=u&&u.body||u;l$1.map=i||p$2;var m=c&&function(r,t,e,a){return n$2.visitor=t,n$2.h=e,n$2.options=a||o$3,n$2(r)}(c,l$1,a,s);return l$1.map=null,m&&m.props&&m.props.children||null}(c,u,C,this.map,g);}catch(r){f?f({error:r}):"undefined"!=typeof console&&console.error&&console.error("preact-markup: "+r);}if(!1===i)return s||null;var x=w.hasOwnProperty("className")?"className":"class",b=w[x];return b?b.splice?b.splice(0,0,"markup"):"string"==typeof b?w[x]+=" markup":"object"==typeof b&&(b.markup=!0):w[x]="markup",C("div",w,s||null)},i}(p));
  
    function C$1(n,t){for(var e in t)n[e]=t[e];return n}function S(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}function E(n){this.props=n;}(E.prototype=new p).isPureReactComponent=!0,E.prototype.shouldComponentUpdate=function(n,t){return S(this.props,n)||S(this.state,t)};var w$2=n$1.__b;n$1.__b=function(n){n.type&&n.type.__f&&n.ref&&(n.props.ref=n.ref,n.ref=null),w$2&&w$2(n);};var A$2=n$1.__e;function O(){this.__u=0,this.t=null,this.__b=null;}function L$1(n){var t=n.__.__c;return t&&t.__e&&t.__e(n)}function D(){this.u=null,this.o=null;}n$1.__e=function(n,t,e){if(n.then)for(var r,u=t;u=u.__;)if((r=u.__c)&&r.__c)return null==t.__e&&(t.__e=e.__e,t.__k=e.__k),r.__c(n,t);A$2(n,t,e);},(O.prototype=new p).__c=function(n,t){var e=t.__c,r=this;null==r.t&&(r.t=[]),r.t.push(e);var u=L$1(r.__v),o=!1,i=function(){o||(o=!0,e.componentWillUnmount=e.__c,u?u(l):l());};e.__c=e.componentWillUnmount,e.componentWillUnmount=function(){i(),e.__c&&e.__c();};var l=function(){if(!--r.__u){if(r.state.__e){var n=r.state.__e;r.__v.__k[0]=function n(t,e,r){return t&&(t.__v=null,t.__k=t.__k&&t.__k.map(function(t){return n(t,e,r)}),t.__c&&t.__c.__P===e&&(t.__e&&r.insertBefore(t.__e,t.__d),t.__c.__e=!0,t.__c.__P=r)),t}(n,n.__c.__P,n.__c.__O);}var t;for(r.setState({__e:r.__b=null});t=r.t.pop();)t.forceUpdate();}},f=!0===t.__h;r.__u++||f||r.setState({__e:r.__b=r.__v.__k[0]}),n.then(i,i);},O.prototype.componentWillUnmount=function(){this.t=[];},O.prototype.render=function(n,t){if(this.__b){if(this.__v.__k){var e=document.createElement("div"),r=this.__v.__k[0].__c;this.__v.__k[0]=function n(t,e,r){return t&&(t.__c&&t.__c.__H&&(t.__c.__H.__.forEach(function(n){"function"==typeof n.__c&&n.__c();}),t.__c.__H=null),null!=(t=C$1({},t)).__c&&(t.__c.__P===r&&(t.__c.__P=e),t.__c=null),t.__k=t.__k&&t.__k.map(function(t){return n(t,e,r)})),t}(this.__b,e,r.__O=r.__P);}this.__b=null;}var u=t.__e&&a(y,null,n.fallback);return u&&(u.__h=null),[a(y,null,t.__e?null:n.children),u]};var F$1=function(n,t,e){if(++e[1]===e[0]&&n.o.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.o.size))for(e=n.u;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.u=e=e[2];}};function M$1(n){return this.getChildContext=function(){return n.context},n.children}function T$1(n){var t=this,e=n.i;t.componentWillUnmount=function(){N(null,t.l),t.l=null,t.i=null;},t.i&&t.i!==e&&t.componentWillUnmount(),n.__v?(t.l||(t.i=e,t.l={nodeType:1,parentNode:e,childNodes:[],appendChild:function(n){this.childNodes.push(n),t.i.appendChild(n);},insertBefore:function(n,e){this.childNodes.push(n),t.i.appendChild(n);},removeChild:function(n){this.childNodes.splice(this.childNodes.indexOf(n)>>>1,1),t.i.removeChild(n);}}),N(a(M$1,{context:t.context},n.__v),t.l)):t.l&&t.componentWillUnmount();}function j$2(n,t){return a(T$1,{__v:n,i:t})}(D.prototype=new p).__e=function(n){var t=this,e=L$1(t.__v),r=t.o.get(n);return r[0]++,function(u){var o=function(){t.props.revealOrder?(r.push(u),F$1(t,n,r)):u();};e?e(o):o();}},D.prototype.render=function(n){this.u=null,this.o=new Map;var t=w(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.o.set(t[e],this.u=[1,0,this.u]);return n.children},D.prototype.componentDidUpdate=D.prototype.componentDidMount=function(){var n=this;this.o.forEach(function(t,e){F$1(n,e,t);});};var I$1="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,W=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,P$1=function(n){return ("undefined"!=typeof Symbol&&"symbol"==typeof Symbol()?/fil|che|rad/i:/fil|che|ra/i).test(n)};p.prototype.isReactComponent={},["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(n){Object.defineProperty(p.prototype,n,{configurable:!0,get:function(){return this["UNSAFE_"+n]},set:function(t){Object.defineProperty(this,n,{configurable:!0,writable:!0,value:t});}});});var B=n$1.event;function H$1(){}function Z(){return this.cancelBubble}function Y(){return this.defaultPrevented}n$1.event=function(n){return B&&(n=B(n)),n.persist=H$1,n.isPropagationStopped=Z,n.isDefaultPrevented=Y,n.nativeEvent=n};var q$1={configurable:!0,get:function(){return this.class}},G=n$1.vnode;n$1.vnode=function(n){var t=n.type,e=n.props,r=e;if("string"==typeof t){for(var u in r={},e){var o=e[u];"value"===u&&"defaultValue"in e&&null==o||("defaultValue"===u&&"value"in e&&null==e.value?u="value":"download"===u&&!0===o?o="":/ondoubleclick/i.test(u)?u="ondblclick":/^onchange(textarea|input)/i.test(u+t)&&!P$1(e.type)?u="oninput":/^on(Ani|Tra|Tou|BeforeInp)/.test(u)?u=u.toLowerCase():W.test(u)?u=u.replace(/[A-Z0-9]/,"-$&").toLowerCase():null===o&&(o=void 0),r[u]=o);}"select"==t&&r.multiple&&Array.isArray(r.value)&&(r.value=w(e.children).forEach(function(n){n.props.selected=-1!=r.value.indexOf(n.props.value);})),"select"==t&&null!=r.defaultValue&&(r.value=w(e.children).forEach(function(n){n.props.selected=r.multiple?-1!=r.defaultValue.indexOf(n.props.value):r.defaultValue==n.props.value;})),n.props=r;}t&&e.class!=e.className&&(q$1.enumerable="className"in e,null!=e.className&&(r.class=e.className),Object.defineProperty(r,"className",q$1)),n.$$typeof=I$1,G&&G(n);};var J=n$1.__r;n$1.__r=function(n){J&&J(n),n.__c;};"object"==typeof performance&&"function"==typeof performance.now?performance.now.bind(performance):function(){return Date.now()};
  
    var CLASS_PATTERN = /^class /;
  
    function isClass(fn) {
      return CLASS_PATTERN.test(fn.toString());
    }
  
    function isArray$1(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    }
  
    function hasOwnProp(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
  
    function annotate() {
      var args = Array.prototype.slice.call(arguments);
  
      if (args.length === 1 && isArray$1(args[0])) {
        args = args[0];
      }
  
      var fn = args.pop();
  
      fn.$inject = args;
  
      return fn;
    }
  
  
    // Current limitations:
    // - can't put into "function arg" comments
    // function /* (no parenthesis like this) */ (){}
    // function abc( /* xx (no parenthesis like this) */ a, b) {}
    //
    // Just put the comment before function or inside:
    // /* (((this is fine))) */ function(a, b) {}
    // function abc(a) { /* (((this is fine))) */}
    //
    // - can't reliably auto-annotate constructor; we'll match the
    // first constructor(...) pattern found which may be the one
    // of a nested class, too.
  
    var CONSTRUCTOR_ARGS = /constructor\s*[^(]*\(\s*([^)]*)\)/m;
    var FN_ARGS = /^(?:async )?(?:function\s*)?[^(]*\(\s*([^)]*)\)/m;
    var FN_ARG = /\/\*([^*]*)\*\//m;
  
    function parseAnnotations(fn) {
  
      if (typeof fn !== 'function') {
        throw new Error('Cannot annotate "' + fn + '". Expected a function!');
      }
  
      var match = fn.toString().match(isClass(fn) ? CONSTRUCTOR_ARGS : FN_ARGS);
  
      // may parse class without constructor
      if (!match) {
        return [];
      }
  
      return match[1] && match[1].split(',').map(function(arg) {
        match = arg.match(FN_ARG);
        return match ? match[1].trim() : arg.trim();
      }) || [];
    }
  
    function Module() {
      var providers = [];
  
      this.factory = function(name, factory) {
        providers.push([name, 'factory', factory]);
        return this;
      };
  
      this.value = function(name, value) {
        providers.push([name, 'value', value]);
        return this;
      };
  
      this.type = function(name, type) {
        providers.push([name, 'type', type]);
        return this;
      };
  
      this.forEach = function(iterator) {
        providers.forEach(iterator);
      };
  
    }
  
    function Injector(modules, parent) {
      parent = parent || {
        get: function(name, strict) {
          currentlyResolving.push(name);
  
          if (strict === false) {
            return null;
          } else {
            throw error('No provider for "' + name + '"!');
          }
        }
      };
  
      var currentlyResolving = [];
      var providers = this._providers = Object.create(parent._providers || null);
      var instances = this._instances = Object.create(null);
  
      var self = instances.injector = this;
  
      var error = function(msg) {
        var stack = currentlyResolving.join(' -> ');
        currentlyResolving.length = 0;
        return new Error(stack ? msg + ' (Resolving: ' + stack + ')' : msg);
      };
  
      /**
       * Return a named service.
       *
       * @param {String} name
       * @param {Boolean} [strict=true] if false, resolve missing services to null
       *
       * @return {Object}
       */
      var get = function(name, strict) {
        if (!providers[name] && name.indexOf('.') !== -1) {
          var parts = name.split('.');
          var pivot = get(parts.shift());
  
          while (parts.length) {
            pivot = pivot[parts.shift()];
          }
  
          return pivot;
        }
  
        if (hasOwnProp(instances, name)) {
          return instances[name];
        }
  
        if (hasOwnProp(providers, name)) {
          if (currentlyResolving.indexOf(name) !== -1) {
            currentlyResolving.push(name);
            throw error('Cannot resolve circular dependency!');
          }
  
          currentlyResolving.push(name);
          instances[name] = providers[name][0](providers[name][1]);
          currentlyResolving.pop();
  
          return instances[name];
        }
  
        return parent.get(name, strict);
      };
  
      var fnDef = function(fn, locals) {
  
        if (typeof locals === 'undefined') {
          locals = {};
        }
  
        if (typeof fn !== 'function') {
          if (isArray$1(fn)) {
            fn = annotate(fn.slice());
          } else {
            throw new Error('Cannot invoke "' + fn + '". Expected a function!');
          }
        }
  
        var inject = fn.$inject || parseAnnotations(fn);
        var dependencies = inject.map(function(dep) {
          if (hasOwnProp(locals, dep)) {
            return locals[dep];
          } else {
            return get(dep);
          }
        });
  
        return {
          fn: fn,
          dependencies: dependencies
        };
      };
  
      var instantiate = function(Type) {
        var def = fnDef(Type);
  
        var fn = def.fn,
            dependencies = def.dependencies;
  
        // instantiate var args constructor
        var Constructor = Function.prototype.bind.apply(fn, [ null ].concat(dependencies));
  
        return new Constructor();
      };
  
      var invoke = function(func, context, locals) {
        var def = fnDef(func, locals);
  
        var fn = def.fn,
            dependencies = def.dependencies;
  
        return fn.apply(context, dependencies);
      };
  
  
      var createPrivateInjectorFactory = function(privateChildInjector) {
        return annotate(function(key) {
          return privateChildInjector.get(key);
        });
      };
  
      var createChild = function(modules, forceNewInstances) {
        if (forceNewInstances && forceNewInstances.length) {
          var fromParentModule = Object.create(null);
          var matchedScopes = Object.create(null);
  
          var privateInjectorsCache = [];
          var privateChildInjectors = [];
          var privateChildFactories = [];
  
          var provider;
          var cacheIdx;
          var privateChildInjector;
          var privateChildInjectorFactory;
          for (var name in providers) {
            provider = providers[name];
  
            if (forceNewInstances.indexOf(name) !== -1) {
              if (provider[2] === 'private') {
                cacheIdx = privateInjectorsCache.indexOf(provider[3]);
                if (cacheIdx === -1) {
                  privateChildInjector = provider[3].createChild([], forceNewInstances);
                  privateChildInjectorFactory = createPrivateInjectorFactory(privateChildInjector);
                  privateInjectorsCache.push(provider[3]);
                  privateChildInjectors.push(privateChildInjector);
                  privateChildFactories.push(privateChildInjectorFactory);
                  fromParentModule[name] = [privateChildInjectorFactory, name, 'private', privateChildInjector];
                } else {
                  fromParentModule[name] = [privateChildFactories[cacheIdx], name, 'private', privateChildInjectors[cacheIdx]];
                }
              } else {
                fromParentModule[name] = [provider[2], provider[1]];
              }
              matchedScopes[name] = true;
            }
  
            if ((provider[2] === 'factory' || provider[2] === 'type') && provider[1].$scope) {
              /* jshint -W083 */
              forceNewInstances.forEach(function(scope) {
                if (provider[1].$scope.indexOf(scope) !== -1) {
                  fromParentModule[name] = [provider[2], provider[1]];
                  matchedScopes[scope] = true;
                }
              });
            }
          }
  
          forceNewInstances.forEach(function(scope) {
            if (!matchedScopes[scope]) {
              throw new Error('No provider for "' + scope + '". Cannot use provider from the parent!');
            }
          });
  
          modules.unshift(fromParentModule);
        }
  
        return new Injector(modules, self);
      };
  
      var factoryMap = {
        factory: invoke,
        type: instantiate,
        value: function(value) {
          return value;
        }
      };
  
      modules.forEach(function(module) {
  
        function arrayUnwrap(type, value) {
          if (type !== 'value' && isArray$1(value)) {
            value = annotate(value.slice());
          }
  
          return value;
        }
  
        // TODO(vojta): handle wrong inputs (modules)
        if (module instanceof Module) {
          module.forEach(function(provider) {
            var name = provider[0];
            var type = provider[1];
            var value = provider[2];
  
            providers[name] = [factoryMap[type], arrayUnwrap(type, value), type];
          });
        } else if (typeof module === 'object') {
          if (module.__exports__) {
            var clonedModule = Object.keys(module).reduce(function(m, key) {
              if (key.substring(0, 2) !== '__') {
                m[key] = module[key];
              }
              return m;
            }, Object.create(null));
  
            var privateInjector = new Injector((module.__modules__ || []).concat([clonedModule]), self);
            var getFromPrivateInjector = annotate(function(key) {
              return privateInjector.get(key);
            });
            module.__exports__.forEach(function(key) {
              providers[key] = [getFromPrivateInjector, key, 'private', privateInjector];
            });
          } else {
            Object.keys(module).forEach(function(name) {
              if (module[name][2] === 'private') {
                providers[name] = module[name];
                return;
              }
  
              var type = module[name][0];
              var value = module[name][1];
  
              providers[name] = [factoryMap[type], arrayUnwrap(type, value), type];
            });
          }
        }
      });
  
      // public API
      this.get = get;
      this.invoke = invoke;
      this.instantiate = instantiate;
      this.createChild = createChild;
    }
  
    function createInjector(bootstrapModules) {
      const modules = [],
            components = [];
  
      function hasModule(module) {
        return modules.includes(module);
      }
  
      function addModule(module) {
        modules.push(module);
      }
  
      function visit(module) {
        if (hasModule(module)) {
          return;
        }
  
        (module.__depends__ || []).forEach(visit);
  
        if (hasModule(module)) {
          return;
        }
  
        addModule(module);
        (module.__init__ || []).forEach(function (component) {
          components.push(component);
        });
      }
  
      bootstrapModules.forEach(visit);
      const injector = new Injector(modules);
      components.forEach(function (component) {
        try {
          injector[typeof component === 'string' ? 'get' : 'invoke'](component);
        } catch (err) {
          console.error('Failed to instantiate component');
          console.error(err.stack);
          throw err;
        }
      });
      return injector;
    }
  
    /**
     * @param {string?} prefix
     *
     * @returns Element
     */
    function createFormContainer(prefix = 'fjs') {
      const container = document.createElement('div');
      container.classList.add(`${prefix}-container`);
      return container;
    }
  
    function findErrors(errors, path) {
      return errors[pathStringify(path)];
    }
    function pathStringify(path) {
      if (!path) {
        return '';
      }
  
      return path.join('.');
    }
    const indices = {};
    function generateIndexForType(type) {
      if (type in indices) {
        indices[type]++;
      } else {
        indices[type] = 1;
      }
  
      return indices[type];
    }
    function generateIdForType(type) {
      return `${type}${generateIndexForType(type)}`;
    }
    /**
     * @template T
     * @param {T} data
     * @param {(this: any, key: string, value: any) => any} [replacer]
     * @return {T}
     */
  
    function clone(data, replacer) {
      return JSON.parse(JSON.stringify(data, replacer));
    }
  
    var FN_REF = '__fn';
    var DEFAULT_PRIORITY = 1000;
    var slice = Array.prototype.slice;
    /**
     * A general purpose event bus.
     *
     * This component is used to communicate across a diagram instance.
     * Other parts of a diagram can use it to listen to and broadcast events.
     *
     *
     * ## Registering for Events
     *
     * The event bus provides the {@link EventBus#on} and {@link EventBus#once}
     * methods to register for events. {@link EventBus#off} can be used to
     * remove event registrations. Listeners receive an instance of {@link Event}
     * as the first argument. It allows them to hook into the event execution.
     *
     * ```javascript
     *
     * // listen for event
     * eventBus.on('foo', function(event) {
     *
     *   // access event type
     *   event.type; // 'foo'
     *
     *   // stop propagation to other listeners
     *   event.stopPropagation();
     *
     *   // prevent event default
     *   event.preventDefault();
     * });
     *
     * // listen for event with custom payload
     * eventBus.on('bar', function(event, payload) {
     *   console.log(payload);
     * });
     *
     * // listen for event returning value
     * eventBus.on('foobar', function(event) {
     *
     *   // stop event propagation + prevent default
     *   return false;
     *
     *   // stop event propagation + return custom result
     *   return {
     *     complex: 'listening result'
     *   };
     * });
     *
     *
     * // listen with custom priority (default=1000, higher is better)
     * eventBus.on('priorityfoo', 1500, function(event) {
     *   console.log('invoked first!');
     * });
     *
     *
     * // listen for event and pass the context (`this`)
     * eventBus.on('foobar', function(event) {
     *   this.foo();
     * }, this);
     * ```
     *
     *
     * ## Emitting Events
     *
     * Events can be emitted via the event bus using {@link EventBus#fire}.
     *
     * ```javascript
     *
     * // false indicates that the default action
     * // was prevented by listeners
     * if (eventBus.fire('foo') === false) {
     *   console.log('default has been prevented!');
     * };
     *
     *
     * // custom args + return value listener
     * eventBus.on('sum', function(event, a, b) {
     *   return a + b;
     * });
     *
     * // you can pass custom arguments + retrieve result values.
     * var sum = eventBus.fire('sum', 1, 2);
     * console.log(sum); // 3
     * ```
     */
  
    function EventBus() {
      this._listeners = {}; // cleanup on destroy on lowest priority to allow
      // message passing until the bitter end
  
      this.on('diagram.destroy', 1, this._destroy, this);
    }
    /**
     * Register an event listener for events with the given name.
     *
     * The callback will be invoked with `event, ...additionalArguments`
     * that have been passed to {@link EventBus#fire}.
     *
     * Returning false from a listener will prevent the events default action
     * (if any is specified). To stop an event from being processed further in
     * other listeners execute {@link Event#stopPropagation}.
     *
     * Returning anything but `undefined` from a listener will stop the listener propagation.
     *
     * @param {string|Array<string>} events
     * @param {number} [priority=1000] the priority in which this listener is called, larger is higher
     * @param {Function} callback
     * @param {Object} [that] Pass context (`this`) to the callback
     */
  
    EventBus.prototype.on = function (events, priority, callback, that) {
      events = isArray(events) ? events : [events];
  
      if (isFunction(priority)) {
        that = callback;
        callback = priority;
        priority = DEFAULT_PRIORITY;
      }
  
      if (!isNumber(priority)) {
        throw new Error('priority must be a number');
      }
  
      var actualCallback = callback;
  
      if (that) {
        actualCallback = bind(callback, that); // make sure we remember and are able to remove
        // bound callbacks via {@link #off} using the original
        // callback
  
        actualCallback[FN_REF] = callback[FN_REF] || callback;
      }
  
      var self = this;
      events.forEach(function (e) {
        self._addListener(e, {
          priority: priority,
          callback: actualCallback,
          next: null
        });
      });
    };
    /**
     * Register an event listener that is executed only once.
     *
     * @param {string} event the event name to register for
     * @param {number} [priority=1000] the priority in which this listener is called, larger is higher
     * @param {Function} callback the callback to execute
     * @param {Object} [that] Pass context (`this`) to the callback
     */
  
  
    EventBus.prototype.once = function (event, priority, callback, that) {
      var self = this;
  
      if (isFunction(priority)) {
        that = callback;
        callback = priority;
        priority = DEFAULT_PRIORITY;
      }
  
      if (!isNumber(priority)) {
        throw new Error('priority must be a number');
      }
  
      function wrappedCallback() {
        wrappedCallback.__isTomb = true;
        var result = callback.apply(that, arguments);
        self.off(event, wrappedCallback);
        return result;
      } // make sure we remember and are able to remove
      // bound callbacks via {@link #off} using the original
      // callback
  
  
      wrappedCallback[FN_REF] = callback;
      this.on(event, priority, wrappedCallback);
    };
    /**
     * Removes event listeners by event and callback.
     *
     * If no callback is given, all listeners for a given event name are being removed.
     *
     * @param {string|Array<string>} events
     * @param {Function} [callback]
     */
  
  
    EventBus.prototype.off = function (events, callback) {
      events = isArray(events) ? events : [events];
      var self = this;
      events.forEach(function (event) {
        self._removeListener(event, callback);
      });
    };
    /**
     * Create an EventBus event.
     *
     * @param {Object} data
     *
     * @return {Object} event, recognized by the eventBus
     */
  
  
    EventBus.prototype.createEvent = function (data) {
      var event = new InternalEvent();
      event.init(data);
      return event;
    };
    /**
     * Fires a named event.
     *
     * @example
     *
     * // fire event by name
     * events.fire('foo');
     *
     * // fire event object with nested type
     * var event = { type: 'foo' };
     * events.fire(event);
     *
     * // fire event with explicit type
     * var event = { x: 10, y: 20 };
     * events.fire('element.moved', event);
     *
     * // pass additional arguments to the event
     * events.on('foo', function(event, bar) {
     *   alert(bar);
     * });
     *
     * events.fire({ type: 'foo' }, 'I am bar!');
     *
     * @param {string} [name] the optional event name
     * @param {Object} [event] the event object
     * @param {...Object} additional arguments to be passed to the callback functions
     *
     * @return {boolean} the events return value, if specified or false if the
     *                   default action was prevented by listeners
     */
  
  
    EventBus.prototype.fire = function (type, data) {
      var event, firstListener, returnValue, args;
      args = slice.call(arguments);
  
      if (typeof type === 'object') {
        data = type;
        type = data.type;
      }
  
      if (!type) {
        throw new Error('no event type specified');
      }
  
      firstListener = this._listeners[type];
  
      if (!firstListener) {
        return;
      } // we make sure we fire instances of our home made
      // events here. We wrap them only once, though
  
  
      if (data instanceof InternalEvent) {
        // we are fine, we alread have an event
        event = data;
      } else {
        event = this.createEvent(data);
      } // ensure we pass the event as the first parameter
  
  
      args[0] = event; // original event type (in case we delegate)
  
      var originalType = event.type; // update event type before delegation
  
      if (type !== originalType) {
        event.type = type;
      }
  
      try {
        returnValue = this._invokeListeners(event, args, firstListener);
      } finally {
        // reset event type after delegation
        if (type !== originalType) {
          event.type = originalType;
        }
      } // set the return value to false if the event default
      // got prevented and no other return value exists
  
  
      if (returnValue === undefined && event.defaultPrevented) {
        returnValue = false;
      }
  
      return returnValue;
    };
  
    EventBus.prototype.handleError = function (error) {
      return this.fire('error', {
        error: error
      }) === false;
    };
  
    EventBus.prototype._destroy = function () {
      this._listeners = {};
    };
  
    EventBus.prototype._invokeListeners = function (event, args, listener) {
      var returnValue;
  
      while (listener) {
        // handle stopped propagation
        if (event.cancelBubble) {
          break;
        }
  
        returnValue = this._invokeListener(event, args, listener);
        listener = listener.next;
      }
  
      return returnValue;
    };
  
    EventBus.prototype._invokeListener = function (event, args, listener) {
      var returnValue;
  
      if (listener.callback.__isTomb) {
        return returnValue;
      }
  
      try {
        // returning false prevents the default action
        returnValue = invokeFunction(listener.callback, args); // stop propagation on return value
  
        if (returnValue !== undefined) {
          event.returnValue = returnValue;
          event.stopPropagation();
        } // prevent default on return false
  
  
        if (returnValue === false) {
          event.preventDefault();
        }
      } catch (e) {
        if (!this.handleError(e)) {
          console.error('unhandled error in event listener');
          console.error(e.stack);
          throw e;
        }
      }
  
      return returnValue;
    };
    /*
     * Add new listener with a certain priority to the list
     * of listeners (for the given event).
     *
     * The semantics of listener registration / listener execution are
     * first register, first serve: New listeners will always be inserted
     * after existing listeners with the same priority.
     *
     * Example: Inserting two listeners with priority 1000 and 1300
     *
     *    * before: [ 1500, 1500, 1000, 1000 ]
     *    * after: [ 1500, 1500, (new=1300), 1000, 1000, (new=1000) ]
     *
     * @param {string} event
     * @param {Object} listener { priority, callback }
     */
  
  
    EventBus.prototype._addListener = function (event, newListener) {
      var listener = this._getListeners(event),
          previousListener; // no prior listeners
  
  
      if (!listener) {
        this._setListeners(event, newListener);
  
        return;
      } // ensure we order listeners by priority from
      // 0 (high) to n > 0 (low)
  
  
      while (listener) {
        if (listener.priority < newListener.priority) {
          newListener.next = listener;
  
          if (previousListener) {
            previousListener.next = newListener;
          } else {
            this._setListeners(event, newListener);
          }
  
          return;
        }
  
        previousListener = listener;
        listener = listener.next;
      } // add new listener to back
  
  
      previousListener.next = newListener;
    };
  
    EventBus.prototype._getListeners = function (name) {
      return this._listeners[name];
    };
  
    EventBus.prototype._setListeners = function (name, listener) {
      this._listeners[name] = listener;
    };
  
    EventBus.prototype._removeListener = function (event, callback) {
      var listener = this._getListeners(event),
          nextListener,
          previousListener,
          listenerCallback;
  
      if (!callback) {
        // clear listeners
        this._setListeners(event, null);
  
        return;
      }
  
      while (listener) {
        nextListener = listener.next;
        listenerCallback = listener.callback;
  
        if (listenerCallback === callback || listenerCallback[FN_REF] === callback) {
          if (previousListener) {
            previousListener.next = nextListener;
          } else {
            // new first listener
            this._setListeners(event, nextListener);
          }
        }
  
        previousListener = listener;
        listener = nextListener;
      }
    };
    /**
     * A event that is emitted via the event bus.
     */
  
  
    function InternalEvent() {}
  
    InternalEvent.prototype.stopPropagation = function () {
      this.cancelBubble = true;
    };
  
    InternalEvent.prototype.preventDefault = function () {
      this.defaultPrevented = true;
    };
  
    InternalEvent.prototype.init = function (data) {
      assign(this, data || {});
    };
    /**
     * Invoke function. Be fast...
     *
     * @param {Function} fn
     * @param {Array<Object>} args
     *
     * @return {Any}
     */
  
  
    function invokeFunction(fn, args) {
      return fn.apply(null, args);
    }
  
    class Validator {
      validateField(field, value) {
        const {
          validate
        } = field;
        let errors = [];
  
        if (!validate) {
          return errors;
        }
  
        if (validate.pattern && value && !new RegExp(validate.pattern).test(value)) {
          errors = [...errors, `Field must match pattern ${validate.pattern}.`];
        }
  
        if (validate.required && (typeof value === 'undefined' || value === '')) {
          errors = [...errors, '此项必填.'];
        }
  
        if ('min' in validate && value && value < validate.min) {
          errors = [...errors, `此项值不得小于 ${validate.min}.`];
        }
  
        if ('max' in validate && value && value > validate.max) {
          errors = [...errors, `此项值不得大于 ${validate.max}.`];
        }
  
        if ('minLength' in validate && value && value.trim().length < validate.minLength) {
          errors = [...errors, `此项字数不得少于 ${validate.minLength}.`];
        }
  
        if ('maxLength' in validate && value && value.trim().length > validate.maxLength) {
          errors = [...errors, `此项字数不得大于 ${validate.maxLength}.`];
        }
  
        return errors;
      }
  
    }
  
    var FormFieldRegistry = Map;
  
    class Importer {
      /**
       * @constructor
       * @param { import('../core/FormFieldRegistry').default } formFieldRegistry
       * @param { import('../render/FormFields').default } formFields
       */
      constructor(formFieldRegistry, formFields) {
        this._formFieldRegistry = formFieldRegistry;
        this._formFields = formFields;
      }
      /**
       * Import schema adding `_id`, `_parent` and `_path` information to each field and adding it to the form field registry.
       *
       * @param {any} schema
       * @param {any} data
       *
       * @returns {Promise}
       */
  
  
      importSchema(schema, data = {}) {
        this._formFieldRegistry.clear(); // TODO: Add warnings
  
  
        const warnings = [];
        return new Promise((resolve, reject) => {
          try {
            this.importFormField(schema, data);
          } catch (err) {
            err.warnings = warnings;
            reject(err);
          }
  
          resolve({
            warnings
          });
        });
      }
  
      importFormField(formField, data = {}, parentId) {
        const {
          components,
          key,
          type
        } = formField;
  
        if (parentId) {
          // Set form field parent
          formField._parent = parentId;
        }
  
        if (!this._formFields.get(type)) {
          throw new Error(`form field of type <${type}> not supported`);
        }
  
        if (key) {
          this._formFieldRegistry.forEach(formField => {
            if (formField.key === key) {
              throw new Error(`form field with key <${key}> already exists`);
            }
          }); // Set form field path
  
  
          formField._path = [key];
        }
  
        const _id = generateIdForType(type); // Set form field ID
  
  
        formField._id = _id;
  
        this._formFieldRegistry.set(_id, formField);
  
        if (components) {
          this.importFormFields(components, data, _id);
        }
  
        return formField;
      }
  
      importFormFields(components, data = {}, parentId) {
        components.forEach(component => {
          this.importFormField(component, data, parentId);
        });
      }
  
    }
    Importer.$inject = ['formFieldRegistry', 'formFields'];
  
    var importModule = {
      importer: ['type', Importer]
    };
  
    const NODE_TYPE_TEXT = 3,
          NODE_TYPE_ELEMENT = 1;
    const ALLOWED_NODES = ['h1', 'h2', 'h3', 'h4', 'h5', 'span', 'em', 'a', 'p', 'div', 'ul', 'ol', 'li', 'hr', 'blockquote', 'img', 'pre', 'code', 'br', 'strong'];
    const ALLOWED_ATTRIBUTES = ['align', 'alt', 'class', 'href', 'id', 'name', 'src'];
    const ALLOWED_URI_PATTERN = /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i; // eslint-disable-line no-useless-escape
  
    const ATTR_WHITESPACE_PATTERN = /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g; // eslint-disable-line no-control-regex
  
    const FORM_ELEMENT = document.createElement('form');
    /**
     * Sanitize a HTML string and return the cleaned, safe version.
     *
     * @param {string} html
     * @return {string}
     */
  
    function sanitizeHTML(html) {
      const doc = new DOMParser().parseFromString(`<!DOCTYPE html>\n<html><body><div>${html}`, 'text/html');
      doc.normalize();
      const element = doc.body.firstChild;
  
      if (element) {
        sanitizeNode(
        /** @type Element */
        element);
        return new XMLSerializer().serializeToString(element);
      } else {
        // handle the case that document parsing
        // does not work at all, due to HTML gibberish
        return '';
      }
    }
    /**
     * Recursively sanitize a HTML node, potentially
     * removing it, its children or attributes.
     *
     * Inspired by https://github.com/developit/snarkdown/issues/70
     * and https://github.com/cure53/DOMPurify. Simplified
     * for our use-case.
     *
     * @param {Element} node
     */
  
    function sanitizeNode(node) {
      // allow text nodes
      if (node.nodeType === NODE_TYPE_TEXT) {
        return;
      } // disallow all other nodes but Element
  
  
      if (node.nodeType !== NODE_TYPE_ELEMENT) {
        return node.remove();
      }
  
      const lcTag = node.tagName.toLowerCase(); // disallow non-whitelisted tags
  
      if (!ALLOWED_NODES.includes(lcTag)) {
        return node.remove();
      }
  
      const attributes = node.attributes; // clean attributes
  
      for (let i = attributes.length; i--;) {
        const attribute = attributes[i];
        const name = attribute.name;
        const lcName = name.toLowerCase(); // normalize node value
  
        const value = attribute.value.trim();
        node.removeAttribute(name);
        const valid = isValidAttribute(lcTag, lcName, value);
  
        if (valid) {
          node.setAttribute(name, value);
        }
      }
  
      for (let i = node.childNodes.length; i--;) {
        sanitizeNode(
        /** @type Element */
        node.childNodes[i]);
      }
    }
    /**
     * Validates attributes for validity.
     *
     * @param {string} lcTag
     * @param {string} lcName
     * @param {string} value
     * @return {boolean}
     */
  
  
    function isValidAttribute(lcTag, lcName, value) {
      // disallow most attributes based on whitelist
      if (!ALLOWED_ATTRIBUTES.includes(lcName)) {
        return false;
      } // disallow "DOM clobbering" / polution of document and wrapping form elements
  
  
      if ((lcName === 'id' || lcName === 'name') && (value in document || value in FORM_ELEMENT)) {
        return false;
      } // allow valid url links only
  
  
      if (lcName === 'href' && !ALLOWED_URI_PATTERN.test(value.replace(ATTR_WHITESPACE_PATTERN, ''))) {
        return false;
      }
  
      return true;
    }
  
    function formFieldClasses(type, errors = []) {
      if (!type) {
        throw new Error('type required');
      }
  
      const classes = ['fjs-form-field', `fjs-form-field-${type}`];
  
      if (errors.length) {
        classes.push('fjs-has-errors');
      }
  
      return classes.join(' ');
    }
    function prefixId(id) {
      return `fjs-form-${id}`;
    }
    function markdownToHTML(markdown) {
      const htmls = markdown.split(/(?:\r?\n){2,}/).map(line => /^((\d+.)|[><\s#-*])/.test(line) ? t(line) : `<p>${t(line)}</p>`);
      return htmls.join('\n\n');
    } // See https://github.com/developit/snarkdown/issues/70
  
    function safeMarkdown(markdown) {
      const html = markdownToHTML(markdown);
      return sanitizeHTML(html);
    }
  
    const type = 'button';
    function Button(props) {
      const {
        disabled,
        field
      } = props;
      const {
        action = 'submit'
      } = field;
      return o$1("div", {
        class: formFieldClasses(type),
        children: o$1("button", {
          class: "fjs-button",
          type: action,
          disabled: disabled,
          children: field.label
        })
      });
    }
  
    Button.create = function (options = {}) {
      const _id = generateIdForType(type);
  
      return {
        action: 'submit',
        _id,
        key: _id,
        label: this.label,
        type,
        ...options
      };
    };
  
    Button.type = type;
    Button.label = 'Button';
  
    function Description(props) {
      const {
        description
      } = props;
  
      if (!description) {
        return null;
      }
  
      return o$1("div", {
        class: "fjs-form-field-description",
        children: description
      });
    }
  
    function Errors(props) {
      const {
        errors
      } = props;
  
      if (!errors.length) {
        return null;
      }
  
      return o$1("div", {
        class: "fjs-form-field-error",
        children: o$1("ul", {
          children: errors.map(error => {
            return o$1("li", {
              children: error
            });
          })
        })
      });
    }
  
    function Label(props) {
      const {
        id,
        label,
        required = false
      } = props;
  
      if (!label) {
        return null;
      }
  
      return o$1("label", {
        for: id,
        class: "fjs-form-field-label",
        children: [props.children, label, required && o$1("span", {
          class: "fjs-asterix",
          children: "*"
        })]
      });
    }
  
    const type$1 = 'checkbox';
    function Checkbox(props) {
      const {
        disabled,
        errors = [],
        field,
        value = false
      } = props;
      const {
        description,
        _id,
        label
      } = field;
  
      const onChange = ({
        target
      }) => {
        props.onChange({
          field,
          value: target.checked
        });
      };
  
      return o$1("div", {
        class: formFieldClasses(type$1, errors),
        children: [o$1(Label, {
          id: prefixId(_id),
          label: label,
          required: false,
          children: o$1("input", {
            checked: value,
            class: "fjs-input",
            disabled: disabled,
            id: prefixId(_id),
            type: "checkbox",
            onChange: onChange
          })
        }), o$1(Description, {
          description: description
        }), o$1(Errors, {
          errors: errors
        })]
      });
    }
  
    Checkbox.create = function (options = {}) {
      const _id = generateIdForType(type$1);
  
      return {
        _id,
        key: _id,
        label: this.label,
        type: type$1,
        ...options
      };
    };
  
    Checkbox.type = type$1;
    Checkbox.label = 'Checkbox';
  
    const FormRenderContext = q({
      Empty: props => {
        return null;
      },
      Children: props => {
        return props.children;
      },
      Element: props => {
        return props.children;
      }
    });
  
    /**
     * @param {string} type
     * @param {boolean} [strict]
     *
     * @returns {any}
     */
  
    function getService(type, strict) {}
  
    const FormContext = q({
      getService
    });
  
    function useService (type, strict) {
      const {
        getService
      } = F(FormContext);
      return getService(type, strict);
    }
  
    const noop = () => false;
  
    function FormField(props) {
      const {
        field,
        onChange
      } = props;
      const {
        _path
      } = field;
      const formFields = useService('formFields'),
            form = useService('form');
  
      const {
        data,
        errors,
        properties
      } = form._getState();
  
      const {
        Element
      } = F(FormRenderContext);
      const FormFieldComponent = formFields.get(field.type);
  
      if (!FormFieldComponent) {
        throw new Error(`cannot render field <${field.type}>`);
      }
  
      const value = get(data, _path);
      const fieldErrors = findErrors(errors, _path);
      return o$1(Element, {
        field: field,
        children: o$1(FormFieldComponent, { ...props,
          disabled: properties.readOnly || false,
          errors: fieldErrors,
          onChange: properties.readOnly ? noop : onChange,
          value: value
        })
      });
    }
  
    function Default(props) {
      const {
        Children,
        Empty
      } = F(FormRenderContext);
      const {
        field
      } = props;
      const {
        _id
      } = field;
      const {
        components = []
      } = field;
      return o$1(Children, {
        class: "fjs-vertical-layout",
        field: field,
        children: [components.map(field => {
          return a(FormField, { ...props,
            key: _id,
            field: field
          });
        }), components.length ? null : o$1(Empty, {})]
      });
    }
  
    Default.create = function (options = {}) {
      const _id = generateIdForType(this.type);
  
      return {
        components: [],
        _id,
        label: this.label,
        type: this.type,
        ...options
      };
    };
  
    Default.type = 'default';
    Default.label = 'Default';
  
    /**
     * This file must not be changed or exchanged.
     *
     * @see http://bpmn.io/license for more information.
     */
  
    function Logo() {
      return o$1("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 14.02 5.57",
        width: "53",
        height: "21",
        style: "vertical-align:middle",
        children: [o$1("path", {
          fill: "currentColor",
          d: "M1.88.92v.14c0 .41-.13.68-.4.8.33.14.46.44.46.86v.33c0 .61-.33.95-.95.95H0V0h.95c.65 0 .93.3.93.92zM.63.57v1.06h.24c.24 0 .38-.1.38-.43V.98c0-.28-.1-.4-.32-.4zm0 1.63v1.22h.36c.2 0 .32-.1.32-.39v-.35c0-.37-.12-.48-.4-.48H.63zM4.18.99v.52c0 .64-.31.98-.94.98h-.3V4h-.62V0h.92c.63 0 .94.35.94.99zM2.94.57v1.35h.3c.2 0 .3-.09.3-.37v-.6c0-.29-.1-.38-.3-.38h-.3zm2.89 2.27L6.25 0h.88v4h-.6V1.12L6.1 3.99h-.6l-.46-2.82v2.82h-.55V0h.87zM8.14 1.1V4h-.56V0h.79L9 2.4V0h.56v4h-.64zm2.49 2.29v.6h-.6v-.6zM12.12 1c0-.63.33-1 .95-1 .61 0 .95.37.95 1v2.04c0 .64-.34 1-.95 1-.62 0-.95-.37-.95-1zm.62 2.08c0 .28.13.39.33.39s.32-.1.32-.4V.98c0-.29-.12-.4-.32-.4s-.33.11-.33.4z"
        }), o$1("path", {
          fill: "currentColor",
          d: "M0 4.53h14.02v1.04H0zM11.08 0h.63v.62h-.63zm.63 4V1h-.63v2.98z"
        })]
      });
    }
  
    function Lightbox(props) {
      const {
        open
      } = props;
  
      if (!open) {
        return null;
      }
  
      return o$1("div", {
        class: "fjs-powered-by-lightbox",
        style: "z-index: 100; position: fixed; top: 0; left: 0;right: 0; bottom: 0",
        children: [o$1("div", {
          class: "backdrop",
          style: "width: 100%; height: 100%; background: rgba(40 40 40 / 20%)",
          onClick: props.onBackdropClick
        }), o$1("div", {
          class: "notice",
          style: "position: absolute; left: 50%; top: 40%; transform: translate(-50%); width: 260px; padding: 10px; background: white; box-shadow: 0  1px 4px rgba(0 0 0 / 30%); font-family: Helvetica, Arial, sans-serif; font-size: 14px; display: flex; line-height: 1.3",
          children: [o$1("a", {
            href: "https://bpmn.io",
            target: "_blank",
            rel: "noopener",
            style: "margin: 15px 20px 15px 10px; align-self: center; color: #404040",
            children: o$1(Logo, {})
          }), o$1("span", {
            children: ["Web-based tooling for BPMN, DMN, and forms powered by ", o$1("a", {
              href: "https://bpmn.io",
              target: "_blank",
              rel: "noopener",
              children: "bpmn.io"
            }), "."]
          })]
        })]
      });
    }
  
    function Link(props) {
      return o$1("div", {
        class: "fjs-powered-by fjs-form-field",
        style: "text-align: right",
        children: o$1("a", {
          href: "https://bpmn.io",
          target: "_blank",
          rel: "noopener",
          class: "fjs-powered-by-link",
          title: "Powered by bpmn.io",
          style: "color: #404040",
          onClick: props.onClick,
          children: o$1(Logo, {})
        })
      });
    }
  
    function PoweredBy(props) {
      const [open, setOpen] = l(false);
  
      function toggleOpen(open) {
        return event => {
          event.preventDefault();
          setOpen(open);
        };
      }
  
      return o$1(y, {
        children: [j$2(o$1(Lightbox, {
          open: open,
          onBackdropClick: toggleOpen(false)
        }), document.body), o$1(Link, {
          onClick: toggleOpen(true)
        })]
      });
    }
  
    const noop$1 = () => {};
  
    function FormComponent(props) {
      const form = useService('form');
  
      const {
        schema
      } = form._getState();
  
      const {
        onSubmit = noop$1,
        onReset = noop$1,
        onChange = noop$1
      } = props;
  
      const handleSubmit = event => {
        event.preventDefault();
        onSubmit();
      };
  
      const handleReset = event => {
        event.preventDefault();
        onReset();
      };
  
      return o$1("form", {
        class: "fjs-form",
        onSubmit: handleSubmit,
        onReset: handleReset,
        children: [o$1(FormField, {
          field: schema,
          onChange: onChange
        }), o$1(PoweredBy, {})]
      });

    //   return o$1("form", {
    //     class: "fjs-form",
    //     onSubmit: handleSubmit,
    //     onReset: handleReset,
    //     children: [o$1(FormField, {
    //       field: schema,
    //       onChange: onChange
    //     })]
    //   });
    }
  
    const type$2 = 'number';
    function Number$1(props) {
      const {
        disabled,
        errors = [],
        field,
        value
      } = props;
      const {
        description,
        _id,
        label,
        validate = {}
      } = field;
      const {
        required
      } = validate;
  
      const onChange = ({
        target
      }) => {
        const parsedValue = parseInt(target.value, 10);
        props.onChange({
          field,
          value: isNaN(parsedValue) ? undefined : parsedValue
        });
      };
  
      return o$1("div", {
        class: formFieldClasses(type$2, errors),
        children: [o$1(Label, {
          id: prefixId(_id),
          label: label,
          required: required
        }), o$1("input", {
          class: "fjs-input",
          disabled: disabled,
          id: prefixId(_id),
          onInput: onChange,
          type: "number",
          value: value
        }), o$1(Description, {
          description: description
        }), o$1(Errors, {
          errors: errors
        })]
      });
    }
  
    Number$1.create = function (options = {}) {
      const _id = generateIdForType(type$2);
  
      return {
        _id,
        key: _id,
        label: this.label,
        type: type$2,
        ...options
      };
    };
  
    Number$1.type = type$2;
    Number$1.label = 'Number';
  
    const type$3 = 'radio';
    function Radio(props) {
      const {
        disabled,
        errors = [],
        field,
        value
      } = props;
      const {
        description,
        _id,
        label,
        validate = {},
        values
      } = field;
      const {
        required
      } = validate;
  
      const onChange = v => {
        props.onChange({
          field,
          value: v === value ? undefined : v
        });
      };
  
      return o$1("div", {
        class: formFieldClasses(type$3, errors),
        children: [o$1(Label, {
          label: label,
          required: required
        }), values.map((v, index) => {
          return o$1(Label, {
            id: prefixId(`${_id}-${index}`),
            label: v.label,
            required: false,
            children: o$1("input", {
              checked: v.value === value,
              class: "fjs-input",
              disabled: disabled,
              id: prefixId(`${_id}-${index}`),
              type: "radio",
              onClick: () => onChange(v.value)
            })
          });
        }), o$1(Description, {
          description: description
        }), o$1(Errors, {
          errors: errors
        })]
      });
    }
  
    Radio.create = function (options = {}) {
      const _id = generateIdForType(type$3);
  
      return {
        _id,
        key: _id,
        label: this.label,
        type: type$3,
        values: [{
          label: 'Value',
          value: 'value'
        }],
        ...options
      };
    };
  
    Radio.type = type$3;
    Radio.label = 'Radio';
  
    const type$4 = 'select';
    function Select(props) {
      const {
        disabled,
        errors = [],
        field,
        value
      } = props;
      const {
        description,
        _id,
        label,
        validate = {},
        values
      } = field;
      const {
        required
      } = validate;
  
      const onChange = ({
        target
      }) => {
        props.onChange({
          field,
          value: target.value === '' ? undefined : target.value
        });
      };
  
      return o$1("div", {
        class: formFieldClasses(type$4, errors),
        children: [o$1(Label, {
          label: label,
          required: required
        }), o$1("select", {
          class: "fjs-select",
          disabled: disabled,
          id: prefixId(_id),
          onChange: onChange,
          value: value,
          children: [o$1("option", {
            value: ""
          }), values.map((v, index) => {
            return o$1("option", {
              value: v.value,
              children: v.label
            });
          })]
        }), o$1(Description, {
          description: description
        }), o$1(Errors, {
          errors: errors
        })]
      });
    }
  
    Select.create = function (options = {}) {
      const _id = generateIdForType(type$4);
  
      return {
        _id,
        key: _id,
        label: this.label,
        type: type$4,
        values: [{
          label: 'Value',
          value: 'value'
        }],
        ...options
      };
    };
  
    Select.type = type$4;
    Select.label = '选择框';
  
    const type$5 = 'text';
    function Text(props) {
      const {
        field
      } = props;
      const {
        text = ''
      } = field;
      return o$1("div", {
        class: formFieldClasses(type$5),
        children: o$1(Markup, {
          markup: safeMarkdown(text),
          trim: false
        })
      });
    }
  
    Text.create = function (options = {}) {
      const _id = generateIdForType(type$5);
  
      return {
        _id,
        text: '# Text',
        type: type$5,
        ...options
      };
    };
  
    Text.type = type$5;
  
    const type$6 = 'textfield';
    function Textfield(props) {
      const {
        disabled,
        errors = [],
        field,
        value = ''
      } = props;
      const {
        description,
        _id,
        label,
        validate = {}
      } = field;
      const {
        required
      } = validate;
  
      const onChange = ({
        target
      }) => {
        props.onChange({
          field,
          value: target.value
        });
      };
  
      return o$1("div", {
        class: formFieldClasses(type$6, errors),
        children: [o$1(Label, {
          id: prefixId(_id),
          label: label,
          required: required
        }), o$1("input", {
          class: "fjs-input",
          disabled: disabled,
          id: prefixId(_id),
          onInput: onChange,
          type: "text",
          value: value
        }), o$1(Description, {
          description: description
        }), o$1(Errors, {
          errors: errors
        })]
      });
    }
  
    Textfield.create = function (options = {}) {
      const _id = generateIdForType(type$6);
  
      return {
        _id,
        key: _id,
        label: this.label,
        type: type$6,
        ...options
      };
    };
  
    Textfield.type = type$6;
    Textfield.label = '文本框';


    /*** 学文自定义 多行文本框 start  */

    const type$7 = 'textarea';
    function TextArea(props) {
      const {
        disabled,
        errors = [],
        field,
        value = ''
      } = props;
      const {
        description,
        _id,
        label,
        validate = {}
      } = field;
      const {
        required
      } = validate;
  
      const onChange = ({
        target
      }) => {
        props.onChange({
          field,
          value: target.value
        });
      };
  
      return o$1("div", {
        class: formFieldClasses(type$7, errors),
        children: [o$1(Label, {
          id: prefixId(_id),
          label: label,
          required: required
        }), o$1("textarea", {
          class: "fjs-textarea",
          disabled: disabled,
          id: prefixId(_id),
          onInput: onChange,
          //type: "text",
          value: value
        }), o$1(Description, {
          description: description
        }), o$1(Errors, {
          errors: errors
        })]
      });
    }
  
    TextArea.create = function (options = {}) {
      const _id = generateIdForType(type$7);
  
      return {
        _id,
        key: _id,
        label: this.label,
        type: type$7,
        ...options
      };
    };
  
    TextArea.type = type$7;
    TextArea.label = '多行文本框';

    /*** 学文自定义 多行文本框 end */

    /*** 学文自定义 日期文本框 start  */

    const type$8 = 'textdate';
    function TextDate(props) {
      const {
        disabled,
        errors = [],
        field,
        value = ''
      } = props;
      const {
        description,
        _id,
        label,
        validate = {}
      } = field;
      const {
        required
      } = validate;
  
      const onChange = ({
        target
      }) => {
        props.onChange({
          field,
          value: target.value
        });
      };
  
      return o$1("div", {
        class: formFieldClasses(type$8, errors),
        children: [o$1(Label, {
          id: prefixId(_id),
          label: label,
          required: required
        }), o$1("input", {
          class: "fjs-input",
          disabled: disabled,
          id: prefixId(_id),
          onInput: onChange,
          type: "date",
          value: value
        }), o$1(Description, {
          description: description
        }), o$1(Errors, {
          errors: errors
        })]
      });
    }
  
    TextDate.create = function (options = {}) {
      const _id = generateIdForType(type$8);
  
      return {
        _id,
        key: _id,
        label: this.label,
        type: type$8,
        ...options
      };
    };
  
    TextDate.type = type$8;
    TextDate.label = '日期';

    /*** 学文自定义 日期文本框 end */

    /*** 学文自定义 时间文本框 start  */

    const type$9 = 'textdatetime';
    function TextDateTime(props) {
      const {
        disabled,
        errors = [],
        field,
        value = ''
      } = props;
      const {
        description,
        _id,
        label,
        validate = {}
      } = field;
      const {
        required
      } = validate;
  
      const onChange = ({
        target
      }) => {
        props.onChange({
          field,
          value: target.value
        });
      };
  
      return o$1("div", {
        class: formFieldClasses(type$9, errors),
        children: [o$1(Label, {
          id: prefixId(_id),
          label: label,
          required: required
        }), o$1("input", {
          class: "fjs-input",
          disabled: disabled,
          id: prefixId(_id),
          onInput: onChange,
          type: "time",
          value: value
        }), o$1(Description, {
          description: description
        }), o$1(Errors, {
          errors: errors
        })]
      });
    }
  
    TextDateTime.create = function (options = {}) {
      const _id = generateIdForType(type$9);
  
      return {
        _id,
        key: _id,
        label: this.label,
        type: type$9,
        ...options
      };
    };
  
    TextDateTime.type = type$9;
    TextDateTime.label = '时间';

    /*** 学文自定义 时间文本框 end */
  
    const formFields = [Button, Checkbox, Default, Number$1, Radio, Select, Text, Textfield,TextArea,TextDate,TextDateTime];
  
    class FormFields {
      constructor() {
        this._formFields = {};
        formFields.forEach(formField => {
          const {
            type
          } = formField;
          this.register(type, formField);
        });
      }
  
      register(type, formField) {
        this._formFields[type] = formField;
      }
  
      get(type) {
        return this._formFields[type];
      }
  
    }
  
    function Renderer(config, eventBus, form, injector) {
      const App = () => {
        const [state, setState] = l(form._getState());
        const formContext = {
          getService(type, strict = true) {
            return injector.get(type, strict);
          }
  
        };
        eventBus.on('changed', newState => {
          setState(newState);
        });
        const onChange = A$1(update => form._update(update), [form]);
        const {
          properties
        } = state;
        const {
          readOnly
        } = properties;
        const onSubmit = A$1(() => {
          if (!readOnly) {
            form.submit();
          }
        }, [form, readOnly]);
        const onReset = A$1(() => form.reset(), [form]);
        const {
          schema
        } = state;
  
        if (!schema) {
          return null;
        }
  
        return o$1(FormContext.Provider, {
          value: formContext,
          children: o$1(FormComponent, {
            onChange: onChange,
            onSubmit: onSubmit,
            onReset: onReset
          })
        });
      };
  
      const {
        container
      } = config;
      eventBus.on('form.init', () => {
        N(o$1(App, {}), container);
      });
      eventBus.on('form.destroy', () => {
        N(null, container);
      });
    }
    Renderer.$inject = ['config.renderer', 'eventBus', 'form', 'injector'];
  
    var renderModule = {
      __init__: ['formFields', 'renderer'],
      formFields: ['type', FormFields],
      renderer: ['type', Renderer]
    };
  
    var core = {
      __depends__: [importModule, renderModule],
      eventBus: ['type', EventBus],
      formFieldRegistry: ['type', FormFieldRegistry],
      validator: ['type', Validator]
    };
  
    /**
     * @typedef { import('didi').Injector } Injector
     *
     * @typedef { { [x: string]: any } } Data
     * @typedef { { [x: string]: string[] } } Errors
     * @typedef { any[] } Modules
     * @typedef { ('readOnly' | string) } FormProperty
     * @typedef { ('submit' | 'changed' | string) } FormEvent
     * @typedef { { [x: string]: any } } FormProperties
     * @typedef { any } Schema
     *
     * @typedef { {
     *   additionalModules?: Modules,
     *   container?: Element|string,
     *   injector?: Injector,
     *   modules?: Modules,
     *   properties?: FormProperties
     * } } FormOptions
     *
     * @typedef { {
     *   data: Data,
     *   errors: Errors,
     *   properties: FormProperties,
     *   schema: Schema
     * } } State
     */
  
    class Form {
      /**
       * @constructor
       * @param {FormOptions} options
       */
      constructor(options = {}) {
        /**
         * @private
         * @type {Element}
         */
        this._container = createFormContainer();
        const {
          container,
          injector = this._createInjector(options, this._container),
          properties = {}
        } = options;
        /**
         * @private
         * @type {State}
         */
  
        this._state = {
          data: null,
          properties,
          errors: {},
          schema: null
        };
        /**
         * @private
         * @type {Data}
         */
  
        this._importedData = null;
        this.get = injector.get;
        this.invoke = injector.invoke;
        this.get('eventBus').fire('form.init');
  
        if (container) {
          this.attachTo(container);
        }
      }
  
      destroy() {
        this.get('eventBus').fire('form.destroy');
  
        this._detach(false);
      }
      /**
       * @param {Schema} schema
       * @param {Data} [data]
       */
  
  
      importSchema(schema, data = {}) {
        this._importedData = null;
        return new Promise((resolve, reject) => {
          const importer = this.get('importer');
          schema = clone(schema);
          data = clone(data);
          importer.importSchema(schema, data).then(({
            warnings
          }) => {
            this._importedData = clone(data);
  
            this._setState({
              data,
              errors: {},
              schema
            });
  
            resolve({
              warnings
            });
          }).catch(err => {
            reject(err);
          });
        });
      }
      /**
       * @returns { { data: Data, errors: Errors } }
       */
  
  
      submit() {
        const {
          properties
        } = this._getState();
  
        if (properties.readOnly) {
          throw new Error('form is read-only');
        }
  
        const formFieldRegistry = this.get('formFieldRegistry'); // do not submit disabled form fields
  
        const data = Array.from(formFieldRegistry.values()).reduce((data, field) => {
          const {
            disabled,
            _path
          } = field;
  
          if (disabled) {
            // strip disabled field value
            set(data, _path, undefined);
          }
  
          return data;
        }, clone(this._getState().data));
        const errors = this.validate();
  
        this._emit('submit', {
          data,
          errors
        });
  
        return {
          data,
          errors
        };
      }
  
      reset() {
        this._emit('reset');
  
        this._setState({
          data: clone(this._importedData),
          errors: {}
        });
      }
      /**
       * @returns {Errors}
       */
  
  
      validate() {
        const formFieldRegistry = this.get('formFieldRegistry'),
              validator = this.get('validator');
  
        const {
          data
        } = this._getState();
  
        const errors = Array.from(formFieldRegistry.values()).reduce((errors, field) => {
          const {
            disabled,
            _path
          } = field;
  
          if (disabled) {
            return errors;
          }
  
          const value = get(data, _path);
          const fieldErrors = validator.validateField(field, value);
          return set(errors, [pathStringify(_path)], fieldErrors.length ? fieldErrors : undefined);
        },
        /** @type {Errors} */
        {});
  
        this._setState({
          errors
        });
  
        return errors;
      }
      /**
       * @param {Element|string} parentNode
       */
  
  
      attachTo(parentNode) {
        if (!parentNode) {
          throw new Error('parentNode required');
        }
  
        this.detach();
  
        if (isString(parentNode)) {
          parentNode = document.querySelector(parentNode);
        }
  
        const container = this._container;
        parentNode.appendChild(container);
  
        this._emit('attach');
      }
  
      detach() {
        this._detach();
      }
      /**
       * @param {boolean} [emit]
       */
  
  
      _detach(emit = true) {
        const container = this._container,
              parentNode = container.parentNode;
  
        if (!parentNode) {
          return;
        }
  
        if (emit) {
          this._emit('detach');
        }
  
        parentNode.removeChild(container);
      }
      /**
       * @param {FormProperty} property
       * @param {any} value
       */
  
  
      setProperty(property, value) {
        const properties = set(this._getState().properties, [property], value);
  
        this._setState({
          properties
        });
      }
      /**
       * @param {FormEvent} type
       * @param {Function} handler
       */
  
  
      on(type, handler) {
        this.get('eventBus').on(type, handler);
      }
      /**
       * @param {FormEvent} type
       * @param {Function} handler
       */
  
  
      off(type, handler) {
        this.get('eventBus').on(type, handler);
      }
      /**
       * @param {FormOptions} options
       * @param {Element} container
       *
       * @returns {Injector}
       */
  
  
      _createInjector(options, container) {
        const {
          additionalModules = [],
          modules = []
        } = options;
        const config = {
          renderer: {
            container
          }
        };
        return createInjector([{
          config: ['value', config]
        }, {
          form: ['value', this]
        }, core, ...modules, ...additionalModules]);
      }
  
      _emit(type, data) {
        this.get('eventBus').fire(type, data);
      }
      /**
       * @param { { add?: boolean, field: any, remove?: number, value?: any } } update
       */
  
  
      _update(update) {
        const {
          field,
          value
        } = update;
        const {
          _path
        } = field;
  
        let {
          data,
          errors
        } = this._getState();
  
        const validator = this.get('validator');
        const fieldErrors = validator.validateField(field, value);
        set(data, _path, value);
        set(errors, [pathStringify(_path)], fieldErrors.length ? fieldErrors : undefined);
  
        this._setState({
          data: clone(data),
          errors: clone(errors)
        });
      }
  
      _getState() {
        return this._state;
      }
  
      _setState(state) {
        this._state = { ...this._state,
          ...state
        };
  
        this._emit('changed', this._getState());
      }
  
    }
  
    const schemaVersion = 1;
    /**
     * @typedef { import('didi').Injector } Injector
     *
     * @typedef { { [x: string]: any } } Data
     * @typedef { any } Schema
     * @typedef { any[] } Modules
     * @typedef { { [x: string]: any } } FormPropertyOptions
     *
     * @typedef { {
     *   additionalModules?: Modules,
     *   container?: Element|string,
     *   data?: Data,
     *   injector?: Injector,
     *   modules?: Modules,
     *   properties?: FormPropertyOptions,
     *   schema: Schema
     * } } FormViewerOptions
     */
  
    /**
     * Create a form.
     *
     * @param {FormViewerOptions} options
     *
     * @return {Promise<Form>}
     */
  
    function createForm(options) {
      const {
        data,
        schema,
        ...rest
      } = options;
      const form = new Form(rest);
      return form.importSchema(schema, data).then(function () {
        return form;
      });
    }
  
    exports.Form = Form;
    exports.createForm = createForm;
    exports.schemaVersion = schemaVersion;
  
    Object.defineProperty(exports, '__esModule', { value: true });
  
  })));