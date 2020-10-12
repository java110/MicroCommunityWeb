(function(vc){
    let DEFAULT_PAGE = 1;
    let DEFAULT_ROW = 10;
    vc.extends({
        data:{
            documentInfo: {
                title: '帮助文档',
                context: '非常抱歉，当前页面未配置文档'
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('document','openDocument',function(_param){
                $('#documentModal').modal('show');
                $that._loadDocument();
            });
        },
        methods:{
            _loadDocument:function () {
                let _componentCode = vc.getComponentCode();
                var param = {
                    params: {
                        page:1,
                        row:1,
                        docCode:_componentCode
                    }
                };

                //发送get请求
                vc.http.apiGet('/sysDocument/querySysDocument',
                    param,
                    function (json, res) {
                        let _sysDocumentManageInfo = JSON.parse(json);
                        let _total = _sysDocumentManageInfo.total;

                        if(_total < 1){
                            return;
                        }
                        vc.component.documentInfo.title = _sysDocumentManageInfo.data[0].docTitle;
                        vc.component.documentInfo.context = _sysDocumentManageInfo.data[0].docContent;   
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }

    });
})(window.vc);