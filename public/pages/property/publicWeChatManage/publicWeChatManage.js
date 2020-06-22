/**
 微信公众号
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 1;
    vc.extends({
        data: {
            smallWeChatManageInfo: {
                smallWeChats: [],
                total: 0,
                records: 1,
                moreCondition: false,
                name: '',
                wetConfig: false,
                conditions: {
                    name: '',
                    appId: '',
                    weChatType: '1100'
                }
            }
        },
        _initMethod: function () {
            vc.component._listSmallWeChats(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('smallWeChatManage', 'listSmallWeChat', function (_param) {
                vc.component._listSmallWeChats(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        methods: {
            _listSmallWeChats: function (_page, _rows) {

                vc.component.smallWeChatManageInfo.conditions.page = _page;
                vc.component.smallWeChatManageInfo.conditions.row = _rows;
                vc.component.smallWeChatManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.smallWeChatManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('smallWeChat.listSmallWeChats',
                    param,
                    function (json, res) {
                        var _smallWeChatManageInfo = JSON.parse(json);
                        vc.component.smallWeChatManageInfo.smallWeChats = _smallWeChatManageInfo.smallWeChats;
                        if (_smallWeChatManageInfo.smallWeChats.length > 0) {
                            vc.emit('wechatAttrInfo', 'getWechatAttrInfo', {
                                wechatId:_smallWeChatManageInfo.smallWeChats[0].weChatId
                            });
                        }

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddSmallWeChatModal: function (type) {
                vc.emit('addSmallWeChat', 'openAddSmallWeChatModal', type);
            },
            _openEditSmallWeChatModel: function (_smallWeChat) {
                vc.emit('editSmallWeChat', 'openEditSmallWeChatModal', _smallWeChat);
            },
            _querySmallWeChatMethod: function () {
                vc.component._listSmallWeChats(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _switchWeChatType: function (type) {
                vc.component.smallWeChatManageInfo.conditions.weChatType = type;
                vc.component._listSmallWeChats(DEFAULT_PAGE, DEFAULT_ROWS);
            }


        }
    });
})(window.vc);
