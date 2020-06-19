/**
 微信公众号
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            smallWeChatManageInfo: {
                smallWeChats: [],
                total: 0,
                records: 1,
                moreCondition: false,
                name: '',
                wetConfig:false,
                conditions: {
                    name: '',
                    appId: '',
                    weChatType:'1100'

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
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listSmallWeChats(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listSmallWeChats: function (_page, _rows) {

                vc.component.smallWeChatManageInfo.conditions.page = _page;
                vc.component.smallWeChatManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.smallWeChatManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('smallWeChat.listSmallWeChats',
                    param,
                    function (json, res) {
                        var _smallWeChatManageInfo = JSON.parse(json);
                        vc.component.smallWeChatManageInfo.total = _smallWeChatManageInfo.total;
                        vc.component.smallWeChatManageInfo.records = _smallWeChatManageInfo.records;
                        vc.component.smallWeChatManageInfo.smallWeChats = _smallWeChatManageInfo.smallWeChats;
                        vc.emit('pagination', 'init', {
                            total: vc.component.smallWeChatManageInfo.records,
                            currentPage: _page
                        });
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
            _openDeleteSmallWeChatModel: function (_smallWeChat) {
                vc.emit('deleteSmallWeChat', 'openDeleteSmallWeChatModal', _smallWeChat);
            },
            _querySmallWeChatMethod: function () {
                vc.component._listSmallWeChats(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _switchWeChatType:function(type){
                console.log(type);
                vc.component.smallWeChatManageInfo.conditions.weChatType = type;
                vc.component._listSmallWeChats(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.smallWeChatManageInfo.moreCondition) {
                    vc.component.smallWeChatManageInfo.moreCondition = false;
                } else {
                    vc.component.smallWeChatManageInfo.moreCondition = true;
                }
            },
            _openWeChatTemplateModel:function (smallWeChat) {
                vc.component.smallWeChatManageInfo.wetConfig = true;
            }


        }
    });
})(window.vc);
