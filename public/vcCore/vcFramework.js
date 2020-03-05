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
     * 构建 树
     */
    builderVcTree = async function () {
        let vcElements = document.getElementsByTagName('vc:create');
        var treeList = [];
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

        reader(treeList);
    };

    /**
     * 从当前 HTML中找是否存在 <vc:create name="xxxx"></vc:create> 标签
     */
    findVcLabel = async function (_tree) {
        //查看是否存在子 vc:create 
        var _componentName = _tree.vcCreate.getAttribute('name');
        console.log('_componentName', _componentName, _tree);
        if (!vcFramework.notEmpty(_componentName)) {
            throw '组件未包含name 属性';
        }
        //开始加载组件
        let _componentElement = await loadComponent(_componentName);
        _tree.setHtml(_componentElement);

        console.log('_componentElement>>', _componentElement)

        if (vcFramework.notNull(_componentElement)) {
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



    reader = function (_treeList) {
        console.log('_treeList', _treeList);
        let _header = document.getElementsByTagName('head');
        for (let _treeIndex = 0; _treeIndex < _treeList.length; _treeIndex++) {
            let _tree = _treeList[_treeIndex];
            let _vcCreateEl = document.getElementById(_tree.treeId);
            let _componentHeader = _tree.html.getElementsByTagName('head');
            let _componentBody = _tree.html.getElementsByTagName('body');

            if (_vcCreateEl.hasAttribute("location") && 'head' == _vcCreateEl.getAttribute('location')) {
                _header[0].appendChild(_componentHeader[0]);
            } else if (_vcCreateEl.hasAttribute("location") && 'body' == _vcCreateEl.getAttribute('location')) {
                _vcCreateEl.parentNode.replaceChild(_componentHeader[0].childNodes[0], _vcCreateEl);
            } else {
                _vcCreateEl.parentNode.replaceChild(_componentBody[0].childNodes[0], _vcCreateEl);
            }

        }

        let _scripts = document.body.getElementsByTagName("script");
         for(let i=0;i<_scripts.length;i++){ 
             //一段一段执行script 
             eval(_scripts[i].innerHTML);
        }


    };

    readerSubTree = function (_tree) {

    }

    /**
     * 加载组件
     * 异步去服务端 拉去HTML 和 js
     */
    loadComponent = async function (_componentName) {
        //从缓存查询
        var _cacheComponent = vcFramework.getComponent(_componentName);
        console.log('加载组件名称', _componentName);
        if (vcFramework.notNull(_cacheComponent)) {
            return _cacheComponent;
        }

        var filePath = '/components/' + _componentName + '/' + _componentName;
        var htmlFilePath = filePath + ".html";
        var jsFilePath = filePath + ".js";
        //加载html 页面
        let [_htmlBody, _jsBody] = await Promise.all([vcFramework.httpGet(htmlFilePath), vcFramework.httpGet(jsFilePath)]);

        _jsBody = '<script type="text/javascript">//<![CDATA[\n' + _jsBody + '//]]>\n</script>';
        var parser = new DOMParser();
        console.log('htmlBody', _htmlBody);
        console.log('jsBody', _jsBody);
        var htmlComponentDoc = parser.parseFromString(_htmlBody, 'text/html').documentElement;
        var jsComponentDoc = parser.parseFromString(_jsBody, 'text/html').documentElement;

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
        return vcDiv;
    };

    vcFramework = {
        version: "v0.0.1",
        name: "vcFramework",
        author: '吴学文',
        email: '928255095@qq.com',
        qq: '928255095',
        description: 'vcFramework 是自研的一套组件开发套件',
        componentCache: componentCache,
        builderVcTree: builderVcTree
    };

    window.vcFramework = vcFramework;

})(window);

/**
 * vc-util
 */
(function (vcFramework) {

    //空判断 true 为非空 false 为空
    vcFramework.notNull = function (_paramObj) {
        if (_paramObj == null || _paramObj == undefined) {
            return false;
        }
        return true;
    };

    //空判断 true 为非空 false 为空
    vcFramework.notEmpty = function (_paramObj) {
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