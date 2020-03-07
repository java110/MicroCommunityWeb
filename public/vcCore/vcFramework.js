/**
 * vcFramework
 * 
 * @author 吴学文
 * 
 * @version 0.2
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
    var vcFramework = window.vcFramework || {};
    window.vcFramework = vcFramework;
    //为了兼容 0.1版本的vc 框架
    window.vc = vcFramework;
    var _vmOptions = {};
    var _initMethod = [];
    var _initEvent = [];
    var _component = {};
    var _destroyedMethod = [];
    var _timers = [];//定时器
    var _map = [];// 共享数据存储
    var _namespace = [];
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
        version: "v0.0.1",
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

    var componentCache = {};
    /**
     *  树
     * @param {*} _vcCreate  自定义组件
     * @param {*} _html 组件内容
     * @param {*} _nodeLocation  组件位置 1 开始节点 -1 结束节点
     */
    var VcTree = function (_vcCreate, _html, _nodeLocation) {
        var o = new Object();
        o.treeId = vcFramework.uuid();
        o.vcCreate = _vcCreate;
        o.html = _html;
        o.js = "";
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
        o.setLocation = function (_location) {
            o.nodeLocation = _location;
        };
        return o;
    };

    /**
     * 构建 树
     */
    vcFramework.builderVcTree = async function () {
        let vcElements = document.getElementsByTagName('vc:create');
        var treeList = [];
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
     * 从当前 HTML中找是否存在 <vc:create name="xxxx"></vc:create> 标签
     */
    findVcLabel = async function (_tree) {
        //查看是否存在子 vc:create 
        var _componentName = _tree.vcCreate.getAttribute('name');
        console.log('_componentName', _componentName, _tree);
        if (!vcFramework.isNotEmpty(_componentName)) {
            throw '组件未包含name 属性';
        }
        //开始加载组件
        let _componentElement = await loadComponent(_componentName, _tree);
        //_tree.setHtml(_componentElement);

        console.log('_componentElement>>', _componentElement)

        if (vcFramework.isNotNull(_componentElement)) {
            var vcChildElements = _componentElement.getElementsByTagName('vc:create');
            if (vcChildElements.length > 0) {
                var _vcDiv = document.createElement('div');
                for (var _vcChildIndex = 0; _vcChildIndex < vcChildElements.length; _vcChildIndex++) {
                    console.log('vcChildElements', vcChildElements);
                    var _tmpChildElement = vcChildElements[_vcChildIndex];
                    var _subtree = new VcTree(_tmpChildElement, '', 2);
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
        console.log('_treeList', _treeList);
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
                _vcCreateEl.innerHTML = _componentBody[0].innerHTML;
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
            console.log('_head 中 script', _tmpScript.outerHTML)
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

        console.log('_componentScript', _componentScript);
       

        for (let i = 0; i < _componentScript.length; i++) {
            //一段一段执行script 
            eval(_componentScript[i]);
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
        //从缓存查询
        var _cacheComponent = vcFramework.getComponent(_componentName);
        //console.log('加载组件名称', _componentName);
        if (vcFramework.isNotNull(_cacheComponent)) {
            return _cacheComponent;
        }

        var filePath = '/components/' + _componentName + '/' + _componentName;
        var htmlFilePath = filePath + ".html";
        var jsFilePath = filePath + ".js";
        //加载html 页面
        let [_htmlBody, _jsBody] = await Promise.all([vcFramework.httpGet(htmlFilePath), vcFramework.httpGet(jsFilePath)]);

        _tmpJsBody = '<script type="text/javascript">//<![CDATA[\n' + _jsBody + '//]]>\n</script>';
        let parser = new DOMParser();

        //let htmlComponentDoc = parser.parseFromString(_htmlBody + _tmpJsBody, 'text/html').documentElement;
        let htmlComponentDoc = parser.parseFromString(_htmlBody, 'text/html').documentElement;

        //创建div
        var vcDiv = document.createElement('div');
        var _divComponentAttr = document.createAttribute('data-component');
        _divComponentAttr.value = _componentName;
        vcDiv.setAttributeNode(_divComponentAttr);
        vcDiv.appendChild(htmlComponentDoc);
        //vcDiv.appendChild(jsComponentDoc);
        vcFramework.putComponent(_componentName, vcDiv);
        _tree.setHtml(vcDiv);
        _tree.setJs(_jsBody);
        return vcDiv;
    };

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
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
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
            var xhr = new XMLHttpRequest();
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
        var xhr = new XMLHttpRequest();
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
        var _componentCache = vcFramework.vueCache;
        _componentCache[_componentName] = component;
    };
    /**
     * 组件提取
     */
    vcFramework.getComponent = function (_componentName) {
        var _componentCache = vcFramework.vueCache;
        return _componentCache[_componentName];
    }

})(window.vcFramework);

/***
 * vc- constant 内容
 */


 /**
常量
**/
(function(vcFramework){

    var constant = {
        REQUIRED_MSG:"不能为空",
        GET_CACHE_URL:["/nav/getUserInfo"]
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
    var DEFAULT_NAMESPACE = "default";
    vcFramework.http = {
        post: function (componentCode, componentMethod, param, options, successCallback, errorCallback) {
            vcFramework.loading('open');
            Vue.http.post('/callComponent/' + componentCode + "/" + componentMethod, param, options)
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
        get: function (componentCode, componentMethod, param, successCallback, errorCallback) {
            //加入缓存机制
            var _getPath = '/' + componentCode + '/' + componentMethod;
            if (vcFramework.constant.GET_CACHE_URL.includes(_getPath)) {
                var _cacheData = vcFramework.getData(_getPath);
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

    var vmOptions = vcFramework.vmOptions;
    //继承方法,合并 _vmOptions 的数据到 vmOptions中
    vcFramework.extends = function (_vmOptions) {
        if (typeof _vmOptions !== "object") {
            throw "_vmOptions is not Object";
        }
        var nameSpace = DEFAULT_NAMESPACE;
        if (_vmOptions.hasOwnProperty("namespace")) {
            nameSpace = _vmOptions.namespace;
            vcFramework.namespace.push({
                namespace: _vmOptions.namespace,
            })
        }

        //处理 data 对象

        if (_vmOptions.hasOwnProperty('data')) {
            for (var dataAttr in _vmOptions.data) {
                if (nameSpace == DEFAULT_NAMESPACE) {
                    vmOptions.data[dataAttr] = _vmOptions.data[dataAttr];
                } else {

                    vmOptions.data[nameSpace + "_" + dataAttr] = _vmOptions.data[dataAttr];

                }
            }
        }
        //处理methods 对象
        if (_vmOptions.hasOwnProperty('methods')) {
            for (var methodAttr in _vmOptions.methods) {
                if (nameSpace == DEFAULT_NAMESPACE) {
                    vmOptions.methods[methodAttr] = _vmOptions.methods[methodAttr];
                } else {

                    vmOptions.methods[nameSpace + "_" + methodAttr] = _vmOptions.methods[methodAttr];
                }
            }
        }
        //处理methods 对象
        if (_vmOptions.hasOwnProperty('watch')) {
            for (var watchAttr in _vmOptions.watch) {
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
        window.location.href = url;
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
        for (var key in dst) {
            if (org.hasOwnProperty(key)) {
                dst[key] = org[key]
            }
        }
    };
    //扩展 现有的对象 没有的属性扩充上去
    vcFramework.extendObject = function (org, dst) {
        for (var key in dst) {
            if (!org.hasOwnProperty(key)) {
                dst[key] = org[key]
            }
        }
    };
    //获取url参数
    vcFramework.getParam = function (_key) {
        //返回当前 URL 的查询部分（问号 ? 之后的部分）。
        var urlParameters = location.search;
        //如果该求青中有请求的参数，则获取请求的参数，否则打印提示此请求没有请求的参数
        if (urlParameters.indexOf('?') != -1) {
            //获取请求参数的字符串
            var parameters = decodeURI(urlParameters.substr(1));
            //将请求的参数以&分割中字符串数组
            parameterArray = parameters.split('&');
            //循环遍历，将请求的参数封装到请求参数的对象之中
            for (var i = 0; i < parameterArray.length; i++) {
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
        var urlParameters = location.pathname;
        return urlParameters;
    };
    vcFramework.getBack = function () {
        window.location.href = document.referrer;
        window.history.back(-1);
    }
    //对象转get参数
    vcFramework.objToGetParam = function (obj) {
        var str = [];
        for (var p in obj)
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
        var param = {
            params: {
                name: _name,
                type: _type
            }
        };

        //发送get请求
        vcFramework.http.get('core', 'list', param,
            function (json, res) {
                if (res.status == 200) {
                    var _dictInfo = JSON.parse(json);
                    _callFun(_dictInfo);
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
        var _timer = w.setInterval(func, sec);
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
        var time = new Date(parseInt(shijianchuo));
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    }

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
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 30%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function () {
            var d = 0.5;
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
        var imgData;
        var reader = new FileReader();
        getImageBlob(_url, function (blob) {
            reader.readAsDataURL(blob);
        });
        reader.onload = function (e) {
            imgData = e.target.result;
            _callFun(imgData);
        };

        function getImageBlob(_url, cb) {
            var xhr = new XMLHttpRequest();
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
(function (vcFramework,vmOptions) {
    vcFramework.initVue = function () {
        console.log("vmOptions:", vmOptions);
        vcFramework.vue = new Vue(vmOptions);
        vcFramework.component = vcFramework.vue;
        //方便二次开发
        window.$that = vcFramework.vue;
    }
})(window.vcFramework,window.vcFramework.vmOptions);

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
        var _namespace = "";
        var _componentName = "";
        var _value = "";
        var _callback = undefined;
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
        var _namespace = "";
        var _componentName = "";
        var _value = "";
        var _param = undefined;
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