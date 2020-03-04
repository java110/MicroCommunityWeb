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
     * 从当前 HTML中找是否存在 <vc:create name="xxxx"></vc:create> 标签
     */
    findVcLabel = function (_currentElement) {
        //查看是否存在子 vc:create 
        return new Promise((resolve, reject) => {
            var _componentName = _currentElement.getAttribute('name');

            if (!vcFramework.notNull(_componentName)) {
                throw '组件未包含name 属性';
            }
            //开始加载组件
            loadComponent(_componentName).then((_componentElement) => {
                console.log('findVcLabel._componentElement',_componentElement);
                parseHtml(_componentElement).then((_tmpVcDiv)=>{
                    if(_tmpVcDiv == null){
                        resolve(_componentElement);
                        return ;
                    }
                    resolve(_tmpVcDiv);
                });
            });
        });
    };

    createElement = function (_html) {

    };

    reader = function () {

    };

     _initComponent =  function () {
        var vcElements = document.getElementsByTagName('vc:create');
        for (var _vcElementIndex = 0; _vcElementIndex < vcElements.length; _vcElementIndex++) {
            let _vcElement = vcElements[_vcElementIndex];
           // var _vcElement = {... vcElements[_vcElementIndex]};
           // findVcLabel(_vcElement);
            //创建div
             findVcLabel(_vcElement).then((_res)=>{
                if(_res != null){
                    var _componentParentElement = _vcElement.parentNode;
                    console.log('_componentParentElement',_componentParentElement,_vcElement,_res);
                    _componentParentElement.replaceChild(_res,_vcElement);
                }
                
            });
        }
    };

    parseHtml = function (_childElement) {
        console.log('parseHtml._componentElement',_childElement);
        let a = 1;
        let tmpChildElement = _childElement
        return new Promise((resolve, reject) => {
            console.log('Promise._componentElement',_childElement,a);
            var vcChildElements = _childElement.getElementsByTagName('vc:create');

            if (vcChildElements.length == 0) {
                resolve(null);
                return;
            }
            //创建div
            var _vcDiv = document.createElement('div');
            for (var _vcChildIndex = 0; _vcChildIndex < vcChildElements.length; _vcChildIndex++) {
                var _tmpChildElement = vcChildElements[_vcChildIndex];
                //var _newChildElement = findVcLabel(_childElement);
                findVcLabel(_tmpChildElement).then((_res)=>{
                    if(_res != null){
                        _vcDiv.appendChild(_res);
                        var _parentElement = _tmpChildElement.parentNode;
                        _parentElement.replaceChild(_res,_tmpChildElement);
                    }
                    
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
            console.log('加载组件名称',_componentName);
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
            .then((_hBody)=>{
                _htmlBody = _hBody;
                vcFramework.httpGet(jsFilePath).then((_thBody)=>{
                    resolve(_thBody);
                });
            }).then((_jBody) => {
                _jsBody = '<script type="text/javascript">//<![CDATA[\n' + _jBody + '//]]>\n</script>';
                var parser = new DOMParser();
                console.log('htmlBody',_htmlBody);
                console.log('jsBody',_jsBody);
                var doc = new ActivexObject ("MSXML2.DOMDocument");
                console.log('123',doc.loadXML(_htmlBody));
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
        initComponent: _initComponent
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
    vcFramework.initComponent();
})(window.vcFramework)