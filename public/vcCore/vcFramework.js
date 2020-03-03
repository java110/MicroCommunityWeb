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
(function(){

    var vcFramework = window.vcFramework ||{};
    var componentCache={};

    /**
     * 从当前 HTML中找是否存在 <vc:create name="xxxx"></vc:create> 标签
     */
    findVcLabel = function(_currentElement){
        //查看是否存在子 vc:create 
        var _componentName = _currentElement.getAttribute('name');

        if(!vcFramework.notNull(_componentName)){
            throw '组件未包含name 属性';
        }
        //开始加载组件
        loadComponent(_componentName,function(_componentElement){
            parseHtml(_componentElement);
        });


    };

    createElement = function(_html){

    };

    reader = function(){

    };

    _initComponent = function(){
        var vcElements = document.getElementsByTagName('vc:create');
        for(var _vcElementIndex = 0; _vcElementIndex < vcElements.length; _vcElementIndex ++){
            var _vcElement = vcElements[_vcElementIndex];
            findVcLabel(_vcElement);
        }

    };

    parseHtml= function(_childElement){
        var vcChildElements = _childElement.getElementsByTagName('vc:create');

        //vcChildElements.forEach(function(_childElement){
        for(var _vcChildIndex = 0; _vcChildIndex < vcChildElements.length; _vcChildIndex ++){
            var _childElement = vcChildElements[_vcChildIndex];
            var _newChildElement = findVcLabel(_childElement);
            var _parentElement = _childElement.parentNode;
            _parentElement.replaceChild(_childElement,_newChildElement);
        }
    };
    /**
     * 加载组件
     * 异步去服务端 拉去HTML 和 js
     */
    loadComponent = function(_componentName,callBack){

        //从缓存查询
        var _cacheComponent = vcFramework.getComponent(_componentName);

        if(vcFramework.notNull(_cacheComponent)){
            callBack(_cacheComponent);
            return ;
        }

        var filePath = '/components/'+_componentName+'/'+_componentName;
        var htmlFilePath = filePath + ".html";
        var jsFilePath = filePath + ".js";
        //加载html 页面
        var _htmlBody = "";
        var _jsBody = "";
        vcFramework.httpGet(htmlFilePath,function(_hBody){
            _htmlBody = _hBody;
            vcFramework.httpGet(jsFilePath,function(_jBody){
                _jsBody = '<script type="text/javascript">//<![CDATA[\n' + _jBody +'//]]>\n</script>';
                var parser = new DOMParser();
                var htmlComponentDoc = parser.parseFromString(_htmlBody, 'text/html').documentElement;
                var jsComponentDoc = parser.parseFromString(_jsBody, 'text/html').documentElement;

                var _htmlComponentAttr= document.createAttribute('data-component');
                _htmlComponentAttr.value = _componentName;
                htmlComponentDoc.setAttributeNode(_htmlComponentAttr);
                var _jsComponentAttr= document.createAttribute('data-component');
                _jsComponentAttr.value = _componentName;
                jsComponentDoc.setAttributeNode(_jsComponentAttr);
                //创建div
                var vcDiv = document.createElement('div'); 
                var _divComponentAttr= document.createAttribute('data-component');
                _divComponentAttr.value = _componentName;
                vcDiv.setAttributeNode(_divComponentAttr);
                vcDiv.appendChild(htmlComponentDoc);
                vcDiv.appendChild(jsComponentDoc);
                vcFramework.putComponent(_componentName,vcDiv);
                callBack(vcDiv);
            });
        });

    };

    vcFramework = {
        version: "v0.0.1",
        name: "vcFramework",
        author: '吴学文',
        email:'928255095@qq.com',
        qq:'928255095',
        description:'vcFramework 是自研的一套组件开发套件',
        componentCache: componentCache,
        initComponent:_initComponent
    };

    window.vcFramework = vcFramework;

})(window);

/**
 * vc-util
 */
(function(vcFramework){

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
(function(vcFramework){

    vcFramework.httpGet=function(url, fn) {
          // XMLHttpRequest对象用于在后台与服务器交换数据   
          var xhr = new XMLHttpRequest();            
          xhr.open('GET', url, true);
          xhr.onreadystatechange = function() {
            // readyState == 4说明请求已完成
            if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) { 
              // 从服务器获得数据 
              fn.call(this, xhr.responseText);
            }
          };
          xhr.send();
        },
    vcFramework.httpPost= function (url, data, fn) {
          var xhr = new XMLHttpRequest();
          xhr.open("POST", url, true);
          // 添加http头，发送信息至服务器时内容编码类型
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
          xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
              fn.call(this, xhr.responseText);
            }
          };
          xhr.send(data);
        }
})(window.vcFramework);

/**
 * vc-cache
 */
(function(vcFramework){

    /**
     * 组件缓存
     */
    vcFramework.putComponent = function(_componentName,_component){
        var _componentCache = vcFramework.componentCache;
        _componentCache[_componentName] = component;
    };
    /**
     * 组件提取
     */
    vcFramework.getComponent = function(_componentName){
        var _componentCache = vcFramework.componentCache;
        return _componentCache[_componentName];
    }

})(window.vcFramework);


/**
 * vcFramwork init 
 * 框架开始初始化
 */
(function(vcFramework){
    //启动 框架
    vcFramework.initComponent();
})(window.vcFramework)