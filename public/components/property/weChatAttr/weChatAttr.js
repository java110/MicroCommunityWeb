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
            }
        },
        _initMethod: function () {
            //生成微信服务端访问地址
            $that.wechatAttrInfo.wechatServerUrl = window.location.protocol
                + "//" + window.location.host
                + '/app/wechat/gateway?java110AppId=992019111758490006&communityId='
                + vc.getCurrentCommunity().communityId;

        },
        _initEvent: function () {

            vc.on('wechatAttrInfo', 'getWechatAttrInfo', function (_param) {
                $that.wechatAttrInfo.wechatId = _param.weChatId;
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
            }


        }
    });
})(window.vc);
