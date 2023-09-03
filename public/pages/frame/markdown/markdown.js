(function (vc) {
    vc.extends({
        data: {
            markdownInfo: {
                url: '',
                page:'',

            }
        },
        _initMethod: function () {
            $that.markdownInfo.url = vc.getParam('url');
            $that._loadMarkdown();

        },
        _initEvent: function () {

        },
        methods: {
            _loadMarkdown: function () {
                let xmlhttp;
                if (window.XMLHttpRequest) {
                    xmlhttp = new XMLHttpRequest();
                } else {
                    xmlhttp = new ActiveXObject('Microsoft.XMLHttp');
                }
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        let _content = xmlhttp.responseText;
                        $that._dealImgPath(_content);
                       
                    }
                }
                // 向服务器发送请求
                xmlhttp.open('GET', $that.markdownInfo.url, true);
                xmlhttp.send();
            },
            _dealImgPath:function(_content){

                let _currentPath = $that.markdownInfo.url.replace('/docs/readme.md','');

                _content = _content.replaceAll("(img/","("+_currentPath+"/docs/img/");

                $that.markdownInfo.page = marked.parse(_content);
            }
        }
    });
})(window.vc);