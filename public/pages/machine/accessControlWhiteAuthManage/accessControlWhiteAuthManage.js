/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            accessControlWhiteAuthManageInfo: {
                accessControlWhiteAuths: [],
                total: 0,
                records: 1,
                moreCondition: false,
                acwaId: '',
                conditions: {
                    acwaId: '',
                    acwId: '',
                    machineId: '',
                    communityId: vc.getCurrentCommunity().communityId,
                }
            }
        },
        _initMethod: function () {
            $that.accessControlWhiteAuthManageInfo.conditions.acwId = vc.getParam('acwId');
            vc.component._listAccessControlWhiteAuths(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('accessControlWhiteAuthManage', 'listAccessControlWhiteAuth', function (_param) {
                vc.component._listAccessControlWhiteAuths(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAccessControlWhiteAuths(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAccessControlWhiteAuths: function (_page, _rows) {

                vc.component.accessControlWhiteAuthManageInfo.conditions.page = _page;
                vc.component.accessControlWhiteAuthManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.accessControlWhiteAuthManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/machine.listAccessControlWhiteAuth',
                    param,
                    function (json, res) {
                        var _accessControlWhiteAuthManageInfo = JSON.parse(json);
                        vc.component.accessControlWhiteAuthManageInfo.total = _accessControlWhiteAuthManageInfo.total;
                        vc.component.accessControlWhiteAuthManageInfo.records = _accessControlWhiteAuthManageInfo.records;
                        vc.component.accessControlWhiteAuthManageInfo.accessControlWhiteAuths = _accessControlWhiteAuthManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.accessControlWhiteAuthManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddAccessControlWhiteAuthModal: function () {
                vc.emit('addAccessControlWhiteAuth', 'openAddAccessControlWhiteAuthModal', {
                    acwId:$that.accessControlWhiteAuthManageInfo.conditions.acwId
                });
            },
            _openDeleteAccessControlWhiteAuthModel: function (_accessControlWhiteAuth) {
                vc.emit('deleteAccessControlWhiteAuth', 'openDeleteAccessControlWhiteAuthModal', _accessControlWhiteAuth);
            },
            _queryAccessControlWhiteAuthMethod: function () {
                vc.component._listAccessControlWhiteAuths(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.accessControlWhiteAuthManageInfo.moreCondition) {
                    vc.component.accessControlWhiteAuthManageInfo.moreCondition = false;
                } else {
                    vc.component.accessControlWhiteAuthManageInfo.moreCondition = true;
                }
            },
            _goBack:function(){
                vc.goBack();
            }


        }
    });
})(window.vc);
