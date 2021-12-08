/**
 * 云尚小区管理系统作者 吴学文（mail:928255095@qq.com） 对原有的https://bpmn.io 的 formjs 框架做了 相应修改 主要修改如下：
 * 加入 多行文本框，时间组件，日期组件，部分汉化功能
 * 
 * 云尚小区管理系统官方尊重作者的贡献未去除bpmn 版权信息，如果您想去除请先联系 bpmn作者，经作者同意后，可以在1758行去除bpmn版权，
 * 在未经作者允许的情况下去除bpmn版权造成的侵权问题，天圆小区管理系统将不会承担任何责任，由去除版权的公司或者个人承担相应的责任！
 * 
 * 版权归 https://bpmn.io/ 所有，非常感谢bpmn.io 提供这么优秀的框架
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FormEditor = {}));
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
    /**
     * Transform a collection into another collection
     * by piping each member through the given fn.
     *
     * @param  {Object|Array}   collection
     * @param  {Function} fn
     *
     * @return {Array} transformed collection
     */
  
    function map(collection, fn) {
      var result = [];
      forEach(collection, function (val, key) {
        result.push(fn(val, key));
      });
      return result;
    }
    /**
     * Group collection members by attribute.
     *
     * @param  {Object|Array} collection
     * @param  {Function} extractor
     *
     * @return {Object} map with { attrValue => [ a, b, c ] }
     */
  
    function groupBy(collection, extractor) {
      var grouped = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      extractor = toExtractor(extractor);
      forEach(collection, function (val) {
        var discriminator = extractor(val) || '_';
        var group = grouped[discriminator];
  
        if (!group) {
          group = grouped[discriminator] = [];
        }
  
        group.push(val);
      });
      return grouped;
    }
    function uniqueBy(extractor) {
      extractor = toExtractor(extractor);
      var grouped = {};
  
      for (var _len = arguments.length, collections = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        collections[_key - 1] = arguments[_key];
      }
  
      forEach(collections, function (c) {
        return groupBy(c, extractor, grouped);
      });
      var result = map(grouped, function (val, key) {
        return val[0];
      });
      return result;
    }
  
    function toExtractor(extractor) {
      return isFunction(extractor) ? extractor : function (e) {
        return e[extractor];
      };
    }
  
    function identity(arg) {
      return arg;
    }
  
    function toNum(arg) {
      return Number(arg);
    }
  
    /**
     * Debounce fn, calling it only once if
     * the given time elapsed between calls.
     *
     * @param  {Function} fn
     * @param  {Number} timeout
     *
     * @return {Function} debounced function
     */
    function debounce(fn, timeout) {
      var timer;
      var lastArgs;
      var lastThis;
      var lastNow;
  
      function fire() {
        var now = Date.now();
        var scheduledDiff = lastNow + timeout - now;
  
        if (scheduledDiff > 0) {
          return schedule(scheduledDiff);
        }
  
        fn.apply(lastThis, lastArgs);
        timer = lastNow = lastArgs = lastThis = undefined;
      }
  
      function schedule(timeout) {
        timer = setTimeout(fire, timeout);
      }
  
      return function () {
        lastNow = Date.now();
  
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
  
        lastArgs = args;
        lastThis = this; // ensure an execution is scheduled
  
        if (!timer) {
          schedule(timeout);
        }
      };
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
  
    var n$1,u,i,t$1,r$1,o={},f=[],e$1=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function c(n,l){for(var u in l)n[u]=l[u];return n}function s(n){var l=n.parentNode;l&&l.removeChild(n);}function a(n,l,u){var i,t,r,o=arguments,f={};for(r in l)"key"==r?i=l[r]:"ref"==r?t=l[r]:f[r]=l[r];if(arguments.length>3)for(u=[u],r=3;r<arguments.length;r++)u.push(o[r]);if(null!=u&&(f.children=u),"function"==typeof n&&null!=n.defaultProps)for(r in n.defaultProps)void 0===f[r]&&(f[r]=n.defaultProps[r]);return v(n,f,i,t,null)}function v(l,u,i,t,r){var o={type:l,props:u,key:i,ref:t,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++n$1.__v:r};return null!=n$1.vnode&&n$1.vnode(o),o}function h(){return {current:null}}function y(n){return n.children}function p(n,l){this.props=n,this.context=l;}function d(n,l){if(null==l)return n.__?d(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?d(n):null}function _(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return _(n)}}function k(l){(!l.__d&&(l.__d=!0)&&u.push(l)&&!m.__r++||t$1!==n$1.debounceRendering)&&((t$1=n$1.debounceRendering)||i)(m);}function m(){for(var n;m.__r=u.length;)n=u.sort(function(n,l){return n.__v.__b-l.__v.__b}),u=[],n.some(function(n){var l,u,i,t,r,o;n.__d&&(r=(t=(l=n).__v).__e,(o=l.__P)&&(u=[],(i=c({},t)).__v=t.__v+1,T(o,t,i,l.__n,void 0!==o.ownerSVGElement,null!=t.__h?[r]:null,u,null==r?d(t):r,t.__h),j(u,t),t.__e!=r&&_(t)));});}function b(n,l,u,i,t,r,e,c,s,a){var h,p,_,k,m,b,w,A=i&&i.__k||f,P=A.length;for(u.__k=[],h=0;h<l.length;h++)if(null!=(k=u.__k[h]=null==(k=l[h])||"boolean"==typeof k?null:"string"==typeof k||"number"==typeof k?v(null,k,null,null,k):Array.isArray(k)?v(y,{children:k},null,null,null):k.__b>0?v(k.type,k.props,k.key,null,k.__v):k)){if(k.__=u,k.__b=u.__b+1,null===(_=A[h])||_&&k.key==_.key&&k.type===_.type)A[h]=void 0;else for(p=0;p<P;p++){if((_=A[p])&&k.key==_.key&&k.type===_.type){A[p]=void 0;break}_=null;}T(n,k,_=_||o,t,r,e,c,s,a),m=k.__e,(p=k.ref)&&_.ref!=p&&(w||(w=[]),_.ref&&w.push(_.ref,null,k),w.push(p,k.__c||m,k)),null!=m?(null==b&&(b=m),"function"==typeof k.type&&null!=k.__k&&k.__k===_.__k?k.__d=s=g(k,s,n):s=x(n,k,_,A,m,s),a||"option"!==u.type?"function"==typeof u.type&&(u.__d=s):n.value=""):s&&_.__e==s&&s.parentNode!=n&&(s=d(_));}for(u.__e=b,h=P;h--;)null!=A[h]&&("function"==typeof u.type&&null!=A[h].__e&&A[h].__e==u.__d&&(u.__d=d(i,h+1)),L(A[h],A[h]));if(w)for(h=0;h<w.length;h++)I(w[h],w[++h],w[++h]);}function g(n,l,u){var i,t;for(i=0;i<n.__k.length;i++)(t=n.__k[i])&&(t.__=n,l="function"==typeof t.type?g(t,l,u):x(u,t,t,n.__k,t.__e,l));return l}function w(n,l){return l=l||[],null==n||"boolean"==typeof n||(Array.isArray(n)?n.some(function(n){w(n,l);}):l.push(n)),l}function x(n,l,u,i,t,r){var o,f,e;if(void 0!==l.__d)o=l.__d,l.__d=void 0;else if(null==u||t!=r||null==t.parentNode)n:if(null==r||r.parentNode!==n)n.appendChild(t),o=null;else {for(f=r,e=0;(f=f.nextSibling)&&e<i.length;e+=2)if(f==t)break n;n.insertBefore(t,r),o=r;}return void 0!==o?o:t.nextSibling}function A(n,l,u,i,t){var r;for(r in u)"children"===r||"key"===r||r in l||C(n,r,null,u[r],i);for(r in l)t&&"function"!=typeof l[r]||"children"===r||"key"===r||"value"===r||"checked"===r||u[r]===l[r]||C(n,r,l[r],u[r],i);}function P(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||e$1.test(l)?u:u+"px";}function C(n,l,u,i,t){var r;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else {if("string"==typeof i&&(n.style.cssText=i=""),i)for(l in i)u&&l in u||P(n.style,l,"");if(u)for(l in u)i&&u[l]===i[l]||P(n.style,l,u[l]);}else if("o"===l[0]&&"n"===l[1])r=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+r]=u,u?i||n.addEventListener(l,r?H:$,r):n.removeEventListener(l,r?H:$,r);else if("dangerouslySetInnerHTML"!==l){if(t)l=l.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==l&&"list"!==l&&"form"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null!=u&&(!1!==u||"a"===l[0]&&"r"===l[1])?n.setAttribute(l,u):n.removeAttribute(l));}}function $(l){this.l[l.type+!1](n$1.event?n$1.event(l):l);}function H(l){this.l[l.type+!0](n$1.event?n$1.event(l):l);}function T(l,u,i,t,r,o,f,e,s){var a,v,h,d,_,k,m,g,w,x,A,P=u.type;if(void 0!==u.constructor)return null;null!=i.__h&&(s=i.__h,e=u.__e=i.__e,u.__h=null,o=[e]),(a=n$1.__b)&&a(u);try{n:if("function"==typeof P){if(g=u.props,w=(a=P.contextType)&&t[a.__c],x=a?w?w.props.value:a.__:t,i.__c?m=(v=u.__c=i.__c).__=v.__E:("prototype"in P&&P.prototype.render?u.__c=v=new P(g,x):(u.__c=v=new p(g,x),v.constructor=P,v.render=M),w&&w.sub(v),v.props=g,v.state||(v.state={}),v.context=x,v.__n=t,h=v.__d=!0,v.__h=[]),null==v.__s&&(v.__s=v.state),null!=P.getDerivedStateFromProps&&(v.__s==v.state&&(v.__s=c({},v.__s)),c(v.__s,P.getDerivedStateFromProps(g,v.__s))),d=v.props,_=v.state,h)null==P.getDerivedStateFromProps&&null!=v.componentWillMount&&v.componentWillMount(),null!=v.componentDidMount&&v.__h.push(v.componentDidMount);else {if(null==P.getDerivedStateFromProps&&g!==d&&null!=v.componentWillReceiveProps&&v.componentWillReceiveProps(g,x),!v.__e&&null!=v.shouldComponentUpdate&&!1===v.shouldComponentUpdate(g,v.__s,x)||u.__v===i.__v){v.props=g,v.state=v.__s,u.__v!==i.__v&&(v.__d=!1),v.__v=u,u.__e=i.__e,u.__k=i.__k,v.__h.length&&f.push(v);break n}null!=v.componentWillUpdate&&v.componentWillUpdate(g,v.__s,x),null!=v.componentDidUpdate&&v.__h.push(function(){v.componentDidUpdate(d,_,k);});}v.context=x,v.props=g,v.state=v.__s,(a=n$1.__r)&&a(u),v.__d=!1,v.__v=u,v.__P=l,a=v.render(v.props,v.state,v.context),v.state=v.__s,null!=v.getChildContext&&(t=c(c({},t),v.getChildContext())),h||null==v.getSnapshotBeforeUpdate||(k=v.getSnapshotBeforeUpdate(d,_)),A=null!=a&&a.type===y&&null==a.key?a.props.children:a,b(l,Array.isArray(A)?A:[A],u,i,t,r,o,f,e,s),v.base=u.__e,u.__h=null,v.__h.length&&f.push(v),m&&(v.__E=v.__=null),v.__e=!1;}else null==o&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=z(i.__e,u,i,t,r,o,f,s);(a=n$1.diffed)&&a(u);}catch(l){u.__v=null,(s||null!=o)&&(u.__e=e,u.__h=!!s,o[o.indexOf(e)]=null),n$1.__e(l,u,i);}}function j(l,u){n$1.__c&&n$1.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u);});}catch(l){n$1.__e(l,u.__v);}});}function z(n,l,u,i,t,r,e,c){var a,v,h,y,p=u.props,d=l.props,_=l.type,k=0;if("svg"===_&&(t=!0),null!=r)for(;k<r.length;k++)if((a=r[k])&&(a===n||(_?a.localName==_:3==a.nodeType))){n=a,r[k]=null;break}if(null==n){if(null===_)return document.createTextNode(d);n=t?document.createElementNS("http://www.w3.org/2000/svg",_):document.createElement(_,d.is&&d),r=null,c=!1;}if(null===_)p===d||c&&n.data===d||(n.data=d);else {if(r=r&&f.slice.call(n.childNodes),v=(p=u.props||o).dangerouslySetInnerHTML,h=d.dangerouslySetInnerHTML,!c){if(null!=r)for(p={},y=0;y<n.attributes.length;y++)p[n.attributes[y].name]=n.attributes[y].value;(h||v)&&(h&&(v&&h.__html==v.__html||h.__html===n.innerHTML)||(n.innerHTML=h&&h.__html||""));}if(A(n,d,p,t,c),h)l.__k=[];else if(k=l.props.children,b(n,Array.isArray(k)?k:[k],l,u,i,t&&"foreignObject"!==_,r,e,n.firstChild,c),null!=r)for(k=r.length;k--;)null!=r[k]&&s(r[k]);c||("value"in d&&void 0!==(k=d.value)&&(k!==n.value||"progress"===_&&!k)&&C(n,"value",k,p.value,!1),"checked"in d&&void 0!==(k=d.checked)&&k!==n.checked&&C(n,"checked",k,p.checked,!1));}return n}function I(l,u,i){try{"function"==typeof l?l(u):l.current=u;}catch(l){n$1.__e(l,i);}}function L(l,u,i){var t,r,o;if(n$1.unmount&&n$1.unmount(l),(t=l.ref)&&(t.current&&t.current!==l.__e||I(t,null,u)),i||"function"==typeof l.type||(i=null!=(r=l.__e)),l.__e=l.__d=void 0,null!=(t=l.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount();}catch(l){n$1.__e(l,u);}t.base=t.__P=null;}if(t=l.__k)for(o=0;o<t.length;o++)t[o]&&L(t[o],u,i);null!=r&&s(r);}function M(n,l,u){return this.constructor(n,u)}function N(l,u,i){var t,r,e;n$1.__&&n$1.__(l,u),r=(t="function"==typeof i)?null:i&&i.__k||u.__k,e=[],T(u,l=(!t&&i||u).__k=a(y,null,[l]),r||o,o,void 0!==u.ownerSVGElement,!t&&i?[i]:r?null:u.firstChild?f.slice.call(u.childNodes):null,e,!t&&i?i:r?r.__e:u.firstChild,t),j(e,l);}function O(n,l){N(n,l,O);}function S(n,l,u){var i,t,r,o=arguments,f=c({},n.props);for(r in l)"key"==r?i=l[r]:"ref"==r?t=l[r]:f[r]=l[r];if(arguments.length>3)for(u=[u],r=3;r<arguments.length;r++)u.push(o[r]);return null!=u&&(f.children=u),v(n.type,f,i||n.key,t||n.ref,null)}function q(n,l){var u={__c:l="__cC"+r$1++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,i;return this.getChildContext||(u=[],(i={})[l]=this,this.getChildContext=function(){return i},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(k);},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n);};}),n.children}};return u.Provider.__=u.Consumer.contextType=u}n$1={__e:function(n,l){for(var u,i,t;l=l.__;)if((u=l.__c)&&!u.__)try{if((i=u.constructor)&&null!=i.getDerivedStateFromError&&(u.setState(i.getDerivedStateFromError(n)),t=u.__d),null!=u.componentDidCatch&&(u.componentDidCatch(n),t=u.__d),t)return u.__E=u}catch(l){n=l;}throw n},__v:0},p.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=c({},this.state),"function"==typeof n&&(n=n(c({},u),this.props)),n&&c(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),k(this));},p.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),k(this));},p.prototype.render=y,u=[],i="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,m.__r=0,r$1=0;
  
    function o$1(_,o,e,n,t){var f={};for(var l in o)"ref"!=l&&(f[l]=o[l]);var s,u,a={type:_,props:f,key:e,ref:o&&o.ref,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:++n$1.__v,__source:n,__self:t};if("function"==typeof _&&(s=_.defaultProps))for(u in s)void 0===f[u]&&(f[u]=s[u]);return n$1.vnode&&n$1.vnode(a),a}
  
    var t$2,u$1,r$2,o$2=0,i$1=[],c$1=n$1.__b,f$1=n$1.__r,e$2=n$1.diffed,a$1=n$1.__c,v$1=n$1.unmount;function m$1(t,r){n$1.__h&&n$1.__h(u$1,t,o$2||r),o$2=0;var i=u$1.__H||(u$1.__H={__:[],__h:[]});return t>=i.__.length&&i.__.push({}),i.__[t]}function l(n){return o$2=1,p$1(w$1,n)}function p$1(n,r,o){var i=m$1(t$2++,2);return i.t=n,i.__c||(i.__=[o?o(r):w$1(void 0,r),function(n){var t=i.t(i.__[0],n);i.__[0]!==t&&(i.__=[t,i.__[1]],i.__c.setState({}));}],i.__c=u$1),i.__}function y$1(r,o){var i=m$1(t$2++,3);!n$1.__s&&k$1(i.__H,o)&&(i.__=r,i.__H=o,u$1.__H.__h.push(i));}function h$1(r,o){var i=m$1(t$2++,4);!n$1.__s&&k$1(i.__H,o)&&(i.__=r,i.__H=o,u$1.__h.push(i));}function s$1(n){return o$2=5,d$1(function(){return {current:n}},[])}function _$1(n,t,u){o$2=6,h$1(function(){"function"==typeof n?n(t()):n&&(n.current=t());},null==u?u:u.concat(n));}function d$1(n,u){var r=m$1(t$2++,7);return k$1(r.__H,u)&&(r.__=n(),r.__H=u,r.__h=n),r.__}function A$1(n,t){return o$2=8,d$1(function(){return n},t)}function F(n){var r=u$1.context[n.__c],o=m$1(t$2++,9);return o.__c=n,r?(null==o.__&&(o.__=!0,r.sub(u$1)),r.props.value):n.__}function T$1(t,u){n$1.useDebugValue&&n$1.useDebugValue(u?u(t):t);}function x$1(){i$1.forEach(function(t){if(t.__P)try{t.__H.__h.forEach(g$1),t.__H.__h.forEach(j$1),t.__H.__h=[];}catch(u){t.__H.__h=[],n$1.__e(u,t.__v);}}),i$1=[];}n$1.__b=function(n){u$1=null,c$1&&c$1(n);},n$1.__r=function(n){f$1&&f$1(n),t$2=0;var r=(u$1=n.__c).__H;r&&(r.__h.forEach(g$1),r.__h.forEach(j$1),r.__h=[]);},n$1.diffed=function(t){e$2&&e$2(t);var o=t.__c;o&&o.__H&&o.__H.__h.length&&(1!==i$1.push(o)&&r$2===n$1.requestAnimationFrame||((r$2=n$1.requestAnimationFrame)||function(n){var t,u=function(){clearTimeout(r),b$1&&cancelAnimationFrame(t),setTimeout(n);},r=setTimeout(u,100);b$1&&(t=requestAnimationFrame(u));})(x$1)),u$1=void 0;},n$1.__c=function(t,u){u.some(function(t){try{t.__h.forEach(g$1),t.__h=t.__h.filter(function(n){return !n.__||j$1(n)});}catch(r){u.some(function(n){n.__h&&(n.__h=[]);}),u=[],n$1.__e(r,t.__v);}}),a$1&&a$1(t,u);},n$1.unmount=function(t){v$1&&v$1(t);var u=t.__c;if(u&&u.__H)try{u.__H.__.forEach(g$1);}catch(t){n$1.__e(t,u.__v);}};var b$1="function"==typeof requestAnimationFrame;function g$1(n){var t=u$1;"function"==typeof n.__c&&n.__c(),u$1=t;}function j$1(n){var t=u$1;n.__c=n.__(),u$1=t;}function k$1(n,t){return !n||n.length!==t.length||t.some(function(t,u){return t!==n[u]})}function w$1(n,t){return "function"==typeof t?t(n):t}
  
    var e$3,o$3={};function n$2(r,t,e){if(3===r.nodeType){var o="textContent"in r?r.textContent:r.nodeValue||"";if(!1!==n$2.options.trim){var a=0===t||t===e.length-1;if((!(o=o.match(/^[\s\n]+$/g)&&"all"!==n$2.options.trim?" ":o.replace(/(^[\s\n]+|[\s\n]+$)/g,"all"===n$2.options.trim||a?"":" "))||" "===o)&&e.length>1&&a)return null}return o}if(1!==r.nodeType)return null;var p=String(r.nodeName).toLowerCase();if("script"===p&&!n$2.options.allowScripts)return null;var l,s,u=n$2.h(p,function(r){var t=r&&r.length;if(!t)return null;for(var e={},o=0;o<t;o++){var a=r[o],i=a.name,p=a.value;"on"===i.substring(0,2)&&n$2.options.allowEvents&&(p=new Function(p)),e[i]=p;}return e}(r.attributes),(s=(l=r.childNodes)&&Array.prototype.map.call(l,n$2).filter(i$2))&&s.length?s:null);return n$2.visitor&&n$2.visitor(u),u}var a$2,i$2=function(r){return r},p$2={};function l$1(r){var t=(r.type||"").toLowerCase(),e=l$1.map;e&&e.hasOwnProperty(t)?(r.type=e[t],r.props=Object.keys(r.props||{}).reduce(function(t,e){var o;return t[(o=e,o.replace(/-(.)/g,function(r,t){return t.toUpperCase()}))]=r.props[e],t},{})):r.type=t.replace(/[^a-z0-9-]/i,"");}var Markup = (function(t){function i(){t.apply(this,arguments);}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i.setReviver=function(r){a$2=r;},i.prototype.shouldComponentUpdate=function(r){var t=this.props;return r.wrap!==t.wrap||r.type!==t.type||r.markup!==t.markup},i.prototype.setComponents=function(r){if(this.map={},r)for(var t in r)if(r.hasOwnProperty(t)){var e=t.replace(/([A-Z]+)([A-Z][a-z0-9])|([a-z0-9]+)([A-Z])/g,"$1$3-$2$4").toLowerCase();this.map[e]=r[t];}},i.prototype.render=function(t){var i=t.wrap;void 0===i&&(i=!0);var s,u=t.type,c=t.markup,m=t.components,v=t.reviver,f=t.onError,d=t["allow-scripts"],h=t["allow-events"],y=t.trim,w=function(r,t){var e={};for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&-1===t.indexOf(o)&&(e[o]=r[o]);return e}(t,["wrap","type","markup","components","reviver","onError","allow-scripts","allow-events","trim"]),C=v||this.reviver||this.constructor.prototype.reviver||a$2||a;this.setComponents(m);var g={allowScripts:d,allowEvents:h,trim:y};try{s=function(r,t,a,i,s){var u=function(r,t){var o,n,a,i,p="html"===t?"text/html":"application/xml";"html"===t?(i="body",a="<!DOCTYPE html>\n<html><body>"+r+"</body></html>"):(i="xml",a='<?xml version="1.0" encoding="UTF-8"?>\n<xml>'+r+"</xml>");try{o=(new DOMParser).parseFromString(a,p);}catch(r){n=r;}if(o||"html"!==t||((o=e$3||(e$3=function(){if(document.implementation&&document.implementation.createHTMLDocument)return document.implementation.createHTMLDocument("");var r=document.createElement("iframe");return r.style.cssText="position:absolute; left:0; top:-999em; width:1px; height:1px; overflow:hidden;",r.setAttribute("sandbox","allow-forms"),document.body.appendChild(r),r.contentWindow.document}())).open(),o.write(a),o.close()),o){var l=o.getElementsByTagName(i)[0],s=l.firstChild;return r&&!s&&(l.error="Document parse failed."),s&&"parsererror"===String(s.nodeName).toLowerCase()&&(s.removeChild(s.firstChild),s.removeChild(s.lastChild),l.error=s.textContent||s.nodeValue||n||"Unknown error",l.removeChild(s)),l}}(r,t);if(u&&u.error)throw new Error(u.error);var c=u&&u.body||u;l$1.map=i||p$2;var m=c&&function(r,t,e,a){return n$2.visitor=t,n$2.h=e,n$2.options=a||o$3,n$2(r)}(c,l$1,a,s);return l$1.map=null,m&&m.props&&m.props.children||null}(c,u,C,this.map,g);}catch(r){f?f({error:r}):"undefined"!=typeof console&&console.error&&console.error("preact-markup: "+r);}if(!1===i)return s||null;var x=w.hasOwnProperty("className")?"className":"class",b=w[x];return b?b.splice?b.splice(0,0,"markup"):"string"==typeof b?w[x]+=" markup":"object"==typeof b&&(b.markup=!0):w[x]="markup",C("div",w,s||null)},i}(p));
  
    function C$1(n,t){for(var e in t)n[e]=t[e];return n}function S$1(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}function E(n){this.props=n;}function g$2(n,t){function e(n){var e=this.props.ref,r=e==n.ref;return !r&&e&&(e.call?e(null):e.current=null),t?!t(this.props,n)||!r:S$1(this.props,n)}function r(t){return this.shouldComponentUpdate=e,a(n,t)}return r.displayName="Memo("+(n.displayName||n.name)+")",r.prototype.isReactComponent=!0,r.__f=!0,r}(E.prototype=new p).isPureReactComponent=!0,E.prototype.shouldComponentUpdate=function(n,t){return S$1(this.props,n)||S$1(this.state,t)};var w$2=n$1.__b;n$1.__b=function(n){n.type&&n.type.__f&&n.ref&&(n.props.ref=n.ref,n.ref=null),w$2&&w$2(n);};var R="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function x$2(n){function t(t,e){var r=C$1({},t);return delete r.ref,n(r,(e=t.ref||e)&&("object"!=typeof e||"current"in e)?e:null)}return t.$$typeof=R,t.render=t,t.prototype.isReactComponent=t.__f=!0,t.displayName="ForwardRef("+(n.displayName||n.name)+")",t}var N$1=function(n,t){return null==n?null:w(w(n).map(t))},k$2={map:N$1,forEach:N$1,count:function(n){return n?w(n).length:0},only:function(n){var t=w(n);if(1!==t.length)throw "Children.only";return t[0]},toArray:w},A$2=n$1.__e;function O$1(){this.__u=0,this.t=null,this.__b=null;}function L$1(n){var t=n.__.__c;return t&&t.__e&&t.__e(n)}function U(n){var t,e,r;function u(u){if(t||(t=n()).then(function(n){e=n.default||n;},function(n){r=n;}),r)throw r;if(!e)throw t;return a(e,u)}return u.displayName="Lazy",u.__f=!0,u}function D(){this.u=null,this.o=null;}n$1.__e=function(n,t,e){if(n.then)for(var r,u=t;u=u.__;)if((r=u.__c)&&r.__c)return null==t.__e&&(t.__e=e.__e,t.__k=e.__k),r.__c(n,t);A$2(n,t,e);},(O$1.prototype=new p).__c=function(n,t){var e=t.__c,r=this;null==r.t&&(r.t=[]),r.t.push(e);var u=L$1(r.__v),o=!1,i=function(){o||(o=!0,e.componentWillUnmount=e.__c,u?u(l):l());};e.__c=e.componentWillUnmount,e.componentWillUnmount=function(){i(),e.__c&&e.__c();};var l=function(){if(!--r.__u){if(r.state.__e){var n=r.state.__e;r.__v.__k[0]=function n(t,e,r){return t&&(t.__v=null,t.__k=t.__k&&t.__k.map(function(t){return n(t,e,r)}),t.__c&&t.__c.__P===e&&(t.__e&&r.insertBefore(t.__e,t.__d),t.__c.__e=!0,t.__c.__P=r)),t}(n,n.__c.__P,n.__c.__O);}var t;for(r.setState({__e:r.__b=null});t=r.t.pop();)t.forceUpdate();}},f=!0===t.__h;r.__u++||f||r.setState({__e:r.__b=r.__v.__k[0]}),n.then(i,i);},O$1.prototype.componentWillUnmount=function(){this.t=[];},O$1.prototype.render=function(n,t){if(this.__b){if(this.__v.__k){var e=document.createElement("div"),r=this.__v.__k[0].__c;this.__v.__k[0]=function n(t,e,r){return t&&(t.__c&&t.__c.__H&&(t.__c.__H.__.forEach(function(n){"function"==typeof n.__c&&n.__c();}),t.__c.__H=null),null!=(t=C$1({},t)).__c&&(t.__c.__P===r&&(t.__c.__P=e),t.__c=null),t.__k=t.__k&&t.__k.map(function(t){return n(t,e,r)})),t}(this.__b,e,r.__O=r.__P);}this.__b=null;}var u=t.__e&&a(y,null,n.fallback);return u&&(u.__h=null),[a(y,null,t.__e?null:n.children),u]};var F$1=function(n,t,e){if(++e[1]===e[0]&&n.o.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.o.size))for(e=n.u;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.u=e=e[2];}};function M$1(n){return this.getChildContext=function(){return n.context},n.children}function T$2(n){var t=this,e=n.i;t.componentWillUnmount=function(){N(null,t.l),t.l=null,t.i=null;},t.i&&t.i!==e&&t.componentWillUnmount(),n.__v?(t.l||(t.i=e,t.l={nodeType:1,parentNode:e,childNodes:[],appendChild:function(n){this.childNodes.push(n),t.i.appendChild(n);},insertBefore:function(n,e){this.childNodes.push(n),t.i.appendChild(n);},removeChild:function(n){this.childNodes.splice(this.childNodes.indexOf(n)>>>1,1),t.i.removeChild(n);}}),N(a(M$1,{context:t.context},n.__v),t.l)):t.l&&t.componentWillUnmount();}function j$2(n,t){return a(T$2,{__v:n,i:t})}(D.prototype=new p).__e=function(n){var t=this,e=L$1(t.__v),r=t.o.get(n);return r[0]++,function(u){var o=function(){t.props.revealOrder?(r.push(u),F$1(t,n,r)):u();};e?e(o):o();}},D.prototype.render=function(n){this.u=null,this.o=new Map;var t=w(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.o.set(t[e],this.u=[1,0,this.u]);return n.children},D.prototype.componentDidUpdate=D.prototype.componentDidMount=function(){var n=this;this.o.forEach(function(t,e){F$1(n,e,t);});};var I$1="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,W=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,P$1=function(n){return ("undefined"!=typeof Symbol&&"symbol"==typeof Symbol()?/fil|che|rad/i:/fil|che|ra/i).test(n)};function V(n,t,e){return null==t.__k&&(t.textContent=""),N(n,t),"function"==typeof e&&e(),n?n.__c:null}function z$1(n,t,e){return O(n,t),"function"==typeof e&&e(),n?n.__c:null}p.prototype.isReactComponent={},["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(n){Object.defineProperty(p.prototype,n,{configurable:!0,get:function(){return this["UNSAFE_"+n]},set:function(t){Object.defineProperty(this,n,{configurable:!0,writable:!0,value:t});}});});var B=n$1.event;function H$1(){}function Z(){return this.cancelBubble}function Y(){return this.defaultPrevented}n$1.event=function(n){return B&&(n=B(n)),n.persist=H$1,n.isPropagationStopped=Z,n.isDefaultPrevented=Y,n.nativeEvent=n};var $$1,q$1={configurable:!0,get:function(){return this.class}},G=n$1.vnode;n$1.vnode=function(n){var t=n.type,e=n.props,r=e;if("string"==typeof t){for(var u in r={},e){var o=e[u];"value"===u&&"defaultValue"in e&&null==o||("defaultValue"===u&&"value"in e&&null==e.value?u="value":"download"===u&&!0===o?o="":/ondoubleclick/i.test(u)?u="ondblclick":/^onchange(textarea|input)/i.test(u+t)&&!P$1(e.type)?u="oninput":/^on(Ani|Tra|Tou|BeforeInp)/.test(u)?u=u.toLowerCase():W.test(u)?u=u.replace(/[A-Z0-9]/,"-$&").toLowerCase():null===o&&(o=void 0),r[u]=o);}"select"==t&&r.multiple&&Array.isArray(r.value)&&(r.value=w(e.children).forEach(function(n){n.props.selected=-1!=r.value.indexOf(n.props.value);})),"select"==t&&null!=r.defaultValue&&(r.value=w(e.children).forEach(function(n){n.props.selected=r.multiple?-1!=r.defaultValue.indexOf(n.props.value):r.defaultValue==n.props.value;})),n.props=r;}t&&e.class!=e.className&&(q$1.enumerable="className"in e,null!=e.className&&(r.class=e.className),Object.defineProperty(r,"className",q$1)),n.$$typeof=I$1,G&&G(n);};var J=n$1.__r;n$1.__r=function(n){J&&J(n),$$1=n.__c;};var K={ReactCurrentDispatcher:{current:{readContext:function(n){return $$1.__n[n.__c].props.value}}}};"object"==typeof performance&&"function"==typeof performance.now?performance.now.bind(performance):function(){return Date.now()};function ln(n){return a.bind(null,n)}function fn(n){return !!n&&n.$$typeof===I$1}function cn(n){return fn(n)?S.apply(null,arguments):n}function an(n){return !!n.__k&&(N(null,n),!0)}function sn(n){return n&&(n.base||1===n.nodeType&&n)||null}var hn=function(n,t){return n(t)};var React = {useState:l,useReducer:p$1,useEffect:y$1,useLayoutEffect:h$1,useRef:s$1,useImperativeHandle:_$1,useMemo:d$1,useCallback:A$1,useContext:F,useDebugValue:T$1,version:"16.8.0",Children:k$2,render:V,hydrate:z$1,unmountComponentAtNode:an,createPortal:j$2,createElement:a,createContext:q,createFactory:ln,cloneElement:cn,createRef:h,Fragment:y,isValidElement:fn,findDOMNode:sn,Component:p,PureComponent:E,memo:g$2,forwardRef:x$2,unstable_batchedUpdates:hn,StrictMode:y,Suspense:O$1,SuspenseList:D,lazy:U,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:K};
  
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
      //去除 bpmn 版权，开源不容易 官方不去除 bpmn 版权信息，如果 老铁们想去除 注释上面 开放下面即可
      // return o$1("form", {
      //      class: "fjs-form",
      //      onSubmit: handleSubmit,
      //      onReset: handleReset,
      //      children: [o$1(FormField, {
      //        field: schema,
      //        onChange: onChange
      //      })]
      //    });
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
    Select.label = 'Select';
  
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
  
    const schemaVersion = 1;
  
    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
  
    var arrayMove = {exports: {}};
  
    const arrayMoveMutate = (array, from, to) => {
        const startIndex = from < 0 ? array.length + from : from;
  
        if (startIndex >= 0 && startIndex < array.length) {
            const endIndex = to < 0 ? array.length + to : to;
  
            const [item] = array.splice(from, 1);
            array.splice(endIndex, 0, item);
        }
    };
  
    const arrayMove$1 = (array, from, to) => {
        array = [...array];
        arrayMoveMutate(array, from, to);
        return array;
    };
  
    arrayMove.exports = arrayMove$1;
    var mutate = arrayMove.exports.mutate = arrayMoveMutate;
  
    var atoa = function atoa (a, n) { return Array.prototype.slice.call(a, n); };
  
    var si = typeof setImmediate === 'function', tick;
    if (si) {
      tick = function (fn) { setImmediate(fn); };
    } else if (typeof process !== 'undefined' && process.nextTick) {
      tick = process.nextTick;
    } else {
      tick = function (fn) { setTimeout(fn, 0); };
    }
  
    var ticky = tick;
  
    var ticky$1 = ticky;
  
    var debounce$1 = function debounce (fn, args, ctx) {
      if (!fn) { return; }
      ticky$1(function run () {
        fn.apply(ctx || null, args || []);
      });
    };
  
    var atoa$1 = atoa;
    var debounce$2 = debounce$1;
  
    var emitter = function emitter (thing, options) {
      var opts = options || {};
      var evt = {};
      if (thing === undefined) { thing = {}; }
      thing.on = function (type, fn) {
        if (!evt[type]) {
          evt[type] = [fn];
        } else {
          evt[type].push(fn);
        }
        return thing;
      };
      thing.once = function (type, fn) {
        fn._once = true; // thing.off(fn) still works!
        thing.on(type, fn);
        return thing;
      };
      thing.off = function (type, fn) {
        var c = arguments.length;
        if (c === 1) {
          delete evt[type];
        } else if (c === 0) {
          evt = {};
        } else {
          var et = evt[type];
          if (!et) { return thing; }
          et.splice(et.indexOf(fn), 1);
        }
        return thing;
      };
      thing.emit = function () {
        var args = atoa$1(arguments);
        return thing.emitterSnapshot(args.shift()).apply(this, args);
      };
      thing.emitterSnapshot = function (type) {
        var et = (evt[type] || []).slice(0);
        return function () {
          var args = atoa$1(arguments);
          var ctx = this || thing;
          if (type === 'error' && opts.throws !== false && !et.length) { throw args.length === 1 ? args[0] : args; }
          et.forEach(function emitter (listen) {
            if (opts.async) { debounce$2(listen, args, ctx); } else { listen.apply(ctx, args); }
            if (listen._once) { thing.off(type, listen); }
          });
          return thing;
        };
      };
      return thing;
    };
  
    var NativeCustomEvent = commonjsGlobal.CustomEvent;
  
    function useNative () {
      try {
        var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
        return  'cat' === p.type && 'bar' === p.detail.foo;
      } catch (e) {
      }
      return false;
    }
  
    /**
     * Cross-browser `CustomEvent` constructor.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
     *
     * @public
     */
  
    var customEvent = useNative() ? NativeCustomEvent :
  
    // IE >= 9
    'undefined' !== typeof document && 'function' === typeof document.createEvent ? function CustomEvent (type, params) {
      var e = document.createEvent('CustomEvent');
      if (params) {
        e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
      } else {
        e.initCustomEvent(type, false, false, void 0);
      }
      return e;
    } :
  
    // IE <= 8
    function CustomEvent (type, params) {
      var e = document.createEventObject();
      e.type = type;
      if (params) {
        e.bubbles = Boolean(params.bubbles);
        e.cancelable = Boolean(params.cancelable);
        e.detail = params.detail;
      } else {
        e.bubbles = false;
        e.cancelable = false;
        e.detail = void 0;
      }
      return e;
    };
  
    var eventmap = [];
    var eventname = '';
    var ron = /^on/;
  
    for (eventname in commonjsGlobal) {
      if (ron.test(eventname)) {
        eventmap.push(eventname.slice(2));
      }
    }
  
    var eventmap_1 = eventmap;
  
    var customEvent$1 = customEvent;
    var eventmap$1 = eventmap_1;
    var doc = commonjsGlobal.document;
    var addEvent = addEventEasy;
    var removeEvent = removeEventEasy;
    var hardCache = [];
  
    if (!commonjsGlobal.addEventListener) {
      addEvent = addEventHard;
      removeEvent = removeEventHard;
    }
  
    var crossvent = {
      add: addEvent,
      remove: removeEvent,
      fabricate: fabricateEvent
    };
  
    function addEventEasy (el, type, fn, capturing) {
      return el.addEventListener(type, fn, capturing);
    }
  
    function addEventHard (el, type, fn) {
      return el.attachEvent('on' + type, wrap(el, type, fn));
    }
  
    function removeEventEasy (el, type, fn, capturing) {
      return el.removeEventListener(type, fn, capturing);
    }
  
    function removeEventHard (el, type, fn) {
      var listener = unwrap(el, type, fn);
      if (listener) {
        return el.detachEvent('on' + type, listener);
      }
    }
  
    function fabricateEvent (el, type, model) {
      var e = eventmap$1.indexOf(type) === -1 ? makeCustomEvent() : makeClassicEvent();
      if (el.dispatchEvent) {
        el.dispatchEvent(e);
      } else {
        el.fireEvent('on' + type, e);
      }
      function makeClassicEvent () {
        var e;
        if (doc.createEvent) {
          e = doc.createEvent('Event');
          e.initEvent(type, true, true);
        } else if (doc.createEventObject) {
          e = doc.createEventObject();
        }
        return e;
      }
      function makeCustomEvent () {
        return new customEvent$1(type, { detail: model });
      }
    }
  
    function wrapperFactory (el, type, fn) {
      return function wrapper (originalEvent) {
        var e = originalEvent || commonjsGlobal.event;
        e.target = e.target || e.srcElement;
        e.preventDefault = e.preventDefault || function preventDefault () { e.returnValue = false; };
        e.stopPropagation = e.stopPropagation || function stopPropagation () { e.cancelBubble = true; };
        e.which = e.which || e.keyCode;
        fn.call(el, e);
      };
    }
  
    function wrap (el, type, fn) {
      var wrapper = unwrap(el, type, fn) || wrapperFactory(el, type, fn);
      hardCache.push({
        wrapper: wrapper,
        element: el,
        type: type,
        fn: fn
      });
      return wrapper;
    }
  
    function unwrap (el, type, fn) {
      var i = find(el, type, fn);
      if (i) {
        var wrapper = hardCache[i].wrapper;
        hardCache.splice(i, 1); // free up a tad of memory
        return wrapper;
      }
    }
  
    function find (el, type, fn) {
      var i, item;
      for (i = 0; i < hardCache.length; i++) {
        item = hardCache[i];
        if (item.element === el && item.type === type && item.fn === fn) {
          return i;
        }
      }
    }
  
    var cache = {};
    var start = '(?:^|\\s)';
    var end = '(?:\\s|$)';
  
    function lookupClass (className) {
      var cached = cache[className];
      if (cached) {
        cached.lastIndex = 0;
      } else {
        cache[className] = cached = new RegExp(start + className + end, 'g');
      }
      return cached;
    }
  
    function addClass (el, className) {
      var current = el.className;
      if (!current.length) {
        el.className = className;
      } else if (!lookupClass(className).test(current)) {
        el.className += ' ' + className;
      }
    }
  
    function rmClass (el, className) {
      el.className = el.className.replace(lookupClass(className), ' ').trim();
    }
  
    var classes = {
      add: addClass,
      rm: rmClass
    };
  
    var emitter$1 = emitter;
    var crossvent$1 = crossvent;
    var classes$1 = classes;
    var doc$1 = document;
    var documentElement = doc$1.documentElement;
  
    function dragula (initialContainers, options) {
      var len = arguments.length;
      if (len === 1 && Array.isArray(initialContainers) === false) {
        options = initialContainers;
        initialContainers = [];
      }
      var _mirror; // mirror image
      var _source; // source container
      var _item; // item being dragged
      var _offsetX; // reference x
      var _offsetY; // reference y
      var _moveX; // reference move x
      var _moveY; // reference move y
      var _initialSibling; // reference sibling when grabbed
      var _currentSibling; // reference sibling now
      var _copy; // item used for copying
      var _renderTimer; // timer for setTimeout renderMirrorImage
      var _lastDropTarget = null; // last container item was over
      var _grabbed; // holds mousedown context until first mousemove
  
      var o = options || {};
      if (o.moves === void 0) { o.moves = always; }
      if (o.accepts === void 0) { o.accepts = always; }
      if (o.invalid === void 0) { o.invalid = invalidTarget; }
      if (o.containers === void 0) { o.containers = initialContainers || []; }
      if (o.isContainer === void 0) { o.isContainer = never; }
      if (o.copy === void 0) { o.copy = false; }
      if (o.copySortSource === void 0) { o.copySortSource = false; }
      if (o.revertOnSpill === void 0) { o.revertOnSpill = false; }
      if (o.removeOnSpill === void 0) { o.removeOnSpill = false; }
      if (o.direction === void 0) { o.direction = 'vertical'; }
      if (o.ignoreInputTextSelection === void 0) { o.ignoreInputTextSelection = true; }
      if (o.mirrorContainer === void 0) { o.mirrorContainer = doc$1.body; }
  
      var drake = emitter$1({
        containers: o.containers,
        start: manualStart,
        end: end,
        cancel: cancel,
        remove: remove,
        destroy: destroy,
        canMove: canMove,
        dragging: false
      });
  
      if (o.removeOnSpill === true) {
        drake.on('over', spillOver).on('out', spillOut);
      }
  
      events();
  
      return drake;
  
      function isContainer (el) {
        return drake.containers.indexOf(el) !== -1 || o.isContainer(el);
      }
  
      function events (remove) {
        var op = remove ? 'remove' : 'add';
        touchy(documentElement, op, 'mousedown', grab);
        touchy(documentElement, op, 'mouseup', release);
      }
  
      function eventualMovements (remove) {
        var op = remove ? 'remove' : 'add';
        touchy(documentElement, op, 'mousemove', startBecauseMouseMoved);
      }
  
      function movements (remove) {
        var op = remove ? 'remove' : 'add';
        crossvent$1[op](documentElement, 'selectstart', preventGrabbed); // IE8
        crossvent$1[op](documentElement, 'click', preventGrabbed);
      }
  
      function destroy () {
        events(true);
        release({});
      }
  
      function preventGrabbed (e) {
        if (_grabbed) {
          e.preventDefault();
        }
      }
  
      function grab (e) {
        _moveX = e.clientX;
        _moveY = e.clientY;
  
        var ignore = whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
        if (ignore) {
          return; // we only care about honest-to-god left clicks and touch events
        }
        var item = e.target;
        var context = canStart(item);
        if (!context) {
          return;
        }
        _grabbed = context;
        eventualMovements();
        if (e.type === 'mousedown') {
          if (isInput(item)) { // see also: https://github.com/bevacqua/dragula/issues/208
            item.focus(); // fixes https://github.com/bevacqua/dragula/issues/176
          } else {
            e.preventDefault(); // fixes https://github.com/bevacqua/dragula/issues/155
          }
        }
      }
  
      function startBecauseMouseMoved (e) {
        if (!_grabbed) {
          return;
        }
        if (whichMouseButton(e) === 0) {
          release({});
          return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
        }
  
        // truthy check fixes #239, equality fixes #207, fixes #501
        if ((e.clientX !== void 0 && Math.abs(e.clientX - _moveX) <= (o.slideFactorX || 0)) &&
          (e.clientY !== void 0 && Math.abs(e.clientY - _moveY) <= (o.slideFactorY || 0))) {
          return;
        }
  
        if (o.ignoreInputTextSelection) {
          var clientX = getCoord('clientX', e) || 0;
          var clientY = getCoord('clientY', e) || 0;
          var elementBehindCursor = doc$1.elementFromPoint(clientX, clientY);
          if (isInput(elementBehindCursor)) {
            return;
          }
        }
  
        var grabbed = _grabbed; // call to end() unsets _grabbed
        eventualMovements(true);
        movements();
        end();
        start(grabbed);
  
        var offset = getOffset(_item);
        _offsetX = getCoord('pageX', e) - offset.left;
        _offsetY = getCoord('pageY', e) - offset.top;
  
        classes$1.add(_copy || _item, 'gu-transit');
        renderMirrorImage();
        drag(e);
      }
  
      function canStart (item) {
        if (drake.dragging && _mirror) {
          return;
        }
        if (isContainer(item)) {
          return; // don't drag container itself
        }
        var handle = item;
        while (getParent(item) && isContainer(getParent(item)) === false) {
          if (o.invalid(item, handle)) {
            return;
          }
          item = getParent(item); // drag target should be a top element
          if (!item) {
            return;
          }
        }
        var source = getParent(item);
        if (!source) {
          return;
        }
        if (o.invalid(item, handle)) {
          return;
        }
  
        var movable = o.moves(item, source, handle, nextEl(item));
        if (!movable) {
          return;
        }
  
        return {
          item: item,
          source: source
        };
      }
  
      function canMove (item) {
        return !!canStart(item);
      }
  
      function manualStart (item) {
        var context = canStart(item);
        if (context) {
          start(context);
        }
      }
  
      function start (context) {
        if (isCopy(context.item, context.source)) {
          _copy = context.item.cloneNode(true);
          drake.emit('cloned', _copy, context.item, 'copy');
        }
  
        _source = context.source;
        _item = context.item;
        _initialSibling = _currentSibling = nextEl(context.item);
  
        drake.dragging = true;
        drake.emit('drag', _item, _source);
      }
  
      function invalidTarget () {
        return false;
      }
  
      function end () {
        if (!drake.dragging) {
          return;
        }
        var item = _copy || _item;
        drop(item, getParent(item));
      }
  
      function ungrab () {
        _grabbed = false;
        eventualMovements(true);
        movements(true);
      }
  
      function release (e) {
        ungrab();
  
        if (!drake.dragging) {
          return;
        }
        var item = _copy || _item;
        var clientX = getCoord('clientX', e) || 0;
        var clientY = getCoord('clientY', e) || 0;
        var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
        var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
        if (dropTarget && ((_copy && o.copySortSource) || (!_copy || dropTarget !== _source))) {
          drop(item, dropTarget);
        } else if (o.removeOnSpill) {
          remove();
        } else {
          cancel();
        }
      }
  
      function drop (item, target) {
        var parent = getParent(item);
        if (_copy && o.copySortSource && target === _source) {
          parent.removeChild(_item);
        }
        if (isInitialPlacement(target)) {
          drake.emit('cancel', item, _source, _source);
        } else {
          drake.emit('drop', item, target, _source, _currentSibling);
        }
        cleanup();
      }
  
      function remove () {
        if (!drake.dragging) {
          return;
        }
        var item = _copy || _item;
        var parent = getParent(item);
        if (parent) {
          parent.removeChild(item);
        }
        drake.emit(_copy ? 'cancel' : 'remove', item, parent, _source);
        cleanup();
      }
  
      function cancel (revert) {
        if (!drake.dragging) {
          return;
        }
        var reverts = arguments.length > 0 ? revert : o.revertOnSpill;
        var item = _copy || _item;
        var parent = getParent(item);
        var initial = isInitialPlacement(parent);
        if (initial === false && reverts) {
          if (_copy) {
            if (parent) {
              parent.removeChild(_copy);
            }
          } else {
            _source.insertBefore(item, _initialSibling);
          }
        }
        if (initial || reverts) {
          drake.emit('cancel', item, _source, _source);
        } else {
          drake.emit('drop', item, parent, _source, _currentSibling);
        }
        cleanup();
      }
  
      function cleanup () {
        var item = _copy || _item;
        ungrab();
        removeMirrorImage();
        if (item) {
          classes$1.rm(item, 'gu-transit');
        }
        if (_renderTimer) {
          clearTimeout(_renderTimer);
        }
        drake.dragging = false;
        if (_lastDropTarget) {
          drake.emit('out', item, _lastDropTarget, _source);
        }
        drake.emit('dragend', item);
        _source = _item = _copy = _initialSibling = _currentSibling = _renderTimer = _lastDropTarget = null;
      }
  
      function isInitialPlacement (target, s) {
        var sibling;
        if (s !== void 0) {
          sibling = s;
        } else if (_mirror) {
          sibling = _currentSibling;
        } else {
          sibling = nextEl(_copy || _item);
        }
        return target === _source && sibling === _initialSibling;
      }
  
      function findDropTarget (elementBehindCursor, clientX, clientY) {
        var target = elementBehindCursor;
        while (target && !accepted()) {
          target = getParent(target);
        }
        return target;
  
        function accepted () {
          var droppable = isContainer(target);
          if (droppable === false) {
            return false;
          }
  
          var immediate = getImmediateChild(target, elementBehindCursor);
          var reference = getReference(target, immediate, clientX, clientY);
          var initial = isInitialPlacement(target, reference);
          if (initial) {
            return true; // should always be able to drop it right back where it was
          }
          return o.accepts(_item, target, _source, reference);
        }
      }
  
      function drag (e) {
        if (!_mirror) {
          return;
        }
        e.preventDefault();
  
        var clientX = getCoord('clientX', e) || 0;
        var clientY = getCoord('clientY', e) || 0;
        var x = clientX - _offsetX;
        var y = clientY - _offsetY;
  
        _mirror.style.left = x + 'px';
        _mirror.style.top = y + 'px';
  
        var item = _copy || _item;
        var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
        var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
        var changed = dropTarget !== null && dropTarget !== _lastDropTarget;
        if (changed || dropTarget === null) {
          out();
          _lastDropTarget = dropTarget;
          over();
        }
        var parent = getParent(item);
        if (dropTarget === _source && _copy && !o.copySortSource) {
          if (parent) {
            parent.removeChild(item);
          }
          return;
        }
        var reference;
        var immediate = getImmediateChild(dropTarget, elementBehindCursor);
        if (immediate !== null) {
          reference = getReference(dropTarget, immediate, clientX, clientY);
        } else if (o.revertOnSpill === true && !_copy) {
          reference = _initialSibling;
          dropTarget = _source;
        } else {
          if (_copy && parent) {
            parent.removeChild(item);
          }
          return;
        }
        if (
          (reference === null && changed) ||
          reference !== item &&
          reference !== nextEl(item)
        ) {
          _currentSibling = reference;
          dropTarget.insertBefore(item, reference);
          drake.emit('shadow', item, dropTarget, _source);
        }
        function moved (type) { drake.emit(type, item, _lastDropTarget, _source); }
        function over () { if (changed) { moved('over'); } }
        function out () { if (_lastDropTarget) { moved('out'); } }
      }
  
      function spillOver (el) {
        classes$1.rm(el, 'gu-hide');
      }
  
      function spillOut (el) {
        if (drake.dragging) { classes$1.add(el, 'gu-hide'); }
      }
  
      function renderMirrorImage () {
        if (_mirror) {
          return;
        }
        var rect = _item.getBoundingClientRect();
        _mirror = _item.cloneNode(true);
        _mirror.style.width = getRectWidth(rect) + 'px';
        _mirror.style.height = getRectHeight(rect) + 'px';
        classes$1.rm(_mirror, 'gu-transit');
        classes$1.add(_mirror, 'gu-mirror');
        o.mirrorContainer.appendChild(_mirror);
        touchy(documentElement, 'add', 'mousemove', drag);
        classes$1.add(o.mirrorContainer, 'gu-unselectable');
        drake.emit('cloned', _mirror, _item, 'mirror');
      }
  
      function removeMirrorImage () {
        if (_mirror) {
          classes$1.rm(o.mirrorContainer, 'gu-unselectable');
          touchy(documentElement, 'remove', 'mousemove', drag);
          getParent(_mirror).removeChild(_mirror);
          _mirror = null;
        }
      }
  
      function getImmediateChild (dropTarget, target) {
        var immediate = target;
        while (immediate !== dropTarget && getParent(immediate) !== dropTarget) {
          immediate = getParent(immediate);
        }
        if (immediate === documentElement) {
          return null;
        }
        return immediate;
      }
  
      function getReference (dropTarget, target, x, y) {
        var horizontal = o.direction === 'horizontal';
        var reference = target !== dropTarget ? inside() : outside();
        return reference;
  
        function outside () { // slower, but able to figure out any position
          var len = dropTarget.children.length;
          var i;
          var el;
          var rect;
          for (i = 0; i < len; i++) {
            el = dropTarget.children[i];
            rect = el.getBoundingClientRect();
            if (horizontal && (rect.left + rect.width / 2) > x) { return el; }
            if (!horizontal && (rect.top + rect.height / 2) > y) { return el; }
          }
          return null;
        }
  
        function inside () { // faster, but only available if dropped inside a child element
          var rect = target.getBoundingClientRect();
          if (horizontal) {
            return resolve(x > rect.left + getRectWidth(rect) / 2);
          }
          return resolve(y > rect.top + getRectHeight(rect) / 2);
        }
  
        function resolve (after) {
          return after ? nextEl(target) : target;
        }
      }
  
      function isCopy (item, container) {
        return typeof o.copy === 'boolean' ? o.copy : o.copy(item, container);
      }
    }
  
    function touchy (el, op, type, fn) {
      var touch = {
        mouseup: 'touchend',
        mousedown: 'touchstart',
        mousemove: 'touchmove'
      };
      var pointers = {
        mouseup: 'pointerup',
        mousedown: 'pointerdown',
        mousemove: 'pointermove'
      };
      var microsoft = {
        mouseup: 'MSPointerUp',
        mousedown: 'MSPointerDown',
        mousemove: 'MSPointerMove'
      };
      if (commonjsGlobal.navigator.pointerEnabled) {
        crossvent$1[op](el, pointers[type], fn);
      } else if (commonjsGlobal.navigator.msPointerEnabled) {
        crossvent$1[op](el, microsoft[type], fn);
      } else {
        crossvent$1[op](el, touch[type], fn);
        crossvent$1[op](el, type, fn);
      }
    }
  
    function whichMouseButton (e) {
      if (e.touches !== void 0) { return e.touches.length; }
      if (e.which !== void 0 && e.which !== 0) { return e.which; } // see https://github.com/bevacqua/dragula/issues/261
      if (e.buttons !== void 0) { return e.buttons; }
      var button = e.button;
      if (button !== void 0) { // see https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
        return button & 1 ? 1 : button & 2 ? 3 : (button & 4 ? 2 : 0);
      }
    }
  
    function getOffset (el) {
      var rect = el.getBoundingClientRect();
      return {
        left: rect.left + getScroll('scrollLeft', 'pageXOffset'),
        top: rect.top + getScroll('scrollTop', 'pageYOffset')
      };
    }
  
    function getScroll (scrollProp, offsetProp) {
      if (typeof commonjsGlobal[offsetProp] !== 'undefined') {
        return commonjsGlobal[offsetProp];
      }
      if (documentElement.clientHeight) {
        return documentElement[scrollProp];
      }
      return doc$1.body[scrollProp];
    }
  
    function getElementBehindPoint (point, x, y) {
      point = point || {};
      var state = point.className || '';
      var el;
      point.className += ' gu-hide';
      el = doc$1.elementFromPoint(x, y);
      point.className = state;
      return el;
    }
  
    function never () { return false; }
    function always () { return true; }
    function getRectWidth (rect) { return rect.width || (rect.right - rect.left); }
    function getRectHeight (rect) { return rect.height || (rect.bottom - rect.top); }
    function getParent (el) { return el.parentNode === doc$1 ? null : el.parentNode; }
    function isInput (el) { return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || isEditable(el); }
    function isEditable (el) {
      if (!el) { return false; } // no parents were editable
      if (el.contentEditable === 'false') { return false; } // stop the lookup
      if (el.contentEditable === 'true') { return true; } // found a contentEditable element in the chain
      return isEditable(getParent(el)); // contentEditable is set to 'inherit'
    }
  
    function nextEl (el) {
      return el.nextElementSibling || manually();
      function manually () {
        var sibling = el;
        do {
          sibling = sibling.nextSibling;
        } while (sibling && sibling.nodeType !== 1);
        return sibling;
      }
    }
  
    function getEventHost (e) {
      // on touchend event, we have to use `e.changedTouches`
      // see http://stackoverflow.com/questions/7192563/touchend-event-properties
      // see https://github.com/bevacqua/dragula/issues/34
      if (e.targetTouches && e.targetTouches.length) {
        return e.targetTouches[0];
      }
      if (e.changedTouches && e.changedTouches.length) {
        return e.changedTouches[0];
      }
      return e;
    }
  
    function getCoord (coord, e) {
      var host = getEventHost(e);
      var missMap = {
        pageX: 'clientX', // IE8
        pageY: 'clientY' // IE8
      };
      if (coord in missMap && !(coord in host) && missMap[coord] in host) {
        coord = missMap[coord];
      }
      return host[coord];
    }
  
    var dragula_1 = dragula;
  
    /**
     * Set attribute `name` to `val`, or get attr `name`.
     *
     * @param {Element} el
     * @param {String} name
     * @param {String} [val]
     * @api public
     */
  
    var proto = typeof Element !== 'undefined' ? Element.prototype : {};
    var vendor = proto.matches
      || proto.matchesSelector
      || proto.webkitMatchesSelector
      || proto.mozMatchesSelector
      || proto.msMatchesSelector
      || proto.oMatchesSelector;
  
    var matchesSelector = match;
  
    /**
     * Match `el` to `selector`.
     *
     * @param {Element} el
     * @param {String} selector
     * @return {Boolean}
     * @api public
     */
  
    function match(el, selector) {
      if (!el || el.nodeType !== 1) return false;
      if (vendor) return vendor.call(el, selector);
      var nodes = el.parentNode.querySelectorAll(selector);
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i] == el) return true;
      }
      return false;
    }
  
    var bind$1 = window.addEventListener ? 'addEventListener' : 'attachEvent',
        unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
        prefix = bind$1 !== 'addEventListener' ? 'on' : '';
  
    /**
     * Bind `el` event `type` to `fn`.
     *
     * @param {Element} el
     * @param {String} type
     * @param {Function} fn
     * @param {Boolean} capture
     * @return {Function}
     * @api public
     */
  
    var bind_1 = function(el, type, fn, capture){
      el[bind$1](prefix + type, fn, capture || false);
      return fn;
    };
  
    /**
     * Unbind `el` event `type`'s callback `fn`.
     *
     * @param {Element} el
     * @param {String} type
     * @param {Function} fn
     * @param {Boolean} capture
     * @return {Function}
     * @api public
     */
  
    var unbind_1 = function(el, type, fn, capture){
      el[unbind](prefix + type, fn, capture || false);
      return fn;
    };
  
    var componentEvent = {
        bind: bind_1,
        unbind: unbind_1
    };
    var bugTestDiv;
    if (typeof document !== 'undefined') {
      bugTestDiv = document.createElement('div');
      // Setup
      bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
      // Make sure that link elements get serialized correctly by innerHTML
      // This requires a wrapper element in IE
      !bugTestDiv.getElementsByTagName('link').length;
      bugTestDiv = undefined;
    }
  
    var FN_REF$1 = '__fn';
    var DEFAULT_PRIORITY$1 = 1000;
    var slice$1 = Array.prototype.slice;
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
  
    function EventBus$1() {
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
  
    EventBus$1.prototype.on = function (events, priority, callback, that) {
      events = isArray(events) ? events : [events];
  
      if (isFunction(priority)) {
        that = callback;
        callback = priority;
        priority = DEFAULT_PRIORITY$1;
      }
  
      if (!isNumber(priority)) {
        throw new Error('priority must be a number');
      }
  
      var actualCallback = callback;
  
      if (that) {
        actualCallback = bind(callback, that); // make sure we remember and are able to remove
        // bound callbacks via {@link #off} using the original
        // callback
  
        actualCallback[FN_REF$1] = callback[FN_REF$1] || callback;
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
  
  
    EventBus$1.prototype.once = function (event, priority, callback, that) {
      var self = this;
  
      if (isFunction(priority)) {
        that = callback;
        callback = priority;
        priority = DEFAULT_PRIORITY$1;
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
  
  
      wrappedCallback[FN_REF$1] = callback;
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
  
  
    EventBus$1.prototype.off = function (events, callback) {
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
  
  
    EventBus$1.prototype.createEvent = function (data) {
      var event = new InternalEvent$1();
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
  
  
    EventBus$1.prototype.fire = function (type, data) {
      var event, firstListener, returnValue, args;
      args = slice$1.call(arguments);
  
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
  
  
      if (data instanceof InternalEvent$1) {
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
  
    EventBus$1.prototype.handleError = function (error) {
      return this.fire('error', {
        error: error
      }) === false;
    };
  
    EventBus$1.prototype._destroy = function () {
      this._listeners = {};
    };
  
    EventBus$1.prototype._invokeListeners = function (event, args, listener) {
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
  
    EventBus$1.prototype._invokeListener = function (event, args, listener) {
      var returnValue;
  
      if (listener.callback.__isTomb) {
        return returnValue;
      }
  
      try {
        // returning false prevents the default action
        returnValue = invokeFunction$1(listener.callback, args); // stop propagation on return value
  
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
  
  
    EventBus$1.prototype._addListener = function (event, newListener) {
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
  
    EventBus$1.prototype._getListeners = function (name) {
      return this._listeners[name];
    };
  
    EventBus$1.prototype._setListeners = function (name, listener) {
      this._listeners[name] = listener;
    };
  
    EventBus$1.prototype._removeListener = function (event, callback) {
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
  
        if (listenerCallback === callback || listenerCallback[FN_REF$1] === callback) {
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
  
  
    function InternalEvent$1() {}
  
    InternalEvent$1.prototype.stopPropagation = function () {
      this.cancelBubble = true;
    };
  
    InternalEvent$1.prototype.preventDefault = function () {
      this.defaultPrevented = true;
    };
  
    InternalEvent$1.prototype.init = function (data) {
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
  
  
    function invokeFunction$1(fn, args) {
      return fn.apply(null, args);
    }
  
    function arrayAdd(array, index, item) {
      array.splice(index, 0, item);
      return array;
    }
    function arrayRemove(array, index) {
      array.splice(index, 1);
      return array;
    }
    function updatePath(formFieldRegistry, formField, index) {
      const parent = formFieldRegistry.get(formField._parent);
      formField._path = [...parent._path, 'components', index];
      return formField;
    }
  
    class AddFormFieldHandler {
      /**
       * @constructor
       * @param { import('../../FormEditor').default } formEditor
       * @param { import('../FormFieldRegistry').default } formFieldRegistry
       */
      constructor(formEditor, formFieldRegistry) {
        this._formEditor = formEditor;
        this._formFieldRegistry = formFieldRegistry;
      }
  
      execute(context) {
        const {
          newFormField,
          targetFormField,
          targetIndex
        } = context;
  
        let {
          schema
        } = this._formEditor._getState();
  
        const targetPath = [...targetFormField._path, 'components'];
        newFormField._parent = targetFormField._id; // (1) Add new form field
  
        arrayAdd(get(schema, targetPath), targetIndex, newFormField); // (2) Update paths of new form field and its siblings
  
        get(schema, targetPath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index)); // (3) Add new form field to form field registry
  
        this._formFieldRegistry.set(newFormField._id, newFormField); // TODO: Create updater/change support that automatically updates paths and schema on command execution
  
  
        this._formEditor._setState({
          schema
        });
      }
  
      revert(context) {
        const {
          newFormField,
          targetFormField,
          targetIndex
        } = context;
  
        let {
          schema
        } = this._formEditor._getState();
  
        const targetPath = [...targetFormField._path, 'components']; // (1) Remove new form field
  
        arrayRemove(get(schema, targetPath), targetIndex); // (2) Update paths of new form field and its siblings
  
        get(schema, targetPath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index)); // (3) Remove new form field from form field registry
  
        this._formFieldRegistry.delete(newFormField._id); // TODO: Create updater/change support that automatically updates paths and schema on command execution
  
  
        this._formEditor._setState({
          schema
        });
      }
  
    }
    AddFormFieldHandler.$inject = ['formEditor', 'formFieldRegistry'];
  
    class EditFormFieldHandler {
      /**
       * @constructor
       * @param { import('../../FormEditor').default } formEditor
       * @param { import('../FormFieldRegistry').default } formFieldRegistry
       */
      constructor(formEditor, formFieldRegistry) {
        this._formEditor = formEditor;
        this._formFieldRegistry = formFieldRegistry;
      }
  
      execute(context) {
        const {
          formField,
          key,
          value
        } = context;
  
        let {
          schema
        } = this._formEditor._getState();
  
        context.oldValue = formField[key]; // (1) Edit form field
  
        formField[key] = value; // TODO: Create updater/change support that automatically updates paths and schema on command execution
  
        this._formEditor._setState({
          schema
        });
      }
  
      revert(context) {
        const {
          formField,
          key,
          oldValue
        } = context;
  
        let {
          schema
        } = this._formEditor._getState(); // (1) Edit form field
  
  
        formField[key] = oldValue; // TODO: Create updater/change support that automatically updates paths and schema on command execution
  
        this._formEditor._setState({
          schema
        });
      }
  
    }
    EditFormFieldHandler.$inject = ['formEditor', 'formFieldRegistry'];
  
    class MoveFormFieldHandler {
      /**
       * @constructor
       * @param { import('../../FormEditor').default } formEditor
       * @param { import('../FormFieldRegistry').default } formFieldRegistry
       */
      constructor(formEditor, formFieldRegistry) {
        this._formEditor = formEditor;
        this._formFieldRegistry = formFieldRegistry;
      }
  
      execute(context) {
        this.moveFormField(context);
      }
  
      revert(context) {
        let {
          sourceFormField,
          targetFormField,
          sourceIndex,
          targetIndex
        } = context;
        this.moveFormField({
          sourceFormField: targetFormField,
          targetFormField: sourceFormField,
          sourceIndex: targetIndex,
          targetIndex: sourceIndex
        }, true);
      }
  
      moveFormField(context, revert) {
        let {
          sourceFormField,
          targetFormField,
          sourceIndex,
          targetIndex
        } = context;
  
        let {
          schema
        } = this._formEditor._getState();
  
        const sourcePath = [...sourceFormField._path, 'components'];
  
        if (sourceFormField._id === targetFormField._id) {
          if (revert) {
            if (sourceIndex > targetIndex) {
              sourceIndex--;
            }
          } else {
            if (sourceIndex < targetIndex) {
              targetIndex--;
            }
          } // (1) Move form field
  
  
          mutate(get(schema, sourcePath), sourceIndex, targetIndex); // (2) Update paths of new form field and its siblings
  
          get(schema, sourcePath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));
        } else {
          const formField = get(schema, [...sourcePath, sourceIndex]);
          formField._parent = targetFormField._id; // (1) Remove form field
  
          arrayRemove(get(schema, sourcePath), sourceIndex); // (2) Update paths of siblings
  
          get(schema, sourcePath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));
          const targetPath = [...targetFormField._path, 'components']; // (3) Add form field
  
          arrayAdd(get(schema, targetPath), targetIndex, formField); // (4) Update paths of siblings
  
          get(schema, targetPath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));
        } // TODO: Create updater/change support that automatically updates paths and schema on command execution
  
  
        this._formEditor._setState({
          schema
        });
      }
  
    }
    MoveFormFieldHandler.$inject = ['formEditor', 'formFieldRegistry'];
  
    class RemoveFormFieldHandler {
      /**
       * @constructor
       * @param { import('../../FormEditor').default } formEditor
       * @param { import('../FormFieldRegistry').default } formFieldRegistry
       */
      constructor(formEditor, formFieldRegistry) {
        this._formEditor = formEditor;
        this._formFieldRegistry = formFieldRegistry;
      }
  
      execute(context) {
        const {
          sourceFormField,
          sourceIndex
        } = context;
  
        let {
          schema
        } = this._formEditor._getState();
  
        const sourcePath = [...sourceFormField._path, 'components'];
        const formField = context.formField = get(schema, [...sourcePath, sourceIndex]); // (1) Remove form field
  
        arrayRemove(get(schema, sourcePath), sourceIndex); // (2) Update paths of its siblings
  
        get(schema, sourcePath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index)); // (3) Remove form field from form field registry
  
        this._formFieldRegistry.delete(formField._id); // TODO: Create updater/change support that automatically updates paths and schema on command execution
  
  
        this._formEditor._setState({
          schema
        });
      }
  
      revert(context) {
        const {
          formField,
          sourceFormField,
          sourceIndex
        } = context;
  
        let {
          schema
        } = this._formEditor._getState();
  
        const sourcePath = [...sourceFormField._path, 'components']; // (1) Add form field
  
        arrayAdd(get(schema, sourcePath), sourceIndex, formField); // (2) Update paths of its siblings
  
        get(schema, sourcePath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index)); // (3) Add form field to form field registry
  
        this._formFieldRegistry.set(formField._id, formField); // TODO: Create updater/change support that automatically updates paths and schema on command execution
  
  
        this._formEditor._setState({
          schema
        });
      }
  
    }
    RemoveFormFieldHandler.$inject = ['formEditor', 'formFieldRegistry'];
  
    class Modeling {
      constructor(commandStack, eventBus, formEditor, formFieldRegistry) {
        this._commandStack = commandStack;
        this._formEditor = formEditor;
        this._formFieldRegistry = formFieldRegistry;
        eventBus.on('form.init', () => {
          this.registerHandlers();
        });
      }
  
      registerHandlers() {
        Object.entries(this.getHandlers()).forEach(([id, handler]) => {
          this._commandStack.registerHandler(id, handler);
        });
      }
  
      getHandlers() {
        return {
          'formField.add': AddFormFieldHandler,
          'formField.edit': EditFormFieldHandler,
          'formField.move': MoveFormFieldHandler,
          'formField.remove': RemoveFormFieldHandler
        };
      }
  
      addFormField(targetFormField, targetIndex, newFormField) {
        const context = {
          newFormField,
          targetFormField,
          targetIndex
        };
  
        this._commandStack.execute('formField.add', context);
      }
  
      editFormField(formField, key, value) {
        const context = {
          formField,
          key,
          value
        };
  
        this._commandStack.execute('formField.edit', context);
      }
  
      moveFormField(sourceFormField, targetFormField, sourceIndex, targetIndex) {
        const context = {
          sourceFormField,
          targetFormField,
          sourceIndex,
          targetIndex
        };
  
        this._commandStack.execute('formField.move', context);
      }
  
      removeFormField(sourceFormField, sourceIndex) {
        const context = {
          sourceFormField,
          sourceIndex
        };
  
        this._commandStack.execute('formField.remove', context);
      }
  
    }
    Modeling.$inject = ['commandStack', 'eventBus', 'formEditor', 'formFieldRegistry'];
  
    class Selection {
      constructor(eventBus) {
        this._eventBus = eventBus;
        this._selection = null;
      }
  
      get() {
        return this._selection;
      }
  
      set(selection) {
        this._selection = selection;
  
        this._eventBus.fire('selection.changed', this._selection);
      }
  
      clear() {
        this.set(null);
      }
  
    }
    Selection.$inject = ['eventBus'];
  
    /**
     * A factory to create a configurable debouncer.
     *
     * @param {number|boolean} config
     */
  
    function DebounceFactory(config) {
      const timeout = typeof config === 'number' ? config : config ? 300 : 0;
  
      if (timeout) {
        return fn => debounce(fn, timeout);
      } else {
        return fn => fn;
      }
    }
    DebounceFactory.$inject = ['config.debounce'];
  
    var FormFieldRegistry = Map;
  
    /**
     * A service that offers un- and redoable execution of commands.
     *
     * The command stack is responsible for executing modeling actions
     * in a un- and redoable manner. To do this it delegates the actual
     * command execution to {@link CommandHandler}s.
     *
     * Command handlers provide {@link CommandHandler#execute(ctx)} and
     * {@link CommandHandler#revert(ctx)} methods to un- and redo a command
     * identified by a command context.
     *
     *
     * ## Life-Cycle events
     *
     * In the process the command stack fires a number of life-cycle events
     * that other components to participate in the command execution.
     *
     *    * preExecute
     *    * preExecuted
     *    * execute
     *    * executed
     *    * postExecute
     *    * postExecuted
     *    * revert
     *    * reverted
     *
     * A special event is used for validating, whether a command can be
     * performed prior to its execution.
     *
     *    * canExecute
     *
     * Each of the events is fired as `commandStack.{eventName}` and
     * `commandStack.{commandName}.{eventName}`, respectively. This gives
     * components fine grained control on where to hook into.
     *
     * The event object fired transports `command`, the name of the
     * command and `context`, the command context.
     *
     *
     * ## Creating Command Handlers
     *
     * Command handlers should provide the {@link CommandHandler#execute(ctx)}
     * and {@link CommandHandler#revert(ctx)} methods to implement
     * redoing and undoing of a command.
     *
     * A command handler _must_ ensure undo is performed properly in order
     * not to break the undo chain. It must also return the shapes that
     * got changed during the `execute` and `revert` operations.
     *
     * Command handlers may execute other modeling operations (and thus
     * commands) in their `preExecute` and `postExecute` phases. The command
     * stack will properly group all commands together into a logical unit
     * that may be re- and undone atomically.
     *
     * Command handlers must not execute other commands from within their
     * core implementation (`execute`, `revert`).
     *
     *
     * ## Change Tracking
     *
     * During the execution of the CommandStack it will keep track of all
     * elements that have been touched during the command's execution.
     *
     * At the end of the CommandStack execution it will notify interested
     * components via an 'elements.changed' event with all the dirty
     * elements.
     *
     * The event can be picked up by components that are interested in the fact
     * that elements have been changed. One use case for this is updating
     * their graphical representation after moving / resizing or deletion.
     *
     * @see CommandHandler
     *
     * @param {EventBus} eventBus
     * @param {Injector} injector
     */
  
    function CommandStack(eventBus, injector) {
      /**
       * A map of all registered command handlers.
       *
       * @type {Object}
       */
      this._handlerMap = {};
      /**
       * A stack containing all re/undoable actions on the diagram
       *
       * @type {Array<Object>}
       */
  
      this._stack = [];
      /**
       * The current index on the stack
       *
       * @type {number}
       */
  
      this._stackIdx = -1;
      /**
       * Current active commandStack execution
       *
       * @type {Object}
       * @property {Object[]} actions
       * @property {Object[]} dirty
       * @property { 'undo' | 'redo' | 'clear' | 'execute' | null } trigger the cause of the current excecution
       */
  
      this._currentExecution = {
        actions: [],
        dirty: [],
        trigger: null
      };
      this._injector = injector;
      this._eventBus = eventBus;
      this._uid = 1;
      eventBus.on(['diagram.destroy', 'diagram.clear'], function () {
        this.clear(false);
      }, this);
    }
    CommandStack.$inject = ['eventBus', 'injector'];
    /**
     * Execute a command
     *
     * @param {string} command the command to execute
     * @param {Object} context the environment to execute the command in
     */
  
    CommandStack.prototype.execute = function (command, context) {
      if (!command) {
        throw new Error('command required');
      }
  
      this._currentExecution.trigger = 'execute';
      var action = {
        command: command,
        context: context
      };
  
      this._pushAction(action);
  
      this._internalExecute(action);
  
      this._popAction(action);
    };
    /**
     * Ask whether a given command can be executed.
     *
     * Implementors may hook into the mechanism on two ways:
     *
     *   * in event listeners:
     *
     *     Users may prevent the execution via an event listener.
     *     It must prevent the default action for `commandStack.(<command>.)canExecute` events.
     *
     *   * in command handlers:
     *
     *     If the method {@link CommandHandler#canExecute} is implemented in a handler
     *     it will be called to figure out whether the execution is allowed.
     *
     * @param  {string} command the command to execute
     * @param  {Object} context the environment to execute the command in
     *
     * @return {boolean} true if the command can be executed
     */
  
  
    CommandStack.prototype.canExecute = function (command, context) {
      var action = {
        command: command,
        context: context
      };
  
      var handler = this._getHandler(command);
  
      var result = this._fire(command, 'canExecute', action); // handler#canExecute will only be called if no listener
      // decided on a result already
  
  
      if (result === undefined) {
        if (!handler) {
          return false;
        }
  
        if (handler.canExecute) {
          result = handler.canExecute(context);
        }
      }
  
      return result;
    };
    /**
     * Clear the command stack, erasing all undo / redo history
     */
  
  
    CommandStack.prototype.clear = function (emit) {
      this._stack.length = 0;
      this._stackIdx = -1;
  
      if (emit !== false) {
        this._fire('changed', {
          trigger: 'clear'
        });
      }
    };
    /**
     * Undo last command(s)
     */
  
  
    CommandStack.prototype.undo = function () {
      var action = this._getUndoAction(),
          next;
  
      if (action) {
        this._currentExecution.trigger = 'undo';
  
        this._pushAction(action);
  
        while (action) {
          this._internalUndo(action);
  
          next = this._getUndoAction();
  
          if (!next || next.id !== action.id) {
            break;
          }
  
          action = next;
        }
  
        this._popAction();
      }
    };
    /**
     * Redo last command(s)
     */
  
  
    CommandStack.prototype.redo = function () {
      var action = this._getRedoAction(),
          next;
  
      if (action) {
        this._currentExecution.trigger = 'redo';
  
        this._pushAction(action);
  
        while (action) {
          this._internalExecute(action, true);
  
          next = this._getRedoAction();
  
          if (!next || next.id !== action.id) {
            break;
          }
  
          action = next;
        }
  
        this._popAction();
      }
    };
    /**
     * Register a handler instance with the command stack
     *
     * @param {string} command
     * @param {CommandHandler} handler
     */
  
  
    CommandStack.prototype.register = function (command, handler) {
      this._setHandler(command, handler);
    };
    /**
     * Register a handler type with the command stack
     * by instantiating it and injecting its dependencies.
     *
     * @param {string} command
     * @param {Function} a constructor for a {@link CommandHandler}
     */
  
  
    CommandStack.prototype.registerHandler = function (command, handlerCls) {
      if (!command || !handlerCls) {
        throw new Error('command and handlerCls must be defined');
      }
  
      var handler = this._injector.instantiate(handlerCls);
  
      this.register(command, handler);
    };
  
    CommandStack.prototype.canUndo = function () {
      return !!this._getUndoAction();
    };
  
    CommandStack.prototype.canRedo = function () {
      return !!this._getRedoAction();
    }; // stack access  //////////////////////
  
  
    CommandStack.prototype._getRedoAction = function () {
      return this._stack[this._stackIdx + 1];
    };
  
    CommandStack.prototype._getUndoAction = function () {
      return this._stack[this._stackIdx];
    }; // internal functionality //////////////////////
  
  
    CommandStack.prototype._internalUndo = function (action) {
      var self = this;
      var command = action.command,
          context = action.context;
  
      var handler = this._getHandler(command); // guard against illegal nested command stack invocations
  
  
      this._atomicDo(function () {
        self._fire(command, 'revert', action);
  
        if (handler.revert) {
          self._markDirty(handler.revert(context));
        }
  
        self._revertedAction(action);
  
        self._fire(command, 'reverted', action);
      });
    };
  
    CommandStack.prototype._fire = function (command, qualifier, event) {
      if (arguments.length < 3) {
        event = qualifier;
        qualifier = null;
      }
  
      var names = qualifier ? [command + '.' + qualifier, qualifier] : [command],
          i,
          name,
          result;
      event = this._eventBus.createEvent(event);
  
      for (i = 0; name = names[i]; i++) {
        result = this._eventBus.fire('commandStack.' + name, event);
  
        if (event.cancelBubble) {
          break;
        }
      }
  
      return result;
    };
  
    CommandStack.prototype._createId = function () {
      return this._uid++;
    };
  
    CommandStack.prototype._atomicDo = function (fn) {
      var execution = this._currentExecution;
      execution.atomic = true;
  
      try {
        fn();
      } finally {
        execution.atomic = false;
      }
    };
  
    CommandStack.prototype._internalExecute = function (action, redo) {
      var self = this;
      var command = action.command,
          context = action.context;
  
      var handler = this._getHandler(command);
  
      if (!handler) {
        throw new Error('no command handler registered for <' + command + '>');
      }
  
      this._pushAction(action);
  
      if (!redo) {
        this._fire(command, 'preExecute', action);
  
        if (handler.preExecute) {
          handler.preExecute(context);
        }
  
        this._fire(command, 'preExecuted', action);
      } // guard against illegal nested command stack invocations
  
  
      this._atomicDo(function () {
        self._fire(command, 'execute', action);
  
        if (handler.execute) {
          // actual execute + mark return results as dirty
          self._markDirty(handler.execute(context));
        } // log to stack
  
  
        self._executedAction(action, redo);
  
        self._fire(command, 'executed', action);
      });
  
      if (!redo) {
        this._fire(command, 'postExecute', action);
  
        if (handler.postExecute) {
          handler.postExecute(context);
        }
  
        this._fire(command, 'postExecuted', action);
      }
  
      this._popAction(action);
    };
  
    CommandStack.prototype._pushAction = function (action) {
      var execution = this._currentExecution,
          actions = execution.actions;
      var baseAction = actions[0];
  
      if (execution.atomic) {
        throw new Error('illegal invocation in <execute> or <revert> phase (action: ' + action.command + ')');
      }
  
      if (!action.id) {
        action.id = baseAction && baseAction.id || this._createId();
      }
  
      actions.push(action);
    };
  
    CommandStack.prototype._popAction = function () {
      var execution = this._currentExecution,
          trigger = execution.trigger,
          actions = execution.actions,
          dirty = execution.dirty;
      actions.pop();
  
      if (!actions.length) {
        this._eventBus.fire('elements.changed', {
          elements: uniqueBy('id', dirty.reverse())
        });
  
        dirty.length = 0;
  
        this._fire('changed', {
          trigger: trigger
        });
  
        execution.trigger = null;
      }
    };
  
    CommandStack.prototype._markDirty = function (elements) {
      var execution = this._currentExecution;
  
      if (!elements) {
        return;
      }
  
      elements = isArray(elements) ? elements : [elements];
      execution.dirty = execution.dirty.concat(elements);
    };
  
    CommandStack.prototype._executedAction = function (action, redo) {
      var stackIdx = ++this._stackIdx;
  
      if (!redo) {
        this._stack.splice(stackIdx, this._stack.length, action);
      }
    };
  
    CommandStack.prototype._revertedAction = function (action) {
      this._stackIdx--;
    };
  
    CommandStack.prototype._getHandler = function (command) {
      return this._handlerMap[command];
    };
  
    CommandStack.prototype._setHandler = function (command, handler) {
      if (!command || !handler) {
        throw new Error('command and handler required');
      }
  
      if (this._handlerMap[command]) {
        throw new Error('overriding handler for command <' + command + '>');
      }
  
      this._handlerMap[command] = handler;
    };
  
    var commandModule = {
      commandStack: ['type', CommandStack]
    };
  
    class Importer {
      /**
       * @constructor
       * @param { import('../core/FormFieldRegistry').default } formFieldRegistry
       * @param { import('@bpmn-io/form-js-viewer').FormFields } formFields
       */
      constructor(formFieldRegistry, formFields) {
        this._formFieldRegistry = formFieldRegistry;
        this._formFields = formFields;
      }
      /**
       * Import schema adding `_id`, `_parent` and `_path` information to each field and adding it to the form field registry.
       *
       * @param {any} schema
       *
       * @returns {Promise}
       */
  
  
      importSchema(schema) {
        this._formFieldRegistry.clear(); // TODO: Add warnings
  
  
        const warnings = [];
        return new Promise((resolve, reject) => {
          try {
            this.importFormField(schema);
          } catch (err) {
            err.warnings = warnings;
            reject(err);
          }
  
          resolve({
            warnings
          });
        });
      }
  
      importFormField(formField, parentId, index) {
        const {
          components,
          key,
          type
        } = formField;
        let parent;
  
        if (parentId) {
          // Set form field parent
          formField._parent = parentId;
          parent = this._formFieldRegistry.get(parentId);
        }
  
        if (!this._formFields.get(type)) {
          throw new Error(`form field of type <${type}> not supported`);
        }
  
        if (key) {
          this._formFieldRegistry.forEach(formField => {
            if (formField.key === key) {
              throw new Error(`form field with key <${key}> already exists`);
            }
          });
        } // Set form field path
  
  
        if (parent) {
          formField._path = [...parent._path, 'components', index];
        } else {
          formField._path = [];
        }
  
        const _id = generateIdForType(type); // Set form field ID
  
  
        formField._id = _id;
  
        this._formFieldRegistry.set(_id, formField);
  
        if (components) {
          this.importFormFields(components, _id);
        }
  
        return formField;
      }
  
      importFormFields(components, parent) {
        components.forEach((component, index) => {
          this.importFormField(component, parent, index);
        });
      }
  
    }
    Importer.$inject = ['formFieldRegistry', 'formFields'];
  
    var importModule = {
      importer: ['type', Importer]
    };
  
    const DragAndDropContext = q({
      drake: null
    });
  
    /**
     * @param {string} type
     * @param {boolean} [strict]
     *
     * @returns {any}
     */
  
    function getService$1(type, strict) {}
  
    const FormEditorContext = q({
      getService: getService$1
    });
  
    function useService$1 (type, strict) {
      const {
        getService
      } = F(FormEditorContext);
      return getService(type, strict);
    }
  
    function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
    var ButtonIcon = (({
      styles = {},
      ...props
    }) => /*#__PURE__*/React.createElement("svg", _extends$1({
      xmlns: "http://www.w3.org/2000/svg",
      width: "54",
      height: "54"
    }, props), /*#__PURE__*/React.createElement("path", {
      fillRule: "evenodd",
      d: "M45 17a3 3 0 013 3v14a3 3 0 01-3 3H9a3 3 0 01-3-3V20a3 3 0 013-3h36zm-9 8.889H18v2.222h18V25.89z"
    })));
  
    function _extends$1$1() { _extends$1$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1$1.apply(this, arguments); }
    var CheckboxIcon = (({
      styles = {},
      ...props
    }) => /*#__PURE__*/React.createElement("svg", _extends$1$1({
      xmlns: "http://www.w3.org/2000/svg",
      width: "54",
      height: "54"
    }, props), /*#__PURE__*/React.createElement("path", {
      d: "M34 18H20a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V20a2 2 0 00-2-2zm-9 14l-5-5 1.41-1.41L25 29.17l7.59-7.59L34 23l-9 9z"
    })));
  
    function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }
    var ColumnsIcon = (({
      styles = {},
      ...props
    }) => /*#__PURE__*/React.createElement("svg", _extends$2({
      xmlns: "http://www.w3.org/2000/svg",
      width: "54",
      height: "54"
    }, props), /*#__PURE__*/React.createElement("path", {
      fillRule: "evenodd",
      d: "M8 33v5a1 1 0 001 1h4v2H9a3 3 0 01-3-3v-5h2zm18 6v2H15v-2h11zm13 0v2H28v-2h11zm9-6v5a3 3 0 01-3 3h-4v-2h4a1 1 0 00.993-.883L46 38v-5h2zM8 22v9H6v-9h2zm40 0v9h-2v-9h2zm-35-9v2H9a1 1 0 00-.993.883L8 16v4H6v-4a3 3 0 013-3h4zm32 0a3 3 0 013 3v4h-2v-4a1 1 0 00-.883-.993L45 15h-4v-2h4zm-6 0v2H28v-2h11zm-13 0v2H15v-2h11z"
    })));
  
    function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }
    var NumberIcon = (({
      styles = {},
      ...props
    }) => /*#__PURE__*/React.createElement("svg", _extends$3({
      xmlns: "http://www.w3.org/2000/svg",
      width: "54",
      height: "54"
    }, props), /*#__PURE__*/React.createElement("path", {
      fillRule: "evenodd",
      d: "M45 16a3 3 0 013 3v16a3 3 0 01-3 3H9a3 3 0 01-3-3V19a3 3 0 013-3h36zm0 2H9a1 1 0 00-1 1v16a1 1 0 001 1h36a1 1 0 001-1V19a1 1 0 00-1-1zM35 28.444h7l-3.5 4-3.5-4zM35 26h7l-3.5-4-3.5 4z"
    })));
  
    function _extends$4() { _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$4.apply(this, arguments); }
    var RadioIcon = (({
      styles = {},
      ...props
    }) => /*#__PURE__*/React.createElement("svg", _extends$4({
      xmlns: "http://www.w3.org/2000/svg",
      width: "54",
      height: "54"
    }, props), /*#__PURE__*/React.createElement("path", {
      d: "M27 22c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
    })));
  
    function _extends$5() { _extends$5 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$5.apply(this, arguments); }
    var SelectIcon = (({
      styles = {},
      ...props
    }) => /*#__PURE__*/React.createElement("svg", _extends$5({
      xmlns: "http://www.w3.org/2000/svg",
      width: "54",
      height: "54"
    }, props), /*#__PURE__*/React.createElement("path", {
      fillRule: "evenodd",
      d: "M45 16a3 3 0 013 3v16a3 3 0 01-3 3H9a3 3 0 01-3-3V19a3 3 0 013-3h36zm0 2H9a1 1 0 00-1 1v16a1 1 0 001 1h36a1 1 0 001-1V19a1 1 0 00-1-1zm-12 7h9l-4.5 6-4.5-6z"
    })));
  
    function _extends$6() { _extends$6 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$6.apply(this, arguments); }
    var TextIcon = (({
      styles = {},
      ...props
    }) => /*#__PURE__*/React.createElement("svg", _extends$6({
      xmlns: "http://www.w3.org/2000/svg",
      width: "54",
      height: "54"
    }, props), /*#__PURE__*/React.createElement("path", {
      d: "M20.58 33.77h-3l-1.18-3.08H11l-1.1 3.08H7l5.27-13.54h2.89zm-5-5.36l-1.86-5-1.83 5zM22 20.23h5.41a15.47 15.47 0 012.4.14 3.42 3.42 0 011.41.55 3.47 3.47 0 011 1.14 3 3 0 01.42 1.58 3.26 3.26 0 01-1.91 2.94 3.63 3.63 0 011.91 1.22 3.28 3.28 0 01.66 2 4 4 0 01-.43 1.8 3.63 3.63 0 01-1.09 1.4 3.89 3.89 0 01-1.83.65q-.69.07-3.3.09H22zm2.73 2.25v3.13h3.8a1.79 1.79 0 001.1-.49 1.41 1.41 0 00.41-1 1.49 1.49 0 00-.35-1 1.54 1.54 0 00-1-.48c-.27 0-1.05-.05-2.34-.05zm0 5.39v3.62h2.57a11.52 11.52 0 001.88-.09 1.65 1.65 0 001-.54 1.6 1.6 0 00.38-1.14 1.75 1.75 0 00-.29-1 1.69 1.69 0 00-.86-.62 9.28 9.28 0 00-2.41-.23zM44.35 28.79l2.65.84a5.94 5.94 0 01-2 3.29A5.74 5.74 0 0141.38 34a5.87 5.87 0 01-4.44-1.84 7.09 7.09 0 01-1.73-5A7.43 7.43 0 0137 21.87 6 6 0 0141.54 20a5.64 5.64 0 014 1.47A5.33 5.33 0 0147 24l-2.7.65a2.8 2.8 0 00-2.86-2.27A3.09 3.09 0 0039 23.42a5.31 5.31 0 00-.93 3.5 5.62 5.62 0 00.93 3.65 3 3 0 002.4 1.09 2.72 2.72 0 001.82-.66 4 4 0 001.13-2.21z"
    })));
  
    function _extends$7() { _extends$7 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$7.apply(this, arguments); }
    var TextfieldIcon = (({
      styles = {},
      ...props
    }) => /*#__PURE__*/React.createElement("svg", _extends$7({
      xmlns: "http://www.w3.org/2000/svg",
      width: "54",
      height: "54"
    }, props), /*#__PURE__*/React.createElement("path", {
      fillRule: "evenodd",
      d: "M45 16a3 3 0 013 3v16a3 3 0 01-3 3H9a3 3 0 01-3-3V19a3 3 0 013-3h36zm0 2H9a1 1 0 00-1 1v16a1 1 0 001 1h36a1 1 0 001-1V19a1 1 0 00-1-1zm-32 4v10h-2V22h2z"
    })));
  
    const iconsByType = {
      button: ButtonIcon,
      checkbox: CheckboxIcon,
      columns: ColumnsIcon,
      number: NumberIcon,
      radio: RadioIcon,
      select: SelectIcon,
      text: TextIcon,
      textfield: TextfieldIcon,
      textarea: TextfieldIcon,
      textdate: TextfieldIcon,
      textdatetime: TextfieldIcon
    };
  
    const types = [{
      label: '文本框',
      type: 'textfield'
    }, {
      label: '数字框',
      type: 'number'
    }, {
      label: '选项',
      type: 'checkbox'
    }, {
      label: 'Radio',
      type: 'radio'
    }, {
      label: '下拉选择',
      type: 'select'
    }, {
      label: '文本',
      type: 'text'
    }, {
      label: '多行文本',
      type: 'textarea'
    },{
      label: '日期',
      type: 'textdate'
    }, {
      label: '时间',
      type: 'textdatetime'
    },{
      label: '按钮',
      type: 'button'
    }];
    function Palette(props) {
      return o$1(y, {
        children: [o$1("div", {
          class: "fjs-palette-header",
          children: "制作表单"
        }), o$1("div", {
          class: "fjs-palette fjs-drag-container fjs-no-drop",
          children: types.map(({
            label,
            type
          }) => {
            const Icon = iconsByType[type];
            return o$1("div", {
              class: "fjs-palette-field fjs-drag-copy fjs-no-drop",
              "data-field-type": type,
              children: [Icon ? o$1(Icon, {
                class: "fjs-palette-field-icon",
                width: "36",
                height: "36",
                viewBox: "0 0 54 54"
              }) : null, o$1("span", {
                children: label
              })]
            });
          })
        })]
      });
    }
  
    function arrayAdd$1(array, index, item) {
      const copy = [...array];
      copy.splice(index, 0, item);
      return copy;
    }
    function arrayRemove$1(array, index) {
      const copy = [...array];
      copy.splice(index, 1);
      return copy;
    }
    function prefixId$1(id) {
      return `fjs-properties-panel-${id}`;
    }
    function stopPropagation(listener) {
      return event => {
        event.stopPropagation();
        listener(event);
      };
    }
    function textToLabel(text = '...') {
      if (text.length > 10) {
        return `${text.substring(0, 10)}...`;
      }
  
      return text;
    }
    const INPUTS = ['checkbox', 'number', 'radio', 'select', 'textfield','textarea','textdate','textdatetime'];
  
    function CheckboxInput(props) {
      const {
        id,
        label,
        onChange,
        value = false
      } = props;
  
      const handleChange = ({
        target
      }) => {
        onChange(target.checked);
      };
  
      return o$1("div", {
        class: "fjs-properties-panel-textfield",
        children: [o$1("label", {
          for: prefixId$1(id),
          class: "fjs-properties-panel-label",
          children: label
        }), o$1("input", {
          id: prefixId$1(id),
          type: "checkbox",
          class: "fjs-properties-panel-input",
          onChange: handleChange,
          checked: value
        })]
      });
    }
  
    function NumberInput(props) {
      const debounce = useService$1('debounce'),
            eventBus = useService$1('eventBus');
      const {
        id,
        label,
        max,
        min,
        value = ''
      } = props;
      const onInput = debounce(event => {
        const {
          validity,
          value
        } = event.target;
  
        if (validity.valid) {
          props.onInput(value ? parseInt(value, 10) : undefined);
        }
      });
  
      const onFocus = () => eventBus.fire('propertiesPanel.focusin');
  
      const onBlur = () => eventBus.fire('propertiesPanel.focusout');
  
      return o$1("div", {
        class: "fjs-properties-panel-textfield",
        children: [o$1("label", {
          for: prefixId$1(id),
          class: "fjs-properties-panel-label",
          children: label
        }), o$1("input", {
          id: prefixId$1(id),
          type: "number",
          class: "fjs-properties-panel-input",
          max: max,
          min: min,
          onInput: onInput,
          onFocus: onFocus,
          onBlur: onBlur,
          value: value
        })]
      });
    }
  
    function Select$1(props) {
      const {
        id,
        label,
        onChange,
        options,
        value
      } = props;
  
      const handleChange = ({
        target
      }) => {
        onChange(target.value);
      };
  
      return o$1("div", {
        class: "fjs-properties-panel-textfield",
        children: [o$1("label", {
          for: prefixId$1(id),
          class: "fjs-properties-panel-label",
          children: label
        }), o$1("select", {
          id: prefixId$1(id),
          class: "fjs-properties-panel-input",
          onInput: handleChange,
          children: options.map(option => {
            return o$1("option", {
              value: option.value,
              selected: option.value === value,
              children: option.label
            });
          })
        })]
      });
    }
  
    function Textarea(props) {
      const debounce = useService$1('debounce'),
            eventBus = useService$1('eventBus');
      const {
        id,
        label,
        rows = 10,
        value = ''
      } = props;
      const onInput = debounce(event => {
        const value = event.target.value;
        props.onInput(value.length ? value : undefined);
      });
  
      const onFocus = () => eventBus.fire('propertiesPanel.focusin');
  
      const onBlur = () => eventBus.fire('propertiesPanel.focusout');
  
      return o$1("div", {
        class: "fjs-properties-panel-textarea",
        children: [o$1("label", {
          for: prefixId$1(id),
          class: "fjs-properties-panel-label",
          children: label
        }), o$1("textarea", {
          id: prefixId$1(id),
          spellcheck: false,
          class: "fjs-properties-panel-input",
          onInput: onInput,
          onFocus: onFocus,
          onBlur: onBlur,
          rows: rows,
          value: value
        })]
      });
    }
  
    function TextInput(props) {
      const debounce = useService$1('debounce'),
            eventBus = useService$1('eventBus');
      const {
        id,
        label,
        value = ''
      } = props;
      const onInput = debounce(event => {
        const value = event.target.value;
        props.onInput(value.length ? value : undefined);
      });
  
      const onFocus = () => eventBus.fire('propertiesPanel.focusin');
  
      const onBlur = () => eventBus.fire('propertiesPanel.focusout');
  
      return o$1("div", {
        class: "fjs-properties-panel-textfield",
        children: [o$1("label", {
          for: prefixId$1(id),
          class: "fjs-properties-panel-label",
          children: label
        }), o$1("input", {
          id: prefixId$1(id),
          type: "text",
          spellcheck: false,
          class: "fjs-properties-panel-input",
          onInput: onInput,
          onFocus: onFocus,
          onBlur: onBlur,
          value: value
        })]
      });
    }
  
    function CheckboxInputEntry(props) {
      const {
        editField,
        field,
        id,
        label,
        path
      } = props;
  
      const onChange = value => {
        if (editField && path) {
          editField(field, path, value);
        } else {
          props.onChange(value);
        }
      };
  
      const value = path ? get(field, path, false) : props.value;
      return o$1("div", {
        class: "fjs-properties-panel-entry",
        children: o$1(CheckboxInput, {
          id: id,
          label: label,
          onChange: onChange,
          value: value
        })
      });
    }
  
    function NumberInputEntry(props) {
      const {
        editField,
        field,
        id,
        label,
        max,
        min,
        onChange,
        path
      } = props;
  
      const onInput = value => {
        if (editField && path) {
          editField(field, path, value);
        } else {
          onChange(value);
        }
      };
  
      const value = path ? get(field, path, '') : props.value;
      return o$1("div", {
        class: "fjs-properties-panel-entry",
        children: o$1(NumberInput, {
          id: id,
          label: label,
          max: max,
          min: min,
          onInput: onInput,
          value: value
        })
      });
    }
  
    function TextareaEntry(props) {
      const {
        editField,
        field,
        id,
        description,
        label,
        onChange,
        path
      } = props;
  
      const onInput = value => {
        if (editField && path) {
          editField(field, path, value);
        } else {
          onChange(value);
        }
      };
  
      const value = path ? get(field, path, '') : props.value;
      return o$1("div", {
        class: "fjs-properties-panel-entry",
        children: [o$1(Textarea, {
          id: id,
          label: label,
          onInput: onInput,
          value: value
        }), description && o$1("div", {
          class: "fjs-properties-panel-description",
          children: description
        })]
      });
    }
  
    function TextInputEntry(props) {
      const {
        editField,
        field,
        id,
        description,
        label,
        onChange,
        path
      } = props;
  
      const onInput = value => {
        if (editField && path) {
          editField(field, path, value);
        } else {
          onChange(value);
        }
      };
  
      const value = path ? get(field, path, '') : props.value;
      return o$1("div", {
        class: "fjs-properties-panel-entry",
        children: [o$1(TextInput, {
          id: id,
          label: label,
          onInput: onInput,
          value: value
        }), description && o$1("div", {
          class: "fjs-properties-panel-description",
          children: description
        })]
      });
    }
  
    function _extends$8() { _extends$8 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$8.apply(this, arguments); }
    var CreateIcon = (({
      styles = {},
      ...props
    }) => /*#__PURE__*/React.createElement("svg", _extends$8({
      xmlns: "http://www.w3.org/2000/svg",
      width: "12",
      height: "12"
    }, props), /*#__PURE__*/React.createElement("path", {
      fillRule: "evenodd",
      d: "M7 0v5h5v2H7v5H5V7H0V5h5V0h2z"
    })));
  
    function _extends$9() { _extends$9 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$9.apply(this, arguments); }
    var ListArrowIcon = (({
      styles = {},
      ...props
    }) => /*#__PURE__*/React.createElement("svg", _extends$9({
      xmlns: "http://www.w3.org/2000/svg",
      width: "7",
      height: "9"
    }, props), /*#__PURE__*/React.createElement("path", {
      fillRule: "evenodd",
      d: "M6.25 4.421L4.836 5.835h-.001L2.007 8.663.593 7.249 3.421 4.42.593 1.593 2.007.178 6.25 4.421z"
    })));
  
    function _extends$a() { _extends$a = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$a.apply(this, arguments); }
    var ListDeleteIcon = (({
      styles = {},
      ...props
    }) => /*#__PURE__*/React.createElement("svg", _extends$a({
      xmlns: "http://www.w3.org/2000/svg",
      width: "11",
      height: "14"
    }, props), /*#__PURE__*/React.createElement("path", {
      d: "M10 4v8c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V4h9zM8 6H3v4.8c0 .66.5 1.2 1.111 1.2H6.89C7.5 12 8 11.46 8 10.8V6zm3-5H8.5l-1-1h-4l-1 1H0v1.5h11V1z"
    })));
  
    function _extends$b() { _extends$b = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$b.apply(this, arguments); }
    var SectionArrowIcon = (({
      styles = {},
      ...props
    }) => /*#__PURE__*/React.createElement("svg", _extends$b({
      xmlns: "http://www.w3.org/2000/svg",
      width: "8",
      height: "12"
    }, props), /*#__PURE__*/React.createElement("path", {
      fillRule: "evenodd",
      d: "M2.007 11.66L.593 10.248l4.242-4.243L.593 1.761 2.007.347l5.657 5.657-5.657 5.657z"
    })));
  
    function CollapsibleEntry(props) {
      const {
        children,
        label,
        removeEntry = () => {}
      } = props;
      const [collapsed, setCollapsed] = l(false);
  
      const toggleCollapsed = () => setCollapsed(!collapsed);
  
      const classes = ['fjs-properties-panel-collapsible-entry'];
  
      if (collapsed) {
        classes.push('fjs-properties-panel-collapsible-entry-collapsed');
      }
  
      return o$1("div", {
        class: classes.join(' '),
        children: [o$1("div", {
          class: "fjs-properties-panel-collapsible-entry-header",
          onClick: toggleCollapsed,
          children: [o$1("div", {
            children: [o$1(ListArrowIcon, {
              class: collapsed ? 'fjs-arrow-right' : 'fjs-arrow-down'
            }), o$1("span", {
              class: "fjs-properties-panel-collapsible-entry-header-label",
              children: label
            })]
          }), o$1("button", {
            class: "fjs-properties-panel-collapsible-entry-header-remove-entry",
            onClick: stopPropagation(removeEntry),
            children: o$1(ListDeleteIcon, {})
          })]
        }), collapsed ? null : o$1("div", {
          class: "fjs-properties-panel-collapsible-entry-entries",
          children: children
        })]
      });
    }
  
    function Group(props) {
      const {
        children,
        hasEntries = true,
        label
      } = props;
      const [open, setOpen] = l(hasEntries);
  
      const toggleOpen = () => setOpen(!open);
  
      const addEntry = event => {
        event.stopPropagation();
        setOpen(true);
        props.addEntry();
      };
  
      return o$1("div", {
        class: "fjs-properties-panel-group",
        children: [o$1("div", {
          class: "fjs-properties-panel-group-header",
          onClick: hasEntries ? toggleOpen : () => {},
          children: [o$1("span", {
            class: "fjs-properties-panel-group-header-label",
            children: label
          }), o$1("div", {
            class: "fjs-properties-panel-group-header-buttons",
            children: [props.addEntry ? o$1("button", {
              class: "fjs-properties-panel-group-header-button fjs-properties-panel-group-header-button-add-entry",
              onClick: addEntry,
              children: o$1(CreateIcon, {})
            }) : null, o$1("button", {
              class: "fjs-properties-panel-group-header-button fjs-properties-panel-group-header-button-toggle-open",
              children: o$1(SectionArrowIcon, {
                class: hasEntries && open ? 'fjs-arrow-down' : 'fjs-arrow-right'
              })
            })]
          })]
        }), hasEntries && open ? o$1("div", {
          class: "fjs-properties-panel-group-entries",
          children: children
        }) : null]
      });
    }
  
    function ActionEntry(props) {
      const {
        editField,
        field
      } = props;
  
      const onChange = value => {
        editField(field, 'action', value);
      };
  
      const value = field.action;
      const options = [{
        label: 'Submit',
        value: 'submit'
      }, {
        label: 'Reset',
        value: 'reset'
      }];
      return o$1("div", {
        class: "fjs-properties-panel-entry",
        children: o$1(Select$1, {
          id: "action",
          label: "Action",
          options: options,
          onChange: onChange,
          value: value
        })
      });
    }
  
    function ColumnsEntry(props) {
      const {
        editField,
        field
      } = props;
  
      const onInput = value => {
        let components = field.components.slice();
  
        if (value > components.length) {
          while (value > components.length) {
            components.push(Default.create({
              _parent: field._id
            }));
          }
        } else {
          components = components.slice(0, value);
        }
  
        editField(field, 'components', components);
      };
  
      const value = field.components.length;
      return o$1("div", {
        class: "fjs-properties-panel-entry",
        children: o$1(NumberInputEntry, {
          id: "columns",
          label: "Columns",
          onInput: onInput,
          value: value,
          min: "1",
          max: "3"
        })
      });
    }
  
    function DescriptionEntry(props) {
      const {
        editField,
        field
      } = props;
      return o$1(TextInputEntry, {
        editField: editField,
        field: field,
        id: "description",
        label: "字段描述",
        path: ['description']
      });
    }
  
    function KeyEntry(props) {
      const {
        editField,
        field
      } = props;
      return o$1(TextInputEntry, {
        editField: editField,
        field: field,
        id: "key",
        label: "拼音",
        description: "输入字段拼音全屏或者简拼",
        path: ['key']
      });
    }
  
    function LabelEntry(props) {
      const {
        editField,
        field
      } = props;
      return o$1(TextInputEntry, {
        editField: editField,
        field: field,
        id: "label",
        label: "字段名称",
        path: ['label']
      });
    }
  
    function TextEntry(props) {
      const {
        editField,
        field
      } = props;
      return o$1(TextareaEntry, {
        editField: editField,
        field: field,
        id: "text",
        label: "Text",
        path: ['text'],
        description: "Use Markdown or basic HTML to format."
      });
    }
  
    function ValueEntry(props) {
      const {
        editField,
        field,
        index
      } = props;
  
      const onChange = key => {
        const values = get(field, ['values']);
        return value => {
          editField(field, 'values', set(values, [index, key], value));
        };
      };
  
      return o$1(y, {
        children: [o$1(TextInputEntry, {
          id: `value-label-${index}`,
          label: "Label",
          onChange: onChange('label'),
          value: get(field, ['values', index, 'label'])
        }), o$1(TextInputEntry, {
          id: `value-value-${index}`,
          label: "Value",
          onChange: onChange('value'),
          value: get(field, ['values', index, 'value'])
        })]
      });
    }
  
    function GeneralGroup(field, editField) {
      const {
        type
      } = field;
      const entries = [];
  
      if (INPUTS.includes(type) || type === 'button') {
        entries.push(o$1(LabelEntry, {
          editField: editField,
          field: field
        }));
      }
  
      if (INPUTS.includes(type)) {
        entries.push(o$1(DescriptionEntry, {
          editField: editField,
          field: field
        }));
      }
  
      if (INPUTS.includes(type)) {
        entries.push(o$1(KeyEntry, {
          editField: editField,
          field: field
        }));
      }
  
      if (type === 'button') {
        entries.push(o$1(ActionEntry, {
          editField: editField,
          field: field
        }));
      }
  
      if (type === 'columns') {
        entries.push(o$1(ColumnsEntry, {
          editField: editField,
          field: field
        }));
      }
  
      if (type === 'text') {
        entries.push(o$1(TextEntry, {
          editField: editField,
          field: field
        }));
      }
  
      return o$1(Group, {
        label: "通用",
        children: entries.length ? entries : null
      });
    }
  
    function ValidationGroup(field, editField) {
      const {
        type
      } = field;
  
      const onChange = key => {
        return value => {
          const validate = get(field, ['validate'], {});
          editField(field, ['validate'], set(validate, [key], value));
        };
      };
  
      const entries = [o$1(CheckboxInputEntry, {
        id: "required",
        label: "必填",
        onChange: onChange('required'),
        value: get(field, ['validate', 'required'])
      })];
  
      if (type === 'textfield') {
        entries.push(o$1(NumberInputEntry, {
          id: "minLength",
          label: "最小长度",
          min: "0",
          onChange: onChange('minLength'),
          value: get(field, ['validate', 'minLength'])
        }), o$1(NumberInputEntry, {
          id: "maxLength",
          label: "最大长度",
          min: "0",
          onChange: onChange('maxLength'),
          value: get(field, ['validate', 'maxLength'])
        }), o$1(TextInputEntry, {
          id: "regularExpressionPattern",
          label: "正则表达式",
          onChange: onChange('regularExpressionPattern'),
          value: get(field, ['validate', 'regularExpressionPattern'])
        }));
      }
  
      if (type === 'number') {
        entries.push(o$1(NumberInputEntry, {
          id: "min",
          label: "最小值",
          onChange: onChange('min'),
          value: get(field, ['validate', 'min'])
        }), o$1(NumberInputEntry, {
          id: "max",
          label: "最大值",
          onChange: onChange('max'),
          value: get(field, ['validate', 'max'])
        }));
      }
  
      return o$1(Group, {
        label: "校验",
        children: entries.length ? entries : null
      });
    }
  
    function ValuesGroup(field, editField) {
      const {
        values = []
      } = field;
  
      const addEntry = () => {
        const entry = {
          label: 'Value',
          value: 'value'
        };
        editField(field, ['values'], arrayAdd$1(values, values.length, entry));
      };
  
      const hasEntries = values.length > 0;
      return o$1(Group, {
        label: "选项",
        addEntry: addEntry,
        hasEntries: hasEntries,
        children: values.map((value, index) => {
          const {
            _id
          } = field;
          const {
            label
          } = value;
  
          const removeEntry = () => {
            editField(field, ['values'], arrayRemove$1(values, index));
          };
  
          return o$1(CollapsibleEntry, {
            label: label,
            removeEntry: removeEntry,
            children: o$1(ValueEntry, {
              editField: editField,
              field: field,
              index: index
            })
          }, _id);
        })
      });
    }
  
    const labelsByType = {
      button: '按钮',
      checkbox: '选项',
      columns: 'COLUMNS',
      number: '数字框',
      radio: 'RADIO',
      text: '文本',
      textfield: 'TEXT FIELD'
    };
  
    function getGroups(field, editField) {
      const {
        type
      } = field;
      const groups = [GeneralGroup(field, editField)];
  
      if (type === 'radio' || type === 'select') {
        groups.push(ValuesGroup(field, editField));
      }
  
      if (INPUTS.includes(type) && type !== 'checkbox') {
        groups.push(ValidationGroup(field, editField));
      }
  
      return groups;
    }
  
    function PropertiesPanel(props) {
      const {
        editField,
        field
      } = props;
  
      if (!field || field.type === 'default') {
        return o$1("div", {
          class: "fjs-properties-panel-placeholder",
          children: "请拖拽选择组件，自定义表单"
        });
      }
  
      const {
        type
      } = field;
      const Icon = iconsByType[type];
      const label = labelsByType[type];
      return o$1("div", {
        class: "fjs-properties-panel",
        children: [o$1("div", {
          class: "fjs-properties-panel-header",
          children: [o$1("div", {
            class: "fjs-properties-panel-header-icon",
            children: o$1(Icon, {
              width: "36",
              height: "36",
              viewBox: "0 0 54 54"
            })
          }), o$1("div", {
            children: [o$1("span", {
              class: "fjs-properties-panel-header-type",
              children: label
            }), type === 'text' ? o$1("div", {
              class: "fjs-properties-panel-header-label",
              children: textToLabel(field.text)
            }) : o$1("div", {
              class: "fjs-properties-panel-header-label",
              children: field.label
            })]
          })]
        }), getGroups(field, editField)]
      });
    }
  
    function ContextPad(props) {
      if (!props.children) {
        return null;
      }
  
      return o$1("div", {
        class: "fjs-context-pad",
        children: props.children
      });
    }
  
    function Empty(props) {
      return null;
    }
  
    function Element$1(props) {
      const formEditor = useService$1('formEditor'),
            formFieldRegistry = useService$1('formFieldRegistry'),
            modeling = useService$1('modeling'),
            selection = useService$1('selection');
  
      const {
        schema
      } = formEditor._getState();
  
      const {
        field
      } = props;
      const {
        _id,
        type
      } = field;
  
      function onClick(event) {
        if (type === 'default') {
          return;
        }
  
        event.stopPropagation();
        selection.set(_id);
      }
  
      const classes = ['fjs-element'];
  
      if (props.class) {
        classes.push(...props.class.split(' '));
      }
  
      if (selection.get() === _id) {
        classes.push('fjs-editor-selected');
      }
  
      const onRemove = event => {
        event.stopPropagation();
        const selectableField = findSelectableField(schema, formFieldRegistry, field);
        const parentField = formFieldRegistry.get(field._parent);
        const index = getFormFieldIndex(parentField, field);
        modeling.removeFormField(parentField, index);
  
        if (selectableField) {
          selection.set(selectableField._id);
        } else {
          selection.clear();
        }
      };
  
      return o$1("div", {
        class: classes.join(' '),
        "data-id": _id,
        "data-field-type": type,
        onClick: onClick,
        children: [o$1(ContextPad, {
          children: selection.get() === _id ? o$1("button", {
            class: "fjs-context-pad-item",
            onClick: onRemove,
            children: o$1(ListDeleteIcon, {})
          }) : null
        }), props.children]
      });
    }
  
    function Children(props) {
      const {
        field
      } = props;
      const {
        _id
      } = field;
      const classes = ['fjs-children', 'fjs-drag-container'];
  
      if (props.class) {
        classes.push(...props.class.split(' '));
      }
  
      return o$1("div", {
        class: classes.join(' '),
        "data-id": _id,
        children: props.children
      });
    }
  
    function FormEditor(props) {
      const eventBus = useService$1('eventBus'),
            formEditor = useService$1('formEditor'),
            formFields = useService$1('formFields'),
            formFieldRegistry = useService$1('formFieldRegistry'),
            injector = useService$1('injector'),
            modeling = useService$1('modeling'),
            selection = useService$1('selection');
  
      const {
        schema
      } = formEditor._getState();
  
      const [_, setSelection] = l(null);
      eventBus.on('selection.changed', newSelection => {
        setSelection(newSelection);
      });
      y$1(() => {
        const selectableField = findSelectableField(schema, formFieldRegistry);
  
        if (selectableField) {
          selection.set(selectableField._id);
        }
      }, []);
      let selectedFormField;
  
      if (selection.get()) {
        selectedFormField = formFieldRegistry.get(selection.get());
      }
  
      const [drake, setDrake] = l(null);
      const dragAndDropContext = {
        drake
      };
      y$1(() => {
        const createDragulaInstance = () => {
          const dragulaInstance = dragula_1({
            isContainer(el) {
              return el.classList.contains('fjs-drag-container');
            },
  
            copy(el) {
              return el.classList.contains('fjs-drag-copy');
            },
  
            accepts(el, target) {
              return !target.classList.contains('fjs-no-drop');
            }
  
          });
          dragulaInstance.on('drop', (el, target, source, sibling) => {
            dragulaInstance.remove();
  
            if (!target) {
              return;
            }
  
            const targetFormField = formFieldRegistry.get(target.dataset.id);
            const siblingFormField = sibling && formFieldRegistry.get(sibling.dataset.id),
                  targetIndex = siblingFormField ? getFormFieldIndex(targetFormField, siblingFormField) : targetFormField.components.length;
  
            if (source.classList.contains('fjs-palette')) {
              const type = el.dataset.fieldType;
              const formField = formFields.get(type);
              const newFormField = formField.create({
                _parent: targetFormField._id
              });
              selection.set(newFormField._id);
              modeling.addFormField(targetFormField, targetIndex, newFormField);
            } else {
              const formField = formFieldRegistry.get(el.dataset.id),
                    sourceFormField = formFieldRegistry.get(source.dataset.id),
                    sourceIndex = getFormFieldIndex(sourceFormField, formField);
              selection.set(formField._id);
              modeling.moveFormField(sourceFormField, targetFormField, sourceIndex, targetIndex);
            }
          });
          eventBus.fire('dragula.created');
          setDrake(dragulaInstance);
          return dragulaInstance;
        };
  
        let dragulaInstance = createDragulaInstance();
  
        const onDetach = () => {
          if (dragulaInstance) {
            dragulaInstance.destroy();
            eventBus.fire('dragula.destroyed');
          }
        };
  
        const onAttach = () => {
          onDetach();
          dragulaInstance = createDragulaInstance();
        };
  
        eventBus.on('attach', onAttach);
        eventBus.on('detach', onDetach);
        return () => {
          onDetach();
          eventBus.off('attach', onAttach);
          eventBus.off('detach', onDetach);
        };
      }, []);
      const formRenderContext = {
        Children,
        Element: Element$1,
        Empty
      };
      const formContext = {
        getService(type, strict = true) {
          // TODO(philippfromme): clean up
          if (type === 'formFieldRegistry') {
            return new Map();
          } else if (type === 'form') {
            return {
              _getState() {
                return {
                  data: {},
                  errors: {},
                  properties: {
                    readOnly: true
                  },
                  schema
                };
              }
  
            };
          }
  
          return injector.get(type, strict);
        }
  
      };
      const onSubmit = A$1(() => {}, []);
      const onReset = A$1(() => {}, []);
      const editField = A$1((formField, key, value) => modeling.editFormField(formField, key, value), [modeling]);
      return o$1("div", {
        class: "fjs-form-editor",
        children: [o$1(DragAndDropContext.Provider, {
          value: dragAndDropContext,
          children: [o$1("div", {
            class: "fjs-palette-container",
            children: o$1(Palette, {})
          }), o$1("div", {
            class: "fjs-form-container",
            children: o$1(FormContext.Provider, {
              value: formContext,
              children: o$1(FormRenderContext.Provider, {
                value: formRenderContext,
                children: o$1(FormComponent, {
                  onSubmit: onSubmit,
                  onReset: onReset
                })
              })
            })
          }), o$1(CreatePreview, {})]
        }), o$1("div", {
          class: "fjs-properties-container",
          children: o$1(PropertiesPanel, {
            field: selectedFormField,
            editField: editField
          })
        })]
      });
    }
  
    function getFormFieldIndex(parent, formField) {
      let fieldFormIndex = parent.components.length;
      parent.components.forEach(({
        _id
      }, index) => {
        if (_id === formField._id) {
          fieldFormIndex = index;
        }
      });
      return fieldFormIndex;
    }
  
    function CreatePreview(props) {
      const {
        drake
      } = F(DragAndDropContext);
  
      function handleCloned(clone, original, type) {
        const fieldType = clone.dataset.fieldType;
        const Icon = iconsByType[fieldType];
  
        if (fieldType) {
          clone.innerHTML = '';
          clone.class = 'gu-mirror';
          N(o$1(Icon, {}), clone);
        }
      }
  
      y$1(() => {
        if (!drake) {
          return;
        }
  
        drake.on('cloned', handleCloned);
        return () => drake.off('cloned', handleCloned);
      }, [drake]);
      return null;
    }
  
    function findSelectableField(schema, formFieldRegistry, formField) {
      if (formField) {
        const parent = formFieldRegistry.get(formField._parent);
        const index = getFormFieldIndex(parent, formField);
        return parent.components[index + 1];
      }
  
      return schema.components.find(({
        type
      }) => type !== 'default');
    }
  
    class Renderer {
      constructor(config, eventBus, formEditor, injector) {
        const App = () => {
          const [state, setState] = l(formEditor._getState());
          const formEditorContext = {
            getService(type, strict = true) {
              return injector.get(type, strict);
            }
  
          };
          formEditor.on('changed', newState => {
            setState(newState);
          });
          const {
            schema
          } = state;
  
          if (!schema) {
            return null;
          }
  
          return o$1("div", {
            class: "fjs-container fjs-editor-container",
            children: o$1(FormEditorContext.Provider, {
              value: formEditorContext,
              children: o$1(FormEditor, {})
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
  
    }
    Renderer.$inject = ['config.renderer', 'eventBus', 'formEditor', 'injector'];
  
    var renderModule = {
      __init__: ['formFields', 'renderer'],
      formFields: ['type', FormFields],
      renderer: ['type', Renderer]
    };
  
    var core = {
      __depends__: [commandModule, importModule, renderModule],
      __init__: ['modeling'],
      eventBus: ['type', EventBus$1],
      formFieldRegistry: ['type', FormFieldRegistry],
      modeling: ['type', Modeling],
      selection: ['type', Selection],
      debounce: ['factory', DebounceFactory]
    };
  
    var NOT_REGISTERED_ERROR = 'is not a registered action',
        IS_REGISTERED_ERROR = 'is already registered';
    /**
     * An interface that provides access to modeling actions by decoupling
     * the one who requests the action to be triggered and the trigger itself.
     *
     * It's possible to add new actions by registering them with ´registerAction´
     * and likewise unregister existing ones with ´unregisterAction´.
     *
     *
     * ## Life-Cycle and configuration
     *
     * The editor actions will wait for diagram initialization before
     * registering default actions _and_ firing an `editorActions.init` event.
     *
     * Interested parties may listen to the `editorActions.init` event with
     * low priority to check, which actions got registered. Other components
     * may use the event to register their own actions via `registerAction`.
     *
     * @param {EventBus} eventBus
     * @param {Injector} injector
     */
  
    function EditorActions(eventBus, injector) {
      // initialize actions
      this._actions = {};
      var self = this;
      eventBus.on('diagram.init', function () {
        // all diagram modules got loaded; check which ones
        // are available and register the respective default actions
        self._registerDefaultActions(injector); // ask interested parties to register available editor
        // actions on diagram initialization
  
  
        eventBus.fire('editorActions.init', {
          editorActions: self
        });
      });
    }
    EditorActions.$inject = ['eventBus', 'injector'];
    /**
     * Register default actions.
     *
     * @param {Injector} injector
     */
  
    EditorActions.prototype._registerDefaultActions = function (injector) {
      // (1) retrieve optional components to integrate with
      var commandStack = injector.get('commandStack', false);
      var modeling = injector.get('modeling', false);
      var selection = injector.get('selection', false);
      var zoomScroll = injector.get('zoomScroll', false);
      var copyPaste = injector.get('copyPaste', false);
      var canvas = injector.get('canvas', false);
      var rules = injector.get('rules', false);
      var keyboardMove = injector.get('keyboardMove', false);
      var keyboardMoveSelection = injector.get('keyboardMoveSelection', false); // (2) check components and register actions
  
      if (commandStack) {
        this.register('undo', function () {
          commandStack.undo();
        });
        this.register('redo', function () {
          commandStack.redo();
        });
      }
  
      if (copyPaste && selection) {
        this.register('copy', function () {
          var selectedElements = selection.get();
          copyPaste.copy(selectedElements);
        });
      }
  
      if (copyPaste) {
        this.register('paste', function () {
          copyPaste.paste();
        });
      }
  
      if (zoomScroll) {
        this.register('stepZoom', function (opts) {
          zoomScroll.stepZoom(opts.value);
        });
      }
  
      if (canvas) {
        this.register('zoom', function (opts) {
          canvas.zoom(opts.value);
        });
      }
  
      if (modeling && selection && rules) {
        this.register('removeSelection', function () {
          var selectedElements = selection.get();
  
          if (!selectedElements.length) {
            return;
          }
  
          var allowed = rules.allowed('elements.delete', {
            elements: selectedElements
          }),
              removableElements;
  
          if (allowed === false) {
            return;
          } else if (isArray(allowed)) {
            removableElements = allowed;
          } else {
            removableElements = selectedElements;
          }
  
          if (removableElements.length) {
            modeling.removeElements(removableElements.slice());
          }
        });
      }
  
      if (keyboardMove) {
        this.register('moveCanvas', function (opts) {
          keyboardMove.moveCanvas(opts);
        });
      }
  
      if (keyboardMoveSelection) {
        this.register('moveSelection', function (opts) {
          keyboardMoveSelection.moveSelection(opts.direction, opts.accelerated);
        });
      }
    };
    /**
     * Triggers a registered action
     *
     * @param  {string} action
     * @param  {Object} opts
     *
     * @return {Unknown} Returns what the registered listener returns
     */
  
  
    EditorActions.prototype.trigger = function (action, opts) {
      if (!this._actions[action]) {
        throw error(action, NOT_REGISTERED_ERROR);
      }
  
      return this._actions[action](opts);
    };
    /**
     * Registers a collections of actions.
     * The key of the object will be the name of the action.
     *
     * @example
     * ´´´
     * var actions = {
     *   spaceTool: function() {
     *     spaceTool.activateSelection();
     *   },
     *   lassoTool: function() {
     *     lassoTool.activateSelection();
     *   }
     * ];
     *
     * editorActions.register(actions);
     *
     * editorActions.isRegistered('spaceTool'); // true
     * ´´´
     *
     * @param  {Object} actions
     */
  
  
    EditorActions.prototype.register = function (actions, listener) {
      var self = this;
  
      if (typeof actions === 'string') {
        return this._registerAction(actions, listener);
      }
  
      forEach(actions, function (listener, action) {
        self._registerAction(action, listener);
      });
    };
    /**
     * Registers a listener to an action key
     *
     * @param  {string} action
     * @param  {Function} listener
     */
  
  
    EditorActions.prototype._registerAction = function (action, listener) {
      if (this.isRegistered(action)) {
        throw error(action, IS_REGISTERED_ERROR);
      }
  
      this._actions[action] = listener;
    };
    /**
     * Unregister an existing action
     *
     * @param {string} action
     */
  
  
    EditorActions.prototype.unregister = function (action) {
      if (!this.isRegistered(action)) {
        throw error(action, NOT_REGISTERED_ERROR);
      }
  
      this._actions[action] = undefined;
    };
    /**
     * Returns the number of actions that are currently registered
     *
     * @return {number}
     */
  
  
    EditorActions.prototype.getActions = function () {
      return Object.keys(this._actions);
    };
    /**
     * Checks wether the given action is registered
     *
     * @param {string} action
     *
     * @return {boolean}
     */
  
  
    EditorActions.prototype.isRegistered = function (action) {
      return !!this._actions[action];
    };
  
    function error(action, message) {
      return new Error(action + ' ' + message);
    }
  
    var EditorActionsModule = {
      __init__: ['editorActions'],
      editorActions: ['type', EditorActions]
    };
  
    class FormEditorActions extends EditorActions {
      constructor(eventBus, injector) {
        super(eventBus, injector);
        eventBus.on('form.init', () => {
          this._registerDefaultActions(injector);
  
          eventBus.fire('editorActions.init', {
            editorActions: this
          });
        });
      }
  
      _registerDefaultActions(injector) {
        const commandStack = injector.get('commandStack', false);
  
        if (commandStack) {
          // @ts-ignore
          this.register('undo', function () {
            commandStack.undo();
          }); // @ts-ignore
  
          this.register('redo', function () {
            commandStack.redo();
          });
        }
      }
  
    }
    FormEditorActions.$inject = ['eventBus', 'injector'];
  
    var EditorActionsModule$1 = {
      __depends__: [EditorActionsModule],
      editorActions: ['type', FormEditorActions]
    };
  
    /**
     * Returns true if event was triggered with any modifier
     * @param {KeyboardEvent} event
     */
  
    function hasModifier(event) {
      return event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
    }
    /**
     * @param {KeyboardEvent} event
     */
  
    function isCmd(event) {
      // ensure we don't react to AltGr
      // (mapped to CTRL + ALT)
      if (event.altKey) {
        return false;
      }
  
      return event.ctrlKey || event.metaKey;
    }
    /**
     * Checks if key pressed is one of provided keys.
     *
     * @param {string|Array<string>} keys
     * @param {KeyboardEvent} event
     */
  
    function isKey(keys, event) {
      keys = isArray(keys) ? keys : [keys];
      return keys.indexOf(event.key) !== -1 || keys.indexOf(event.keyCode) !== -1;
    }
    /**
     * @param {KeyboardEvent} event
     */
  
    function isShift(event) {
      return event.shiftKey;
    }
  
    var KEYDOWN_EVENT = 'keyboard.keydown',
        KEYUP_EVENT = 'keyboard.keyup';
    var DEFAULT_PRIORITY$1$1 = 1000;
    /**
     * A keyboard abstraction that may be activated and
     * deactivated by users at will, consuming key events
     * and triggering diagram actions.
     *
     * For keys pressed down, keyboard fires `keyboard.keydown` event.
     * The event context contains one field which is `KeyboardEvent` event.
     *
     * The implementation fires the following key events that allow
     * other components to hook into key handling:
     *
     *  - keyboard.bind
     *  - keyboard.unbind
     *  - keyboard.init
     *  - keyboard.destroy
     *
     * All events contain one field which is node.
     *
     * A default binding for the keyboard may be specified via the
     * `keyboard.bindTo` configuration option.
     *
     * @param {Config} config
     * @param {EventBus} eventBus
     */
  
    function Keyboard(config, eventBus) {
      var self = this;
      this._config = config || {};
      this._eventBus = eventBus;
      this._keydownHandler = this._keydownHandler.bind(this);
      this._keyupHandler = this._keyupHandler.bind(this); // properly clean dom registrations
  
      eventBus.on('diagram.destroy', function () {
        self._fire('destroy');
  
        self.unbind();
      });
      eventBus.on('diagram.init', function () {
        self._fire('init');
      });
      eventBus.on('attach', function () {
        if (config && config.bindTo) {
          self.bind(config.bindTo);
        }
      });
      eventBus.on('detach', function () {
        self.unbind();
      });
    }
    Keyboard.$inject = ['config.keyboard', 'eventBus'];
  
    Keyboard.prototype._keydownHandler = function (event) {
      this._keyHandler(event, KEYDOWN_EVENT);
    };
  
    Keyboard.prototype._keyupHandler = function (event) {
      this._keyHandler(event, KEYUP_EVENT);
    };
  
    Keyboard.prototype._keyHandler = function (event, type) {
      var target = event.target,
          eventBusResult;
  
      if (isInput$1(target)) {
        return;
      }
  
      var context = {
        keyEvent: event
      };
      eventBusResult = this._eventBus.fire(type || KEYDOWN_EVENT, context);
  
      if (eventBusResult) {
        event.preventDefault();
      }
    };
  
    Keyboard.prototype.bind = function (node) {
      // make sure that the keyboard is only bound once to the DOM
      this.unbind();
      this._node = node; // bind key events
  
      componentEvent.bind(node, 'keydown', this._keydownHandler, true);
      componentEvent.bind(node, 'keyup', this._keyupHandler, true);
  
      this._fire('bind');
    };
  
    Keyboard.prototype.getBinding = function () {
      return this._node;
    };
  
    Keyboard.prototype.unbind = function () {
      var node = this._node;
  
      if (node) {
        this._fire('unbind'); // unbind key events
  
  
        componentEvent.unbind(node, 'keydown', this._keydownHandler, true);
        componentEvent.unbind(node, 'keyup', this._keyupHandler, true);
      }
  
      this._node = null;
    };
  
    Keyboard.prototype._fire = function (event) {
      this._eventBus.fire('keyboard.' + event, {
        node: this._node
      });
    };
    /**
     * Add a listener function that is notified with `KeyboardEvent` whenever
     * the keyboard is bound and the user presses a key. If no priority is
     * provided, the default value of 1000 is used.
     *
     * @param {number} [priority]
     * @param {Function} listener
     * @param {string} type
     */
  
  
    Keyboard.prototype.addListener = function (priority, listener, type) {
      if (isFunction(priority)) {
        type = listener;
        listener = priority;
        priority = DEFAULT_PRIORITY$1$1;
      }
  
      this._eventBus.on(type || KEYDOWN_EVENT, priority, listener);
    };
  
    Keyboard.prototype.removeListener = function (listener, type) {
      this._eventBus.off(type || KEYDOWN_EVENT, listener);
    };
  
    Keyboard.prototype.hasModifier = hasModifier;
    Keyboard.prototype.isCmd = isCmd;
    Keyboard.prototype.isShift = isShift;
    Keyboard.prototype.isKey = isKey; // helpers ///////
  
    function isInput$1(target) {
      return target && (matchesSelector(target, 'input, textarea') || target.contentEditable === 'true');
    }
  
    var LOW_PRIORITY = 500;
    var KEYCODE_C = 67;
    var KEYCODE_V = 86;
    var KEYCODE_Y = 89;
    var KEYCODE_Z = 90;
    var KEYS_COPY = ['c', 'C', KEYCODE_C];
    var KEYS_PASTE = ['v', 'V', KEYCODE_V];
    var KEYS_REDO = ['y', 'Y', KEYCODE_Y];
    var KEYS_UNDO = ['z', 'Z', KEYCODE_Z];
    /**
     * Adds default keyboard bindings.
     *
     * This does not pull in any features will bind only actions that
     * have previously been registered against the editorActions component.
     *
     * @param {EventBus} eventBus
     * @param {Keyboard} keyboard
     */
  
    function KeyboardBindings(eventBus, keyboard) {
      var self = this;
      eventBus.on('editorActions.init', LOW_PRIORITY, function (event) {
        var editorActions = event.editorActions;
        self.registerBindings(keyboard, editorActions);
      });
    }
    KeyboardBindings.$inject = ['eventBus', 'keyboard'];
    /**
     * Register available keyboard bindings.
     *
     * @param {Keyboard} keyboard
     * @param {EditorActions} editorActions
     */
  
    KeyboardBindings.prototype.registerBindings = function (keyboard, editorActions) {
      /**
       * Add keyboard binding if respective editor action
       * is registered.
       *
       * @param {string} action name
       * @param {Function} fn that implements the key binding
       */
      function addListener(action, fn) {
        if (editorActions.isRegistered(action)) {
          keyboard.addListener(fn);
        }
      } // undo
      // (CTRL|CMD) + Z
  
  
      addListener('undo', function (context) {
        var event = context.keyEvent;
  
        if (isCmd(event) && !isShift(event) && isKey(KEYS_UNDO, event)) {
          editorActions.trigger('undo');
          return true;
        }
      }); // redo
      // CTRL + Y
      // CMD + SHIFT + Z
  
      addListener('redo', function (context) {
        var event = context.keyEvent;
  
        if (isCmd(event) && (isKey(KEYS_REDO, event) || isKey(KEYS_UNDO, event) && isShift(event))) {
          editorActions.trigger('redo');
          return true;
        }
      }); // copy
      // CTRL/CMD + C
  
      addListener('copy', function (context) {
        var event = context.keyEvent;
  
        if (isCmd(event) && isKey(KEYS_COPY, event)) {
          editorActions.trigger('copy');
          return true;
        }
      }); // paste
      // CTRL/CMD + V
  
      addListener('paste', function (context) {
        var event = context.keyEvent;
  
        if (isCmd(event) && isKey(KEYS_PASTE, event)) {
          editorActions.trigger('paste');
          return true;
        }
      }); // zoom in one step
      // CTRL/CMD + +
  
      addListener('stepZoom', function (context) {
        var event = context.keyEvent; // quirk: it has to be triggered by `=` as well to work on international keyboard layout
        // cf: https://github.com/bpmn-io/bpmn-js/issues/1362#issuecomment-722989754
  
        if (isKey(['+', 'Add', '='], event) && isCmd(event)) {
          editorActions.trigger('stepZoom', {
            value: 1
          });
          return true;
        }
      }); // zoom out one step
      // CTRL + -
  
      addListener('stepZoom', function (context) {
        var event = context.keyEvent;
  
        if (isKey(['-', 'Subtract'], event) && isCmd(event)) {
          editorActions.trigger('stepZoom', {
            value: -1
          });
          return true;
        }
      }); // zoom to the default level
      // CTRL + 0
  
      addListener('zoom', function (context) {
        var event = context.keyEvent;
  
        if (isKey('0', event) && isCmd(event)) {
          editorActions.trigger('zoom', {
            value: 1
          });
          return true;
        }
      }); // delete selected element
      // DEL
  
      addListener('removeSelection', function (context) {
        var event = context.keyEvent;
  
        if (isKey(['Backspace', 'Delete', 'Del'], event)) {
          editorActions.trigger('removeSelection');
          return true;
        }
      });
    };
  
    var KeyboardModule = {
      __init__: ['keyboard', 'keyboardBindings'],
      keyboard: ['type', Keyboard],
      keyboardBindings: ['type', KeyboardBindings]
    };
  
    const LOW_PRIORITY$1 = 500;
    class FormEditorKeyboardBindings {
      constructor(eventBus, keyboard) {
        eventBus.on('editorActions.init', LOW_PRIORITY$1, event => {
          const {
            editorActions
          } = event;
          this.registerBindings(keyboard, editorActions);
        });
      }
  
      registerBindings(keyboard, editorActions) {
        function addListener(action, fn) {
          if (editorActions.isRegistered(action)) {
            keyboard.addListener(fn);
          }
        } // Undo
        // (CTRL|CMD) + Z
  
  
        addListener('undo', context => {
          const {
            keyEvent
          } = context;
  
          if (isCmd(keyEvent) && !isShift(keyEvent) && isKey(KEYS_UNDO, keyEvent)) {
            editorActions.trigger('undo');
            return true;
          }
        }); // Redo
        // CTRL + Y
        // CMD + SHIFT + Z
  
        addListener('redo', context => {
          const {
            keyEvent
          } = context;
  
          if (isCmd(keyEvent) && (isKey(KEYS_REDO, keyEvent) || isKey(KEYS_UNDO, keyEvent) && isShift(keyEvent))) {
            editorActions.trigger('redo');
            return true;
          }
        });
      }
  
    }
    FormEditorKeyboardBindings.$inject = ['eventBus', 'keyboard'];
  
    var KeyboardModule$1 = {
      __depends__: [KeyboardModule],
      __init__: ['keyboardBindings'],
      keyboardBindings: ['type', FormEditorKeyboardBindings]
    };
  
    /**
     * @typedef { import('didi').Injector } Injector
     * @typedef { any[] } Modules
     * @typedef { { [x: string]: any } } FormEditorProperties
     * @typedef { any } Schema
     *
     * @typedef { {
     *   additionalModules?: Modules,
     *   container?: Element|string,
     *   exporter?: any,
     *   injector?: Injector,
     *   modules?: Modules,
     *   properties?: FormEditorProperties,
     *   [x: string]: any
     * } } FormEditorOptions
     *
     * @typedef { { properties: FormEditorProperties, schema: Schema } } State
     */
  
    class FormEditor$1 {
      /**
       * @constructor
       * @param {FormEditorOptions} options
       */
      constructor(options = {}) {
        /**
         * @private
         * @type {Element}
         */
        this._container = createFormContainer();
        const {
          container,
          exporter,
          injector = this._createInjector(options, this._container),
          properties = {}
        } = options;
        /**
         * @private
         * @type {any}
         */
  
        this.exporter = exporter;
        /**
         * @private
         * @type {State}
         */
  
        this._state = {
          properties,
          schema: null
        };
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
       */
  
  
      importSchema(schema) {
        return new Promise((resolve, reject) => {
          const importer = this.get('importer');
          schema = clone(schema);
          importer.importSchema(schema).then(({
            warnings
          }) => {
            this._setState({
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
       * @returns {Schema}
       */
  
  
      saveSchema() {
        return this.getSchema();
      }
      /**
       * @returns {Schema}
       */
  
  
      getSchema() {
        const {
          schema
        } = this._getState();
  
        return exportSchema(schema, this.exporter, schemaVersion);
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
       * @param {any} property
       * @param {any} value
       */
  
  
      setProperty(property, value) {
        const properties = set(this._getState().properties, [property], value);
  
        this._setState({
          properties
        });
      }
      /**
       * @param {string} type
       * @param {Function} handler
       */
  
  
      on(type, handler) {
        this.get('eventBus').on(type, handler);
      }
      /**
       * @param {string} type
       * @param {Function} handler
       */
  
  
      off(type, handler) {
        this.get('eventBus').on(type, handler);
      }
      /**
       * @param {FormEditorOptions} options
       * @param {Element} container
       *
       * @returns {import('didi').Injector}
       */
  
  
      _createInjector(options, container) {
        const {
          additionalModules = [],
          modules = this._getModules()
        } = options;
        const config = {
          renderer: {
            container
          },
          ...options
        };
        return createInjector([{
          config: ['value', config]
        }, {
          formEditor: ['value', this]
        }, core, ...modules, ...additionalModules]);
      }
  
      _emit(type, data) {
        this.get('eventBus').fire(type, data);
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
  
      _getModules() {
        return [EditorActionsModule$1, KeyboardModule$1];
      }
  
    } // helpers //////////
  
    function exportSchema(schema, exporter, schemaVersion) {
      const exportDetails = exporter ? {
        exporter
      } : {};
      const cleanedSchema = clone(schema, (name, value) => {
        if (['_id', '_parent', '_path'].includes(name)) {
          return undefined;
        }
  
        return value;
      });
      return {
        schemaVersion,
        ...exportDetails,
        ...cleanedSchema
      };
    }
  
    /**
     * @typedef { import('didi').Injector } Injector
     * @typedef { any[] } Modules
     * @typedef { { [x: string]: any } } FormEditorProperties
     * @typedef { any } Schema
     *
     * @typedef { {
     *   additionalModules?: Modules,
     *   container?: Element|string,
     *   exporter?: { name: string, version: string },
     *   injector?: Injector,
     *   modules?: Modules,
     *   properties?: FormEditorProperties,
     *   schema?: Schema
     * } } FormEditorOptions
     */
  
    /**
     * Create a form editor.
     *
     * @param {FormEditorOptions} options
     *
     * @return {Promise<FormEditor>}
     */
  
    function createFormEditor(options) {
      const {
        schema,
        ...rest
      } = options;
      const formEditor = new FormEditor$1(rest);
      return formEditor.importSchema(schema).then(() => {
        return formEditor;
      });
    }
  
    exports.FormEditor = FormEditor$1;
    exports.createFormEditor = createFormEditor;
    exports.schemaVersion = schemaVersion;
  
    Object.defineProperty(exports, '__esModule', { value: true });
  
  })));