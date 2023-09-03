(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            wechatAttrInfo: {
                listWechatAttrs: [],
                attrs: [],
                total: 0,
                records: 1,
                conditions: {
                    name: '',
                    storeTypeCd: '',
                    tel: ''
                },
                wechatServerUrl: '',
                wechatId: '',
                wId:''
            }
        },
        _initMethod: function () {
            //生成微信服务端访问地址
            

        },
        _initEvent: function () {

            vc.on('wechatAttrInfo', 'getWechatAttrInfo', function (_param) {
                $that.wechatAttrInfo.wechatId = _param.wechatId;
                $that.wechatAttrInfo.wId = _param.wId;
                $that.wechatAttrInfo.wechatServerUrl = window.location.protocol
                + "//" + window.location.host
                + '/app/wechat/gateway?java110AppId=992020061452450002&wId='
                + $that.wechatAttrInfo.wId;
                $that._listListWechatAttrs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        methods: {
            _listListWechatAttrs: function (_page, _rows) {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        wechatId: $that.wechatAttrInfo.wechatId
                    }
                };
                //发送get请求
                vc.http.apiGet('smallWechat.listSmallWechatAttrs',
                    param,
                    function (json, res) {
                        var _listWechatAttrManageInfo = JSON.parse(json);
                        vc.component.wechatAttrInfo.attrs = _listWechatAttrManageInfo.data;
                        
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openEditWechatAttrModel:function(_wechatAttr){
                vc.emit('editWechatAttr','openEditWechatAttrModal',_wechatAttr);
            }
        }
    });
})(window.vc);
