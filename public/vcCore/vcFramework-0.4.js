/**
 * vcFramework
 * 
 * @author 吴学文
 * 
 * @version 0.3
 * 
 * @description 完成组件化编程思想
 * 
 * @time 2020-03-04
 * 
 * @qq 928255095
 * 
 * @mail 928255095@qq.com
 * 
 */
/**
   构建vcFramework对象
**/
(function (window) {
    "use strict";
    let vcFramework = window.vcFramework || {};
    window.vcFramework = vcFramework;
    //为了兼容 0.1版本的vc 框架
    window.vc = vcFramework;
    let _vmOptions = {};
    let _initMethod = [];
    let _initEvent = [];
    let _component = {};
    let _destroyedMethod = [];
    let _timers = [];//定时器
    let _map = [];// 共享数据存储
    let _namespace = [];
    let _vueCache = {};


    _vmOptions = {
        el: '#component',
        data: {},
        watch: {},
        methods: {},
        destroyed: function () {
            window.vcFramework.destroyedMethod.forEach(function (eventMethod) {
                eventMethod();
            });
            //清理所有定时器

            window.vcFramework.timers.forEach(function (timer) {
                clearInterval(timer);
            });

            _timers = [];
        }

    };

    vcFramework = {
        version: "v0.0.3",
        name: "vcFramework",
        author: '吴学文',
        email: '928255095@qq.com',
        qq: '928255095',
        description: 'vcFramework 是自研的一套组件开发套件',
        vueCache: _vueCache,
        vmOptions: _vmOptions,
        namespace: _namespace,
        initMethod: _initMethod,
        initEvent: _initEvent,
        component: _component,
        destroyedMethod: _destroyedMethod,
        debug: false,
        timers: _timers,
        _map: {}
    };
    //通知window对象
    window.vcFramework = vcFramework;
    window.vc = vcFramework;

})(window);

(function (vcFramework) {

    let componentCache = {};
    /**
     *  树
     * @param {*} _vcCreate  自定义组件
     * @param {*} _html 组件内容
     * @param {*} _nodeLocation  组件位置 1 开始节点 -1 结束节点
     */
    let VcTree = function (_vcCreate, _html, _nodeLocation) {
        let o = new Object();
        o.treeId = vcFramework.uuid();
        o.vcCreate = _vcCreate;
        o.html = _html;
        o.js = "";
        o.css = "";
        o.vcSubTree = [];
        o.nodeLocation = _nodeLocation;
        o.putSubTree = function (_vcSubTree) {
            o.vcSubTree.push(_vcSubTree);
        };
        o.setHtml = function (_html) {
            o.html = _html;
        };
        o.setJs = function (_js) {
            o.js = _js;
        };
        o.setCss = function (_css) {
            o.css = _css;
        };
        o.setLocation = function (_location) {
            o.nodeLocation = _location;
        };
        return o;
    };

    /**
     * 构建 树
     */
    vcFramework.builderVcTree = async function () {
        let _componentUrl = location.hash;

        //判断是否为组件页面
        if (vcFramework.notNull(_componentUrl)) {
            let _vcComponent = document.getElementById('component');
            let vcComponentChilds = _vcComponent.childNodes;
            for (let vcIndex = vcComponentChilds.length - 1; vcIndex >= 0; vcIndex--) {
                _vcComponent.removeChild(vcComponentChilds[vcIndex]);
            }

            if (_componentUrl.lastIndexOf('#') > -1) {
                let endPos = _componentUrl.length;
                if (_componentUrl.indexOf('?') > -1) {
                    endPos = _componentUrl.indexOf('?');
                }
                _componentUrl = _componentUrl.substring(_componentUrl.lastIndexOf('#') + 1, endPos);
            }

            let _tmpVcCreate = document.createElement("vc:create");
            let _divComponentAttr = document.createAttribute('path');
            _divComponentAttr.value = _componentUrl;
            _tmpVcCreate.setAttributeNode(_divComponentAttr);
            _vcComponent.appendChild(_tmpVcCreate);

            let _commonPath = _vcComponent.getAttribute('vc-path');
            if (vc.isNotEmpty(_commonPath)) {
                let _pathVcCreate = document.createElement("vc:create");
                let _pathDivComponentAttr = document.createAttribute('path');
                _pathDivComponentAttr.value = _commonPath;
                _pathVcCreate.setAttributeNode(_pathDivComponentAttr);
                _vcComponent.appendChild(_pathVcCreate);
            }

        } else {
            let _vcComponent = document.getElementById('component');
            let _commonPath = _vcComponent.getAttribute('vc-path');
            if (vc.isNotEmpty(_commonPath)) {
                let _pathVcCreate = document.createElement("vc:create");
                let _pathDivComponentAttr = document.createAttribute('path');
                _pathDivComponentAttr.value = _commonPath;
                _pathVcCreate.setAttributeNode(_pathDivComponentAttr);
                _vcComponent.appendChild(_pathVcCreate);
            }

        }
        let vcElements = document.getElementsByTagName('vc:create');
        let treeList = [];
        let _componentScript = [];
        for (let _vcElementIndex = 0; _vcElementIndex < vcElements.length; _vcElementIndex++) {
            let _vcElement = vcElements[_vcElementIndex];
            let _tree = new VcTree(_vcElement, '', 1);
            let _vcCreateAttr = document.createAttribute('id');
            _vcCreateAttr.value = _tree.treeId;
            _vcElement.setAttributeNode(_vcCreateAttr);
            treeList.push(_tree);
            //创建div
            await findVcLabel(_tree, _vcElement);
            let _res = _tree.html;
        }
        //渲染组件html
        reader(treeList, _componentScript);
        //执行组件js
        execScript(treeList, _componentScript);
    };

    /**
     * 页面内 组件跳转
     */
    vcFramework.reBuilderVcTree = async function () {
        let _componentUrl = location.hash;

        //判断是否为组件页面
        if (!vcFramework.notNull(_componentUrl)) {
            vcFramework.toast('程序异常，url没有包含组件');
            return;
        }

        if (_componentUrl.lastIndexOf('#') < 0) {
            vcFramework.toast('程序异常，url包含组件错误');
            return;
        }

        let _vcComponent = document.getElementById('component');
        let vcComponentChilds = _vcComponent.childNodes;
        for (let vcIndex = vcComponentChilds.length - 1; vcIndex >= 0; vcIndex--) {
            _vcComponent.removeChild(vcComponentChilds[vcIndex]);
        }
        let endPos = _componentUrl.length;
        if (_componentUrl.indexOf('?') > -1) {
            endPos = _componentUrl.indexOf('?');
        }

        _componentUrl = _componentUrl.substring(_componentUrl.lastIndexOf('#') + 1, endPos);

        let _tmpVcCreate = document.createElement("vc:create");
        let _divComponentAttr = document.createAttribute('path');
        _divComponentAttr.value = _componentUrl;
        _tmpVcCreate.setAttributeNode(_divComponentAttr);
        _vcComponent.appendChild(_tmpVcCreate);

        let _commonPath = _vcComponent.getAttribute('vc-path');
        if (vc.isNotEmpty(_commonPath)) {
            let _pathVcCreate = document.createElement("vc:create");
            let _pathDivComponentAttr = document.createAttribute('path');
            _pathDivComponentAttr.value = _commonPath;
            _pathVcCreate.setAttributeNode(_pathDivComponentAttr);
            _vcComponent.appendChild(_pathVcCreate);
        }

        let treeList = [];
        let _componentScript = [];

        let _vcElement = _tmpVcCreate;

        let vcElements = _vcComponent.getElementsByTagName('vc:create');

        for (let _vcElementIndex = 0; _vcElementIndex < vcElements.length; _vcElementIndex++) {
            let _vcElement = vcElements[_vcElementIndex];
            let _tree = new VcTree(_vcElement, '', 1);
            let _vcCreateAttr = document.createAttribute('id');
            _vcCreateAttr.value = _tree.treeId;
            _vcElement.setAttributeNode(_vcCreateAttr);
            treeList.push(_tree);
            //创建div
            await findVcLabel(_tree, _vcElement);
        }

        //渲染组件html
        reader(treeList, _componentScript);
        //执行组件js
        execScript(treeList, _componentScript);
    };

    /**
     * 从当前 HTML中找是否存在 <vc:create path="xxxx"></vc:create> 标签
     */
    findVcLabel = async function (_tree) {
        //查看是否存在子 vc:create 
        let _componentName = _tree.vcCreate.getAttribute('path');
        //console.log('_componentName', _componentName, _tree);
        if (!vcFramework.isNotEmpty(_componentName)) {
            throw '组件未包含path 属性' + _tree.vcCreate.outerHTML;
        }
        //开始加载组件
        let _componentElement = await loadComponent(_componentName, _tree);
        //_tree.setHtml(_componentElement);

        //console.log('_componentElement>>', _componentElement)

        if (vcFramework.isNotNull(_componentElement)) {
            let vcChildElements = _componentElement.getElementsByTagName('vc:create');
            if (vcChildElements.length > 0) {
                let _vcDiv = document.createElement('div');
                for (let _vcChildIndex = 0; _vcChildIndex < vcChildElements.length; _vcChildIndex++) {
                    //console.log('vcChildElements', vcChildElements);
                    let _tmpChildElement = vcChildElements[_vcChildIndex];
                    let _subtree = new VcTree(_tmpChildElement, '', 2);
                    let _vcCreateAttr = document.createAttribute('id');
                    _vcCreateAttr.value = _subtree.treeId;
                    _tmpChildElement.setAttributeNode(_vcCreateAttr);
                    _tree.putSubTree(_subtree);
                    await findVcLabel(_subtree);
                }
            }

        }
    };

    /**
     * 渲染组件 html 页面
     */
    reader = function (_treeList, _componentScript) {
        //console.log('_treeList', _treeList);
        let _header = document.getElementsByTagName('head');
        for (let _treeIndex = 0; _treeIndex < _treeList.length; _treeIndex++) {
            let _tree = _treeList[_treeIndex];
            let _vcCreateEl = document.getElementById(_tree.treeId);
            let _componentHeader = _tree.html.getElementsByTagName('head');
            let _componentBody = _tree.html.getElementsByTagName('body');

            if (_vcCreateEl.hasAttribute("location") && 'head' == _vcCreateEl.getAttribute('location')) {
                let _componentHs = _componentHeader[0].childNodes;
                _header[0].appendChild(_componentHeader[0]);

            } else if (_vcCreateEl.hasAttribute("location") && 'body' == _vcCreateEl.getAttribute('location')) {
                _vcCreateEl.parentNode.replaceChild(_componentHeader[0].childNodes[0], _vcCreateEl);
                let _bodyComponentHs = _componentHeader[0].childNodes;
                for (let _bsIndex = 0; _bsIndex < _bodyComponentHs.length; _bsIndex++) {
                    let _bComponentScript = _bodyComponentHs[_bsIndex];
                    if (_bComponentScript.tagName == 'SCRIPT') {
                        let scriptObj = document.createElement("script");
                        scriptObj.src = _bComponentScript.src;
                        scriptObj.type = "text/javascript";
                        document.getElementsByTagName("body")[0].appendChild(scriptObj);
                    } else {
                        _header[0].appendChild(_bodyComponentHs[_bsIndex]);
                    }

                }

            } else {
                //_vcCreateEl.innerHTML = _componentBody[0].innerHTML;
                //_vcCreateEl.parentNode.replaceChild(_componentBody[0], _vcCreateEl);

                for (let _comBodyIndex = 0; _comBodyIndex < _componentBody.length; _comBodyIndex++) {
                    let _childNodes = _componentBody[_comBodyIndex].childNodes;
                    for (let _tmpChildIndex = 0; _tmpChildIndex < _childNodes.length; _tmpChildIndex++) {
                        _vcCreateEl.parentNode.insertBefore(_childNodes[_tmpChildIndex], _vcCreateEl)
                    }

                }

            }
            //将js 脚本放到 组件 脚本中
            if (vcFramework.isNotEmpty(_tree.js)) {
                _componentScript.push(_tree.js);
            }


            let _tmpSubTrees = _tree.vcSubTree;

            if (_tmpSubTrees != null && _tmpSubTrees.length > 0) {
                reader(_tmpSubTrees, _componentScript);
            }

        }
        /**
         * 执行 页面上的js 文件
         */
        let _tmpScripts = document.head.getElementsByTagName("script");
        let _tmpBody = document.getElementsByTagName('body');
        for (let _scriptsIndex = 0; _scriptsIndex < _tmpScripts.length; _scriptsIndex++) {
            let _tmpScript = _tmpScripts[_scriptsIndex];
            //console.log('_head 中 script', _tmpScript.outerHTML)
            let scriptObj = document.createElement("script");
            scriptObj.src = _tmpScript.src;
            //_tmpScript.parentNode.removeChild(_tmpScript);
            scriptObj.type = "text/javascript";
            _tmpBody[0].appendChild(scriptObj);
        }
    };

    /**
     * 手工执行js 脚本
     */
    execScript = function (_tree, _componentScript) {

        //console.log('_componentScript', _componentScript);


        for (let i = 0; i < _componentScript.length; i++) {
            //一段一段执行script 
            try {
                eval(_componentScript[i]);
            } catch (e) {
                console.log('js脚本错误', _componentScript[i]);
                console.error(e);
            }

        }

        //初始化vue 对象
        vcFramework.initVue();
        vcFramework.initVcComponent();
    }
 

    /**
     * 加载组件
     * 异步去服务端 拉去HTML 和 js
     */
    loadComponent = async function (_componentName, _tree) {
        if (vcFramework.isNotEmpty(_componentName) && _componentName.lastIndexOf('/') > 0) {
            _componentName = _componentName + '/' + _componentName.substring(_componentName.lastIndexOf('/') + 1, _componentName.length);
        }
        //从缓存查询
        let _cacheComponent = vcFramework.getComponent(_componentName);
        //console.log('加载组件名称', _componentName);
        let _htmlBody = '';
        let _jsBody = '';
        if (!vcFramework.isNotNull(_cacheComponent)) {
            let _domain = 'components';
            let filePath = '';

            if (_tree.vcCreate.hasAttribute("domain")) {
                _domain = _tree.vcCreate.getAttribute("domain");
            }
            if (_componentName.startsWith('/pages')) { //这里是为了处理 pages 页面
                filePath = _componentName;
            } else { //这里是为了处理组件
                filePath = '/' + _domain + '/' + _componentName;
            }
            let htmlFilePath = filePath + ".html";
            let jsFilePath = filePath + ".js";
            //加载html 页面
            [_htmlBody, _jsBody] = await Promise.all([vcFramework.httpGet(htmlFilePath), vcFramework.httpGet(jsFilePath)]);
            let _componentObj = {
                html: _htmlBody,
                js: _jsBody
            };
            vcFramework.putComponent(_componentName, _componentObj);
        } else {
            _htmlBody = _cacheComponent.html;
            _jsBody = _cacheComponent.js;
        }
        //处理命名空间
        _htmlBody = dealHtmlNamespace(_tree, _htmlBody);

        //处理 js
        _jsBody = dealJs(_tree, _jsBody);
        _jsBody = dealJsAddComponentCode(_tree, _jsBody);
        //处理命名空间
        _jsBody = dealJsNamespace(_tree, _jsBody);

        //处理侦听
        _jsBody = dealHtmlJs(_tree, _jsBody);

        _tmpJsBody = '<script type="text/javascript">//<![CDATA[\n' + _jsBody + '//]]>\n</script>';
        let parser = new DOMParser();

        //let htmlComponentDoc = parser.parseFromString(_htmlBody + _tmpJsBody, 'text/html').documentElement;
        let htmlComponentDoc = parser.parseFromString(_htmlBody, 'text/html').documentElement;

        //创建div
        let vcDiv = document.createElement('div');
        let _divComponentAttr = document.createAttribute('data-component');
        _divComponentAttr.value = _componentName;
        vcDiv.setAttributeNode(_divComponentAttr);
        vcDiv.appendChild(htmlComponentDoc);
        //vcDiv.appendChild(jsComponentDoc);

        _tree.setHtml(vcDiv);
        _tree.setJs(_jsBody);
        return vcDiv;
    };

    /**
     * 处理 命名空间html
     */
    dealHtmlNamespace = function (_tree, _html) {

        let _componentVcCreate = _tree.vcCreate;
        if (!_componentVcCreate.hasAttribute('namespace')) {
            return _html;
        }

        let _namespaceValue = _componentVcCreate.getAttribute("namespace");

        _html = _html.replace(/this./g, _namespaceValue + "_");

        _html = _html.replace(/(id)( )*=( )*'/g, "id='" + _namespaceValue + "_");
        _html = _html.replace(/(id)( )*=( )*"/g, 'id="' + _namespaceValue + '_');
        return _html;
    };
    /**
     * 处理js
     */
    dealJs = function (_tree, _js) {
        //在js 中检测propTypes 属性
        if (_js.indexOf("propTypes") < 0) {
            return _js;
        }

        let _componentVcCreate = _tree.vcCreate;

        //解析propTypes信息
        let tmpProTypes = _js.substring(_js.indexOf("propTypes"), _js.length);
        tmpProTypes = tmpProTypes.substring(tmpProTypes.indexOf("{") + 1, tmpProTypes.indexOf("}")).trim();

        if (!vcFramework.notNull(tmpProTypes)) {
            return _js;
        }

        tmpProTypes = tmpProTypes.indexOf("\r") > 0 ? tmpProTypes.replace("\r/g", "") : tmpProTypes;

        let tmpType = tmpProTypes.indexOf("\n") > 0
            ? tmpProTypes.split("\n")
            : tmpProTypes.split(",");
        let propsJs = "\nlet $props = {};\n";
        for (let typeIndex = 0; typeIndex < tmpType.length; typeIndex++) {
            let type = tmpType[typeIndex];
            if (!vcFramework.notNull(type) || type.indexOf(":") < 0) {
                continue;
            }
            let types = type.split(":");
            let attrKey = "";
            if (types[0].indexOf("//") > 0) {
                attrKey = types[0].substring(0, types[0].indexOf("//"));
            }
            attrKey = types[0].replace(" ", "");
            attrKey = attrKey.replace("\n", "")
            attrKey = attrKey.replace("\r", "").trim();
            if (!_componentVcCreate.hasAttribute(attrKey) && types[1].indexOf("=") < 0) {
                let componentName = _componentVcCreate.getAttribute("path");
                throw "组件[" + componentName + "]未配置组件属性" + attrKey;
            }
            let vcType = _componentVcCreate.getAttribute(attrKey);
            if (!_componentVcCreate.hasAttribute(attrKey) && types[1].indexOf("=") > 0) {
                vcType = dealJsPropTypesDefault(types[1]);
            } else if (types[1].indexOf("vc.propTypes.string") >= 0) {
                vcType = "'" + vcType + "'";
            }
            propsJs = propsJs + "$props." + attrKey + "=" + vcType + ";\n";
        }

        //将propsJs 插入到 第一个 { 之后
        let position = _js.indexOf("{");
        if (position < 0) {
            let componentName = _componentVcCreate.getAttribute("name");
            throw "组件" + componentName + "对应js 未包含 {}  ";
        }
        let newJs = _js.substring(0, position + 1);
        newJs = newJs + propsJs;
        newJs = newJs + _js.substring(position + 1, _js.length);
        return newJs;
    };

    dealJsPropTypesDefault = function (typeValue) {
        let startPos = typeValue.indexOf("=") + 1;
        let endPos = typeValue.length;
        if (typeValue.indexOf(",") > 0) {
            endPos = typeValue.indexOf(",");
        } else if (typeValue.indexOf("//") > 0) {
            endPos = typeValue.indexOf("//");
        }

        return typeValue.substring(startPos, endPos);
    };
    /**
     * js 处理命名
     */
    dealJsNamespace = function (_tree, _js) {

        //在js 中检测propTypes 属性
        let _componentVcCreate = _tree.vcCreate;

        if (_js.indexOf("vc.extends") < 0) {
            return _js;
        }
        let namespace = "";
        if (!_componentVcCreate.hasAttribute("namespace")) {
            namespace = 'default';
        } else {
            namespace = _componentVcCreate.getAttribute("namespace");
        }

        //js对象中插入namespace 值
        let extPos = _js.indexOf("vc.extends");
        let tmpProTypes = _js.substring(extPos, _js.length);
        let pos = tmpProTypes.indexOf("{") + 1;
        _js = _js.substring(0, extPos) + tmpProTypes.substring(0, pos).trim()
            + "\nnamespace:'" + namespace.trim() + "',\n" + tmpProTypes.substring(pos, tmpProTypes.length);
        let position = _js.indexOf("{");
        let propsJs = "\nlet $namespace='" + namespace.trim() + "';\n";

        let newJs = _js.substring(0, position + 1);
        newJs = newJs + propsJs;
        newJs = newJs + _js.substring(position + 1, _js.length);
        return newJs;
    };

    /**
    * 处理js 变量和 方法都加入 组件编码
    *
    * @param tag 页面元素
    * @param js  js文件内容
    * @return js 文件内容
    */
    dealJsAddComponentCode = function (_tree, _js) {
        let _componentVcCreate = _tree.vcCreate;

        if (!_componentVcCreate.hasAttribute("code")) {
            return _js;
        }

        let code = _componentVcCreate.getAttribute("code");

        return _js.replace("@vc_/g", code);
    }

    /**
     * 处理命名空间js
     */
    dealHtmlJs = function (_tree, _js) {
        let _componentVcCreate = _tree.vcCreate;
        if (!_componentVcCreate.hasAttribute('namespace')) {
            return _js;
        }

        let _namespaceValue = _componentVcCreate.getAttribute("namespace");
        _js = _js.replace(/this./g, "vc.component." + _namespaceValue + "_");
        _js = _js.replace(/(\$)( )*(\()( )*'#/g, "\$('#" + _namespaceValue + "_");

        _js = _js.replace(/(\$)( )*(\()( )*"#/g, "\$(\"#" + _namespaceValue + "_");

        //将 监听也做优化
        _js = _js.replace(/(vc.on)\('/g, "vc.on('" + _namespaceValue + "','");
        _js = _js.replace(/(vc.on)\("/g, "vc.on(\"" + _namespaceValue + "\",\"");
        return _js;
    }

})(window.vcFramework);

/**
 * vc-event 事件处理
 * 
 */

(function (vcFramework) {

    _initVcFrameworkEvent = function () {
        let vcFrameworkEvent = document.createEvent('Event');
        // 定义事件名为'build'.
        vcFrameworkEvent.initEvent('initVcFrameworkFinish', true, true);
        vcFramework.vcFrameworkEvent = vcFrameworkEvent;
    };

    /**
     * 初始化 vue 事件
     */
    _initVueEvent = function () {
        vcFramework.$event = new Vue();
    }

    _initVcFrameworkEvent();

    _initVueEvent();


})(window.vcFramework);

/**
 * vc-util
 */
(function (vcFramework) {

    //空判断 true 为非空 false 为空
    vcFramework.isNotNull = function (_paramObj) {
        if (_paramObj == null || _paramObj == undefined) {
            return false;
        }
        return true;
    };

    //空判断 true 为非空 false 为空
    vcFramework.isNotEmpty = function (_paramObj) {
        if (_paramObj == null || _paramObj == undefined || _paramObj.trim() == '') {
            return false;
        }
        return true;
    };

    vcFramework.uuid = function () {
        let s = [];
        let hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        let uuid = s.join("");
        return uuid;
    };

    /**
     * 深度拷贝对象
     */
    vcFramework.deepClone = function (obj) {
        return JSON.stringify(JSON.stringify(obj));
    }



})(window.vcFramework);

/**
 * 封装 后端请求 代码
 */
(function (vcFramework) {

    vcFramework.httpGet = function (url) {
        // XMLHttpRequest对象用于在后台与服务器交换数据 
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                // readyState == 4说明请求已完成
                if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                    // 从服务器获得数据 
                    // fn.call(this, xhr.responseText);
                    resolve(xhr.responseText);
                }
            };
            xhr.send();
        });
    };
    vcFramework.httpPost = function (url, data, fn) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        // 添加http头，发送信息至服务器时内容编码类型
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
                fn.call(xhr.responseText);
            }
        };
        xhr.send(data);
    };
})(window.vcFramework);

/**
 *  vc-cache
 * 
 * 组件缓存
 */
(function (vcFramework) {

    /**
     * 组件缓存
     */
    vcFramework.putComponent = function (_componentName, _component) {
        let _componentCache = vcFramework.vueCache;
        _componentCache[_componentName] = _component;
    };
    /**
     * 组件提取
     */
    vcFramework.getComponent = function (_componentName) {
        let _componentCache = vcFramework.vueCache;
        return _componentCache[_componentName];
    }

})(window.vcFramework);

/***
 * vc- constant 内容
 */


/**
常量
**/
(function (vcFramework) {

    let constant = {
        REQUIRED_MSG: "不能为空",
        GET_CACHE_URL: ["/nav/getUserInfo"]
    }
    vcFramework.constant = constant;
})(window.vcFramework);


/***
 * vc component 0.1 版本代码合并过来-----------------------------------------------------------------------
 * 
 * 
 */

/**
 vc 函数初始化
 add by wuxw
 **/
(function (vcFramework) {
    let DEFAULT_NAMESPACE = "default";
    vcFramework.http = {
        post: function (componentCode, componentMethod, param, options, successCallback, errorCallback) {
            vcFramework.loading('open');
            Vue.http.post('/callComponent/' + componentCode + "/" + componentMethod, param, options)
                .then(function (res) {
                    try {
                        let _header = res.headers.map;
                        //console.log('res', res);
                        if (vcFramework.notNull(_header['location'])) {
                            window.location.href = _header['location'];
                            return;
                        };
                        successCallback(res.bodyText, res);
                    } catch (e) {
                        console.error(e);
                    } finally {
                        vcFramework.loading('close');
                    }
                }, function (res) {
                    try {
                        if (res.status == 401 && res.headers.map["location"]) {
                            let _header = res.headers.map;
                            //console.log('res', res);
                            window.location.href = _header['location'];
                            return;
                        }
                        if (res.status == 404) {
                            window.location.href = '/user.html#/pages/frame/login';
                            return;
                        }
                        errorCallback(res.bodyText, res);
                    } catch (e) {
                        console.error(e);
                    } finally {
                        vcFramework.loading('close');
                    }
                });
        },
        get: function (componentCode, componentMethod, param, successCallback, errorCallback) {
            //加入缓存机制
            let _getPath = '/' + componentCode + '/' + componentMethod;
            if (vcFramework.constant.GET_CACHE_URL.includes(_getPath)) {
                let _cacheData = vcFramework.getData(_getPath);
                //浏览器缓存中能获取到
                if (_cacheData != null && _cacheData != undefined) {
                    successCallback(JSON.stringify(_cacheData), { status: 200 });
                    return;
                }
            }
            vcFramework.loading('open');
            Vue.http.get('/callComponent/' + componentCode + "/" + componentMethod, param)
                .then(function (res) {
                    try {

                        successCallback(res.bodyText, res);
                        if (vcFramework.constant.GET_CACHE_URL.includes(_getPath) && res.status == 200) {
                            vcFramework.saveData(_getPath, JSON.parse(res.bodyText));
                        }
                    } catch (e) {
                        console.error(e);
                    } finally {
                        vcFramework.loading('close');
                    }
                }, function (res) {
                    try {
                        if (res.status == 401 && res.headers.map["location"]) {
                            let _header = res.headers.map;
                            //console.log('res', res);
                            window.location.href = _header['location'];
                            return;

                        }
                        if (res.status == 404) {
                            window.location.href = '/user.html#/pages/frame/login';
                            return;
                        }
                        errorCallback(res.bodyText, res);
                    } catch (e) {
                        console.error(e);
                    } finally {
                        vcFramework.loading('close');
                    }
                });
        },
        apiPost: function (api, param, options, successCallback, errorCallback) {
            let _api = '';

            if (api.indexOf('/') >= 0) {
                _api = '/app' + api;
                Vue.http.headers.common['APP-ID'] = '8000418004';
                Vue.http.headers.common['TRANSACTION-ID'] = vcFramework.uuid();
                Vue.http.headers.common['REQ-TIME'] = vcFramework.getDateYYYYMMDDHHMISS();
                Vue.http.headers.common['SIGN'] = ''; 
            } else {
                _api = '/callComponent/' + api;
            }
            vcFramework.loading('open');
            Vue.http.post(_api, param, options)
                .then(function (res) {
                    try {
                        let _header = res.headers.map;
                        //console.log('res', res);
                        if (vcFramework.notNull(_header['location'])) {
                            window.location.href = _header['location'];
                            return;
                        };
                        successCallback(res.bodyText, res);
                    } catch (e) {
                        console.error(e);
                    } finally {
                        vcFramework.loading('close');
                    }
                }, function (res) {
                    try {
                        if (res.status == 401 && res.headers.map["location"]) {
                            let _header = res.headers.map;
                            //console.log('res', res);
                            window.location.href = _header['location'];
                            return;
                        }
                        if (res.status == 404) {
                            window.location.href = '/user.html#/pages/frame/login';
                            return;
                        }
                        errorCallback(res.bodyText, res);
                    } catch (e) {
                        console.error(e);
                    } finally {
                        vcFramework.loading('close');
                    }
                });
        },
        apiGet: function (api, param, successCallback, errorCallback) {
            //加入缓存机制
            let _getPath = '';
            if (api.indexOf('/') != 0) {
                _getPath = '/' + api;
            }
            if (vcFramework.constant.GET_CACHE_URL.includes(_getPath)) {
                let _cacheData = vcFramework.getData(_getPath);
                //浏览器缓存中能获取到
                if (_cacheData != null && _cacheData != undefined) {
                    successCallback(JSON.stringify(_cacheData), { status: 200 });
                    return;
                }
            }

            let _api = '';

            if (api.indexOf('/') >= 0) {
                _api = '/app' + api;
                Vue.http.headers.common['APP-ID'] = '8000418004';
                Vue.http.headers.common['TRANSACTION-ID'] = vcFramework.uuid();
                Vue.http.headers.common['REQ-TIME'] = vcFramework.getDateYYYYMMDDHHMISS();
                Vue.http.headers.common['SIGN'] = ''; 
            } else {
                _api = '/callComponent/' + api;
            }
            if(vcFramework.hasOwnProperty('loading')){
                vcFramework.loading('open');
            }

            Vue.http.get(_api, param)
                .then(function (res) {
                    try {

                        successCallback(res.bodyText, res);
                        if (vcFramework.constant.GET_CACHE_URL.includes(_getPath) && res.status == 200) {
                            vcFramework.saveData(_getPath, JSON.parse(res.bodyText));
                        }
                    } catch (e) {
                        console.error(e);
                    } finally {
                        if(vcFramework.hasOwnProperty('loading')){
                            vcFramework.loading('close');
                        }
                    }
                }, function (res) {
                    try {
                        if (res.status == 401 && res.headers.map["location"]) {
                            let _header = res.headers.map;
                            //console.log('res', res);
                            window.location.href = _header['location'];
                            return;

                        }
                        if (res.status == 404) {
                            window.location.href = '/user.html#/pages/frame/login';
                            return;
                        }
                        errorCallback(res.bodyText, res);
                    } catch (e) {
                        console.error(e);
                    } finally {
                        vcFramework.loading('close');
                    }
                });
        },
        upload: function (componentCode, componentMethod, param, options, successCallback, errorCallback) {
            vcFramework.loading('open');
            Vue.http.post('/callComponent/upload/' + componentCode + "/" + componentMethod, param, options)
                .then(function (res) {
                    try {
                        successCallback(res.bodyText, res);
                    } catch (e) {
                        console.error(e);
                    } finally {
                        vcFramework.loading('close');
                    }
                }, function (error) {
                    try {
                        errorCallback(error.bodyText, error);
                    } catch (e) {
                        console.error(e);
                    } finally {
                        vcFramework.loading('close');
                    }
                });

        },

    };

    //let vmOptions = vcFramework.vmOptions;
    //继承方法,合并 _vmOptions 的数据到 vmOptions中
    vcFramework.extends = function (_vmOptions) {
        let vmOptions = vcFramework.vmOptions;
        if (typeof _vmOptions !== "object") {
            throw "_vmOptions is not Object";
        }
        //console.log('vmOptions',vmOptions);
        let nameSpace = DEFAULT_NAMESPACE;
        if (_vmOptions.hasOwnProperty("namespace")) {
            nameSpace = _vmOptions.namespace;
            vcFramework.namespace.push({
                namespace: _vmOptions.namespace,
            })
        }

        //处理 data 对象

        if (_vmOptions.hasOwnProperty('data')) {
            for (let dataAttr in _vmOptions.data) {
                if (nameSpace == DEFAULT_NAMESPACE) {
                    vmOptions.data[dataAttr] = _vmOptions.data[dataAttr];
                } else {

                    vmOptions.data[nameSpace + "_" + dataAttr] = _vmOptions.data[dataAttr];

                }
            }
        }
        //处理methods 对象
        if (_vmOptions.hasOwnProperty('methods')) {
            for (let methodAttr in _vmOptions.methods) {
                if (nameSpace == DEFAULT_NAMESPACE) {
                    vmOptions.methods[methodAttr] = _vmOptions.methods[methodAttr];
                } else {

                    vmOptions.methods[nameSpace + "_" + methodAttr] = _vmOptions.methods[methodAttr];
                }
            }
        }
        //处理methods 对象
        if (_vmOptions.hasOwnProperty('watch')) {
            for (let watchAttr in _vmOptions.watch) {
                if (nameSpace == DEFAULT_NAMESPACE) {
                    vmOptions.watch[watchAttr] = _vmOptions.watch[watchAttr];
                } else {

                    vmOptions.watch[nameSpace + "_" + watchAttr] = _vmOptions.watch[watchAttr];
                }
            }
        }
        //处理_initMethod 初始化执行函数
        if (_vmOptions.hasOwnProperty('_initMethod')) {
            vcFramework.initMethod.push(_vmOptions._initMethod);
        }
        //处理_initEvent
        if (_vmOptions.hasOwnProperty('_initEvent')) {
            vcFramework.initEvent.push(_vmOptions._initEvent);
        }

        //处理_initEvent_destroyedMethod
        if (_vmOptions.hasOwnProperty('_destroyedMethod')) {
            vcFramework.destroyedMethod.push(_vmOptions._destroyedMethod);
        }


    };
    //绑定跳转函数
    vcFramework.jumpToPage = function (url) {
        //判断 url 的模板是否 和当前url 模板一个
        console.log('jumpToPage', url);
        if (url.indexOf('#') < 0) {
            window.location.href = url;
            return;
        }

        let _targetUrl = url.substring(0, url.indexOf('#'));

        if (location.pathname != _targetUrl) {
            window.location.href = url;
            return;
        }
        //刷新框架参数
        //refreshVcFramework();
        //修改锚点

        location.hash = url.substring(url.indexOf("#") + 1, url.length);
        //vcFramework.reBuilderVcTree();
    };

    refreshVcFramework = function () {
        $that.$destroy();
        let _vmOptions = {
            el: '#component',
            data: {},
            watch: {},
            methods: {},
            destroyed: function () {
                window.vcFramework.destroyedMethod.forEach(function (eventMethod) {
                    eventMethod();
                });
                //清理所有定时器

                window.vcFramework.timers.forEach(function (timer) {
                    clearInterval(timer);
                });

                _timers = [];
            }

        };
        vcFramework.vmOptions = _vmOptions;
        vcFramework.initMethod = [];
        vcFramework.initEvent = [];
        vcFramework.component = {};
        vcFramework.destroyedMethod = [];
        vcFramework.namespace = [];
    };
    //保存菜单
    vcFramework.setCurrentMenu = function (_menuId) {
        window.localStorage.setItem('hc_menuId', _menuId);
    };
    //获取菜单
    vcFramework.getCurrentMenu = function () {
        return window.localStorage.getItem('hc_menuId');
    };

    //保存用户菜单
    vcFramework.setMenus = function (_menus) {
        window.localStorage.setItem('hc_menus', JSON.stringify(_menus));
    };
    //获取用户菜单
    vcFramework.getMenus = function () {
        return JSON.parse(window.localStorage.getItem('hc_menus'));
    };

    //保存菜单状态
    vcFramework.setMenuState = function (_menuState) {
        window.localStorage.setItem('hc_menu_state', _menuState);
    };
    //获取菜单状态
    vcFramework.getMenuState = function () {
        return window.localStorage.getItem('hc_menu_state');
    };

    //保存用户菜单
    vcFramework.saveData = function (_key, _value) {
        window.localStorage.setItem(_key, JSON.stringify(_value));
    };
    //获取用户菜单
    vcFramework.getData = function (_key) {
        return JSON.parse(window.localStorage.getItem(_key));
    };

    //保存当前小区信息 _communityInfo : {"communityId":"123213","name":"测试小区"}
    vcFramework.setCurrentCommunity = function (_currentCommunityInfo) {
        window.localStorage.setItem('hc_currentCommunityInfo', JSON.stringify(_currentCommunityInfo));
    };

    //获取当前小区信息
    // @return   {"communityId":"123213","name":"测试小区"}
    vcFramework.getCurrentCommunity = function () {
        return JSON.parse(window.localStorage.getItem('hc_currentCommunityInfo'));
    };

    //保存当前小区信息 _communityInfos : [{"communityId":"123213","name":"测试小区"}]
    vcFramework.setCommunitys = function (_communityInfos) {
        window.localStorage.setItem('hc_communityInfos', JSON.stringify(_communityInfos));
    };

    //获取当前小区信息
    // @return   {"communityId":"123213","name":"测试小区"}
    vcFramework.getCommunitys = function () {
        return JSON.parse(window.localStorage.getItem('hc_communityInfos'));
    };

    //删除缓存数据
    vcFramework.clearCacheData = function () {
        window.localStorage.clear();
    };

    //将org 对象的属性值赋值给dst 属性名为一直的属性
    vcFramework.copyObject = function (org, dst) {
        //for(key in Object.getOwnPropertyNames(dst)){
        for (let key in dst) {
            if (org.hasOwnProperty(key)) {
                dst[key] = org[key]
            }
        }
    };
    //扩展 现有的对象 没有的属性扩充上去
    vcFramework.extendObject = function (org, dst) {
        for (let key in dst) {
            if (!org.hasOwnProperty(key)) {
                dst[key] = org[key]
            }
        }
    };
    //获取url参数
    vcFramework.getParam = function (_key) {
        //返回当前 URL 的查询部分（问号 ? 之后的部分）。
        let urlParameters = location.search;
        if (!vcFramework.notNull(urlParameters)) {
            urlParameters = location.hash;

            if (urlParameters.indexOf('?') != -1) {
                urlParameters = urlParameters.substring(urlParameters.indexOf('?'), urlParameters.length);
            }
        }
        //如果该求青中有请求的参数，则获取请求的参数，否则打印提示此请求没有请求的参数
        if (urlParameters.indexOf('?') != -1) {
            //获取请求参数的字符串
            let parameters = decodeURI(urlParameters.substr(1));
            //将请求的参数以&分割中字符串数组
            parameterArray = parameters.split('&');
            //循环遍历，将请求的参数封装到请求参数的对象之中
            for (let i = 0; i < parameterArray.length; i++) {
                if (_key == parameterArray[i].split('=')[0]) {
                    return parameterArray[i].split('=')[1];
                }
            }
        }
        return "";
    };
    //查询url
    vcFramework.getUrl = function () {
        //返回当前 URL 的查询部分（问号 ? 之后的部分）。
        let urlParameters = location.pathname;
        return urlParameters;
    };
    vcFramework.getBack = function () {
        window.location.href = document.referrer;
        window.history.back(-1);
    }
    vcFramework.goBack = function () {
        window.location.href = document.referrer;
        window.history.back(-1);
    }
    //对象转get参数
    vcFramework.objToGetParam = function (obj) {
        let str = [];
        for (let p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    };
    //空判断 true 为非空 false 为空
    vcFramework.notNull = function (_paramObj) {
        if (_paramObj == null || _paramObj == undefined || _paramObj.trim() == '') {
            return false;
        }
        return true;
    };
    vcFramework.isEmpty = function (_paramObj) {
        if (_paramObj == null || _paramObj == undefined) {
            return true;
        }
        return false;
    };
    //设置debug 模式
    vcFramework.setDebug = function (_param) {
        vcFramework.debug = _param;
    };
    //数据共享存放 主要为了组件间传递数据
    vcFramework.put = function (_key, _value) {
        vcFramework.map[_key] = _value;
    };
    //数据共享 获取 主要为了组件间传递数据
    vcFramework.get = function (_key) {
        return vcFramework.map[_key];
    };

    vcFramework.getDict = function (_name, _type, _callFun) {
        let param = {
            params: {
                name: _name,
                type: _type
            }
        };

        //发送get请求
        vcFramework.http.get('core', 'list', param,
            function (json, res) {
                if (res.status == 200) {
                    let _dictInfo = JSON.parse(json);
                    _callFun(_dictInfo);
                    return;
                }
            },
            function (errInfo, error) {
                console.log('请求失败处理');
            });
    }

    vcFramework.getAttrSpec = function (_tableName,_callFun) {
        let param = {
            params: {
                tableName: _tableName,
                page:1,
                row:100
            }
        };

        //发送get请求
        vcFramework.http.apiGet('/attrSpec/queryAttrSpec', param,
            function (json, res) {
                let _attrSpecInfo = JSON.parse(json);

                if (_attrSpecInfo.code == 0) {
                    _callFun(_attrSpecInfo.data);
                    return;
                }
            },
            function (errInfo, error) {
                console.log('请求失败处理');
            });
    }


    vcFramework.getAttrValue = function (_specCd,_callFun) {
        let param = {
            params: {
                specCd: _specCd,
                page:1,
                row:100
            }
        };

        //发送get请求
        vcFramework.http.apiGet('/attrValue/queryAttrValue', param,
            function (json, res) {
                let _attrSpecInfo = JSON.parse(json);

                if (_attrSpecInfo.code == 0) {
                    _callFun(_attrSpecInfo.data);
                    return;
                }
            },
            function (errInfo, error) {
                console.log('请求失败处理');
            });
    }



})(window.vcFramework);

/**
 vc 定时器处理
 **/
(function (w, vcFramework) {

    /**
     创建定时器
     **/
    vcFramework.createTimer = function (func, sec) {
        let _timer = w.setInterval(func, sec);
        vcFramework.timers.push(_timer); //这里将所有的定时器保存起来，页面退出时清理

        return _timer;
    };
    //清理定时器
    vcFramework.clearTimer = function (timer) {
        clearInterval(timer);
    }


})(window, window.vcFramework);

/**
 * vcFramework.toast("");
 时间处理工具类
 **/
(function (vcFramework) {
    function add0(m) {
        return m < 10 ? '0' + m : m
    }

    vcFramework.dateFormat = function (shijianchuo) {
        //shijianchuo是整数，否则要parseInt转换
        let time = new Date(parseInt(shijianchuo));
        let y = time.getFullYear();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        let h = time.getHours();
        let mm = time.getMinutes();
        let s = time.getSeconds();
        return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    }

    vcFramework.dateTimeFormat = function (_time) {

        let y = _time.getFullYear();
        let m = _time.getMonth() + 1;
        let d = _time.getDate();
        let h = _time.getHours();
        let mm = _time.getMinutes();
        let s = _time.getSeconds();
        return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    }

    vcFramework.getDateYYYYMMDDHHMISS = function () {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
      
        if (month < 10) {
          month = '0' + month;
        }
      
        if (day < 10) {
          day = '0' + day;
        }
      
        if (hour < 10) {
          hour = '0' + hour;
        }
      
        if (minute < 10) {
          minute = '0' + minute;
        }
      
        if (second < 10) {
          second = '0' + second;
        }
      
        return year + "" + month + "" + day + "" + hour + "" + minute + "" + second;
      };

})(window.vcFramework);


(function (vcFramework) {

    vcFramework.propTypes = {
        string: "string",//字符串类型
        array: "array",
        object: "object",
        number: "number"
    }

})(window.vcFramework);

/**
 toast
 **/
(function (vcFramework) {
    vcFramework.toast = function Toast(msg, duration) {
        duration = isNaN(duration) ? 3000 : duration;
        let m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 30%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function () {
            let d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function () {
                document.body.removeChild(m)
            }, d * 1000);
        }, duration);
    }
})(window.vcFramework);

/**
 toast
 **/
(function (vcFramework) {
    vcFramework.urlToBase64 = function urlToBase64(_url, _callFun) {
        let imgData;
        let reader = new FileReader();
        getImageBlob(_url, function (blob) {
            reader.readAsDataURL(blob);
        });
        reader.onload = function (e) {
            imgData = e.target.result;
            _callFun(imgData);
        };

        function getImageBlob(_url, cb) {
            let xhr = new XMLHttpRequest();
            xhr.open("get", _url, true);
            xhr.responseType = "blob";
            xhr.onload = function () {
                if (this.status == 200) {
                    if (cb) cb(this.response);
                }
            };
            xhr.send();
        }
    }
})(window.vcFramework);

/***
 * vc component 0.1 版本代码合并过来（end）-----------------------------------------------------------------------
 */
/**
 初始化vue 对象
 @param vc vue component对象
 @param vmOptions Vue参数
 **/
(function (vcFramework) {
    vcFramework.initVue = function () {
        let vmOptions = vcFramework.vmOptions;
        //console.log("vmOptions:", vmOptions);
        vcFramework.vue = new Vue(vmOptions);
        vcFramework.component = vcFramework.vue;
        //方便二次开发
        window.$that = vcFramework.vue;

        //发布vue 创建完成 事件
        document.dispatchEvent(vcFramework.vcFrameworkEvent);
    }
})(window.vcFramework);

/**
 * vcFramwork init 
 * 框架开始初始化
 */
(function (vcFramework) {
    //启动 框架
    vcFramework.builderVcTree();
})(window.vcFramework);


/**
 vc监听事件
 **/
(function (vcFramework) {
    /**
     事件监听
     **/
    vcFramework.on = function () {
        let _namespace = "";
        let _componentName = "";
        let _value = "";
        let _callback = undefined;
        if (arguments.length == 4) {
            _namespace = arguments[0];
            _componentName = arguments[1];
            _value = arguments[2];
            _callback = arguments[3];
        } else if (arguments.length == 3) {
            _componentName = arguments[0];
            _value = arguments[1];
            _callback = arguments[2];
        } else {
            console.error("执行on 异常，vcFramework.on 参数只能是3个 或4个");
            return;
        }
        if (vcFramework.notNull(_namespace)) {
            vcFramework.vue.$on(_namespace + "_" + _componentName + '_' + _value,
                function (param) {
                    if (vcFramework.debug) {
                        console.log("监听ON事件", _namespace, _componentName, _value, param);
                    }
                    _callback(param);
                }
            );
            return;
        }

        vcFramework.vue.$on(_componentName + '_' + _value,
            function (param) {
                if (vcFramework.debug) {
                    console.log("监听ON事件", _componentName, _value, param);
                }
                _callback(param);
            }
        );
    };

    /**
     事件触发
     **/
    vcFramework.emit = function () {
        let _namespace = "";
        let _componentName = "";
        let _value = "";
        let _param = undefined;
        if (arguments.length == 4) {
            _namespace = arguments[0];
            _componentName = arguments[1];
            _value = arguments[2];
            _param = arguments[3];
        } else if (arguments.length == 3) {
            _componentName = arguments[0];
            _value = arguments[1];
            _param = arguments[2];
        } else {
            console.error("执行on 异常，vcFramework.on 参数只能是3个 或4个");
            return;
        }
        if (vcFramework.debug) {
            console.log("监听emit事件", _namespace, _componentName, _value, _param);
        }
        if (vcFramework.notNull(_namespace)) {
            vcFramework.vue.$emit(_namespace + "_" + _componentName + '_' + _value, _param);
            return;
        }
        vcFramework.vue.$emit(_componentName + '_' + _value, _param);
    };

})(window.vcFramework);

/**
 * vue对象 执行初始化方法
 */
(function (vcFramework) {
    vcFramework.initVcComponent = function () {
        vcFramework.initEvent.forEach(function (eventMethod) {
            eventMethod();
        });
        vcFramework.initMethod.forEach(function (callback) {
            callback();
        });
        vcFramework.namespace.forEach(function (_param) {
            vcFramework[_param.namespace] = vcFramework.vue[_param.namespace];
        });
    }
})(window.vcFramework);
/**
 * 锚点变化监听
 */
(function (vcFramework) {

    window.addEventListener("hashchange", function (e) {
        let _componentUrl = location.hash;
        //判断是否为组件页面
        if (!vcFramework.notNull(_componentUrl)) {
            return;
        }
        refreshVcFramework();
        vcFramework.reBuilderVcTree();
    }, false);
})(window.vcFramework);

/**
vc 校验 工具类 -method
(1)、required:true               必输字段
(2)、remote:"remote-valid.jsp"   使用ajax方法调用remote-valid.jsp验证输入值
(3)、email:true                  必须输入正确格式的电子邮件
(4)、url:true                    必须输入正确格式的网址
(5)、date:true                   必须输入正确格式的日期，日期校验ie6出错，慎用
(6)、dateISO:true                必须输入正确格式的日期(ISO)，例如：2009-06-23，1998/01/22 只验证格式，不验证有效性
(7)、number:true                 必须输入合法的数字(负数，小数)
(8)、digits:true                 必须输入整数
(9)、creditcard:true             必须输入合法的信用卡号
(10)、equalTo:"#password"        输入值必须和#password相同
(11)、accept:                    输入拥有合法后缀名的字符串（上传文件的后缀）
(12)、maxlength:5                输入长度最多是5的字符串(汉字算一个字符)
(13)、minlength:10               输入长度最小是10的字符串(汉字算一个字符)
(14)、rangelength:[5,10]         输入长度必须介于 5 和 10 之间的字符串")(汉字算一个字符)
(15)、range:[5,10]               输入值必须介于 5 和 10 之间
(16)、max:5                      输入值不能大于5
(17)、min:10                     输入值不能小于10
**/
(function (vcFramework) {
    let validate = {

        state: true,
        errInfo: '',

        setState: function (_state, _errInfo) {
            this.state = _state;
            if (!this.state) {
                this.errInfo = _errInfo
                throw "校验失败:" + _errInfo;
            }
        },

        /**
            校验手机号
        **/
        phone: function (text) {
            let regPhone = /^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/;
            return regPhone.test(text);
        },
        /**
            校验邮箱
        **/
        email: function (text) {
            let regEmail = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
            return regEmail.test(text);
        },
        /**
         * 必填
         * @param {参数} text
         */
        required: function (text) {
            if (text == undefined || text == null || text == "") {
                return false;
            }

            return true;
        },
        /**
         * 校验长度
         * @param {校验文本} text
         * @param {最小长度} minLength
         * @param {最大长度} maxLength
         */
        maxin: function (text, minLength, maxLength) {
            if (text.length < minLength || text.length > maxLength) {
                return false;
            }

            return true;
        },
        /**
         * 校验长度
         * @param {校验文本} text
         * @param {最大长度} maxLength
         */
        maxLength: function (text, maxLength) {
            if (text.length > maxLength) {
                return false;
            }

            return true;
        },
        /**
         * 校验最小长度
         * @param {校验文本} text
         * @param {最小长度} minLength
         */
        minLength: function (text, minLength) {
            if (text.length < minLength) {
                return false;
            }
            return true;
        },
        /**
         * 全是数字
         * @param {校验文本} text
         */
        num: function (text) {
            if (text == null || text == undefined) {
                return true;
            }
            let regNum = /^[0-9][0-9]*$/;
            return regNum.test(text);
        },
        date: function (str) {
            if (str == null || str == undefined) {
                return true;
            }
            let regDate = /^(\d{4})-(\d{2})-(\d{2})$/;
            return regDate.test(str);
        },
        dateTime: function (str) {
            if (str == null || str == undefined) {
                return true;
            }
            let reDateTime = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
            return reDateTime.test(str);
        },
        /**
            金额校验
        **/
        money: function (text) {
            if (text == null || text == undefined) {
                return true;
            }
            let regMoney = /^\d+\.?\d{0,2}$/;
            return regMoney.test(text);
        },
        idCard: function (num) {
            if (num == null || num == undefined) {
                return true;
            }
            num = num.toUpperCase();
            //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
            if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
                return false;
            }
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            //下面分别分析出生日期和校验位
            let len, re;
            len = num.length;
            if (len == 15) {
                re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
                let arrSplit = num.match(re);

                //检查生日日期是否正确
                let dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
                let bGoodDay;
                bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                if (!bGoodDay) {
                    return false;
                }
                else {
                    //将15位身份证转成18位
                    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                    let arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    let arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                    let nTemp = 0, i;
                    num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
                    for (i = 0; i < 17; i++) {
                        nTemp += num.substr(i, 1) * arrInt[i];
                    }
                    num += arrCh[nTemp % 11];
                    return true;
                }
            }
            if (len == 18) {
                re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
                let arrSplit = num.match(re);

                //检查生日日期是否正确
                let dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
                let bGoodDay;
                bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                if (!bGoodDay) {
                    // alert(dtmBirth.getYear());
                    //  alert(arrSplit[2]);
                    return false;
                }
                else {
                    //检验18位身份证的校验码是否正确。
                    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                    let valnum;
                    let arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    let arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                    let nTemp = 0, i;
                    for (i = 0; i < 17; i++) {
                        nTemp += num.substr(i, 1) * arrInt[i];
                    }
                    valnum = arrCh[nTemp % 11];
                    if (valnum != num.substr(17, 1)) {
                        return false;
                    }
                    return true;
                }
            }
            return false;
        }

    };
    vc.validate = validate;

})(window.vcFramework);

/**
 * 校验 -core
 */
(function (validate) {

    /**
     * 根据配置校验
     *
     * eg:
     * dataObj:
     * {
     *      name:"wuxw",
     *      age:"19",
     *      emailInfo:{
     *          email:"928255095@qq.com"
     *      }
     * }
     *
     * dataConfig:
     * {
     *      "name":[
                    {
                       limit:"required",
                       param:"",
                       errInfo:'用户名为必填'
                    },
                    {
                        limit:"maxin",
                       param:"1,10",
                       errInfo:'用户名必须为1到10个字之间'
                    }]
     * }
     *
     */
    validate.validate = function (dataObj, dataConfig) {

        try {
            // 循环配置（每个字段）
            for (let key in dataConfig) {
                //配置信息
                let tmpDataConfigValue = dataConfig[key];
                //对key进行处理
                let keys = key.split(".");
                console.log("keys :", keys);
                let tmpDataObj = dataObj;
                //根据配置获取 数据值
                keys.forEach(function (tmpKey) {
                    console.log('tmpDataObj:', tmpDataObj);
                    tmpDataObj = tmpDataObj[tmpKey]
                });
                //                for(let tmpKey in keys){
                //                    console.log('tmpDataObj:',tmpDataObj);
                //                    tmpDataObj = tmpDataObj[tmpKey]
                //                }

                tmpDataConfigValue.forEach(function (configObj) {
                    if (configObj.limit == "required") {
                        validate.setState(validate.required(tmpDataObj), configObj.errInfo);
                    }

                    if (configObj.limit == 'phone') {
                        validate.setState(validate.phone(tmpDataObj), configObj.errInfo);
                    }

                    if (configObj.limit == 'email') {
                        validate.setState(validate.email(tmpDataObj), configObj.errInfo);
                    }

                    if (configObj.limit == 'maxin') {
                        let tmpParam = configObj.param.split(",")
                        validate.setState(validate.maxin(tmpDataObj, tmpParam[0], tmpParam[1]), configObj.errInfo);
                    }

                    if (configObj.limit == 'maxLength') {
                        validate.setState(validate.maxLength(tmpDataObj, configObj.param), configObj.errInfo);

                    }

                    if (configObj.limit == 'minLength') {
                        validate.setState(validate.minLength(tmpDataObj, configObj.param), configObj.errInfo);
                        7
                    }

                    if (configObj.limit == 'num') {
                        validate.setState(validate.num(tmpDataObj), configObj.errInfo);
                    }

                    if (configObj.limit == 'date') {
                        validate.setState(validate.date(tmpDataObj), configObj.errInfo);
                    }
                    if (configObj.limit == 'dateTime') {
                        validate.setState(validate.dateTime(tmpDataObj), configObj.errInfo);
                    }

                    if (configObj.limit == 'money') {
                        validate.setState(validate.money(tmpDataObj), configObj.errInfo);
                    }

                    if (configObj.limit == 'idCard') {
                        validate.setState(validate.idCard(tmpDataObj), configObj.errInfo);
                    }
                });

            }
        } catch (error) {
            console.log("数据校验失败", validate.state, validate.errInfo, error);
            return false;
        }

        return true;
    }

})(window.vcFramework.validate);


/**
对 validate 进行二次封装
**/
(function (vcFramework) {
    vcFramework.check = function (dataObj, dataConfig) {
        return vcFramework.validate.validate(dataObj, dataConfig);
    }
})(window.vcFramework);

/**
 * 监听div 大小
 */
(function (vcFramework) {

    vcFramework.eleResize = {
        _handleResize: function (e) {
            let ele = e.target || e.srcElement;
            let trigger = ele.__resizeTrigger__;
            if (trigger) {
                let handlers = trigger.__z_resizeListeners;
                if (handlers) {
                    let size = handlers.length;
                    for (let i = 0; i < size; i++) {
                        let h = handlers[i];
                        let handler = h.handler;
                        let context = h.context;
                        handler.apply(context, [e]);
                    }
                }
            }
        },
        _removeHandler: function (ele, handler, context) {
            let handlers = ele.__z_resizeListeners;
            if (handlers) {
                let size = handlers.length;
                for (let i = 0; i < size; i++) {
                    let h = handlers[i];
                    if (h.handler === handler && h.context === context) {
                        handlers.splice(i, 1);
                        return;
                    }
                }
            }
        },
        _createResizeTrigger: function (ele) {
            let obj = document.createElement('object');
            obj.setAttribute('style',
                'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden;opacity: 0; pointer-events: none; z-index: -1;');
            obj.onload = vcFramework.eleResize._handleObjectLoad;
            obj.type = 'text/html';
            ele.appendChild(obj);
            obj.data = 'about:blank';
            return obj;
        },
        _handleObjectLoad: function (evt) {
            this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
            this.contentDocument.defaultView.addEventListener('resize', vcFramework.eleResize._handleResize);
        }
    };
    if (document.attachEvent) {//ie9-10
        vcFramework.eleResize.on = function (ele, handler, context) {
            let handlers = ele.__z_resizeListeners;
            if (!handlers) {
                handlers = [];
                ele.__z_resizeListeners = handlers;
                ele.__resizeTrigger__ = ele;
                ele.attachEvent('onresize', EleResize._handleResize);
            }
            handlers.push({
                handler: handler,
                context: context
            });
        };
        vcFramework.eleResize.off = function (ele, handler, context) {
            let handlers = ele.__z_resizeListeners;
            if (handlers) {
                EleResize._removeHandler(ele, handler, context);
                if (handlers.length === 0) {
                    ele.detachEvent('onresize', EleResize._handleResize);
                    delete ele.__z_resizeListeners;
                }
            }
        }
    } else {
        vcFramework.eleResize.on = function (ele, handler, context) {
            let handlers = ele.__z_resizeListeners;
            if (!handlers) {
                handlers = [];
                ele.__z_resizeListeners = handlers;

                if (getComputedStyle(ele, null).position === 'static') {
                    ele.style.position = 'relative';
                }
                let obj = vcFramework.eleResize._createResizeTrigger(ele);
                ele.__resizeTrigger__ = obj;
                obj.__resizeElement__ = ele;
            }
            handlers.push({
                handler: handler,
                context: context
            });
        };
        vcFramework.eleResize.off = function (ele, handler, context) {
            let handlers = ele.__z_resizeListeners;
            if (handlers) {
                vcFramework.eleResize._removeHandler(ele, handler, context);
                if (handlers.length === 0) {
                    let trigger = ele.__resizeTrigger__;
                    if (trigger) {
                        trigger.contentDocument.defaultView.removeEventListener('resize', EleResize._handleResize);
                        ele.removeChild(trigger);
                        delete ele.__resizeTrigger__;
                    }
                    delete ele.__z_resizeListeners;
                }
            }
        }
    }
})(window.vcFramework);

//全屏处理 这个后面可以关掉
(function (vcFramework) {
    vcFramework._fix_height = (_targetDiv) => {
        //只要窗口高度发生变化，就会进入这里面，在这里就可以写，回到聊天最底部的逻辑
        let _vcPageHeight = document.getElementsByClassName('vc-page-height')[0];
        //浏览器可见高度
        let _minHeight = document.documentElement.clientHeight;
        let _scollHeight = _targetDiv.scrollHeight;

        if (_scollHeight < _minHeight) {
            _scollHeight = _minHeight
        }
        _vcPageHeight.style.minHeight = _scollHeight + 'px';
        //console.log('是否设置高度', _vcPageHeight.style.minHeight);
    }
})(window.vcFramework);