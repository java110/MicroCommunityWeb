/**
 * vcFramework
 * 
 * @author 吴学文
 * 
 * @version 0.0.1
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
(function () {

    var vcFramework = window.vcFramework || {};
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
        o.vcSubTree = [];
        o.nodeLocation = _nodeLocation;
        o.putSubTree = function (_vcSubTree) {
            o.vcSubTree.push(_vcSubTree);
        };
        o.setHtml = function (_html) {
            o.html = _html;
        };
        o.setLocation = function (_location) {
            o.nodeLocation = _location;
        };
        return o;
    };

    /**
     * 从当前 HTML中找是否存在 <vc:create name="xxxx"></vc:create> 标签
     */
    findVcLabel = function (_tree) {
        //查看是否存在子 vc:create 
        return new Promise((resolve, reject) => {
            var _componentName = _tree.vcCreate.getAttribute('name');

            if (!vcFramework.notNull(_componentName)) {
                throw '组件未包含name 属性';
            }
            //开始加载组件
            loadComponent(_componentName)
                .then((_componentElement) => {
                    //设置组件内容
                    _tree.setHtml(_componentElement);
                    return parseHtml(_tree);
                });
        });
    };

    /**
     * 构建 树
     */
    builderVcTree = function () {
        var vcElements = document.getElementsByTagName('vc:create');
        var treeList = [];
        new Promise((resolve, reject) => {
            for (var _vcElementIndex = 0; _vcElementIndex < vcElements.length; _vcElementIndex++) {
                var _tree = new VcTree(vcElements[_vcElementIndex], '', 1);
                treeList.push(_tree);
                //创建div
                findVcLabel(_tree).then((_res) => {
                    resolve(_res);
                });
            }
        }).then((_outTree)=>{
            reader(treeList);
        });
    };

    reader = function (_treeTree) {
        console.log('_treeTree',_treeTree);
    };

    parseHtml = function (_tree) {
        console.log('parseHtml._tree', _tree);

        return new Promise((resolve, reject) => {
            var vcChildElements = _tree.vcCreate.getElementsByTagName('vc:create');

            if (vcChildElements.length == 0) {
                _tree.setLocation(-1);
                resolve(null);
                return;
            }
            //创建div
            var _vcDiv = document.createElement('div');
            for (var _vcChildIndex = 0; _vcChildIndex < vcChildElements.length; _vcChildIndex++) {
                var _tmpChildElement = vcChildElements[_vcChildIndex];
                var _subtree = new VcTree(_tmpChildElement, '', 2);
                _tree.putSubTree(_subtree);
                findVcLabel(_subtree).then((_res) => {
                });

            }

            resolve(_vcDiv);
        });
    };
    /**
     * 加载组件
     * 异步去服务端 拉去HTML 和 js
     */
    loadComponent = function (_componentName) {

        return new Promise((resolve, reject) => {
            //从缓存查询
            var _cacheComponent = vcFramework.getComponent(_componentName);
            console.log('加载组件名称', _componentName);
            if (vcFramework.notNull(_cacheComponent)) {
                resolve(_cacheComponent);
                return;
            }

            var filePath = '/components/' + _componentName + '/' + _componentName;
            var htmlFilePath = filePath + ".html";
            var jsFilePath = filePath + ".js";
            //加载html 页面
            var _htmlBody = "";
            var _jsBody = "";
            vcFramework.httpGet(htmlFilePath)
                .then((_hBody) => {
                    _htmlBody = _hBody;
                    vcFramework.httpGet(jsFilePath).then((_thBody) => {
                        resolve(_thBody);
                    });
                }).then((_jBody) => {
                    _jsBody = '<script type="text/javascript">//<![CDATA[\n' + _jBody + '//]]>\n</script>';
                    var parser = new DOMParser();
                    console.log('htmlBody', _htmlBody);
                    console.log('jsBody', _jsBody);
                    var htmlComponentDoc = parser.parseFromString(_htmlBody, 'application/xhtml+xml').documentElement;
                    var jsComponentDoc = parser.parseFromString(_jsBody, 'application/xhtml+xml').documentElement;

                    var _htmlComponentAttr = document.createAttribute('data-component');
                    _htmlComponentAttr.value = _componentName;
                    htmlComponentDoc.setAttributeNode(_htmlComponentAttr);
                    var _jsComponentAttr = document.createAttribute('data-component');
                    _jsComponentAttr.value = _componentName;
                    jsComponentDoc.setAttributeNode(_jsComponentAttr);
                    //创建div
                    var vcDiv = document.createElement('div');
                    var _divComponentAttr = document.createAttribute('data-component');
                    _divComponentAttr.value = _componentName;
                    vcDiv.setAttributeNode(_divComponentAttr);
                    vcDiv.appendChild(htmlComponentDoc);
                    vcDiv.appendChild(jsComponentDoc);
                    vcFramework.putComponent(_componentName, vcDiv);
                    //callBack(vcDiv);
                    resolve(vcDiv);
                });
        });

    };

    vcFramework = {
        version: "v0.0.1",
        name: "vcFramework",
        author: '吴学文',
        email: '928255095@qq.com',
        qq: '928255095',
        description: 'vcFramework 是自研的一套组件开发套件',
        componentCache: componentCache,
        builderVcTree:builderVcTree
    };

    window.vcFramework = vcFramework;

})(window);

/**
 * vc-util
 */
(function (vcFramework) {

    //空判断 true 为非空 false 为空
    vcFramework.notNull = function (_paramObj) {
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
        // var type = getObjType(obj), //获取类型
        //     temp = obj;
        // if (typeof obj === 'object') {
        //     if (type === 'Array') {
        //         temp = [];
        //         obj.map((item, i) => temp.push(deepClone(item)));
        //     } else if (type === 'Object') {
        //         temp = {};
        //         for (let _name in obj) {
        //             //忽略掉原型链上的属性
        //             if (obj.hasOwnProperty(_name)) {
        //                 temp[_name] = deepClone(obj[_name]);
        //             }
        //         }
        //     }
        // } else {
        //     return temp;
        // }
        // return temp;

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
 * vc-cache
 */
(function (vcFramework) {

    /**
     * 组件缓存
     */
    vcFramework.putComponent = function (_componentName, _component) {
        var _componentCache = vcFramework.componentCache;
        _componentCache[_componentName] = component;
    };
    /**
     * 组件提取
     */
    vcFramework.getComponent = function (_componentName) {
        var _componentCache = vcFramework.componentCache;
        return _componentCache[_componentName];
    }

})(window.vcFramework);


/**
 * vcFramwork init 
 * 框架开始初始化
 */
(function (vcFramework) {
    //启动 框架
    vcFramework.builderVcTree();
})(window.vcFramework)