/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffAppAuthManageInfo: {
                staffName: '',
                appType: '',
                stateName: '',
                auId: '',
                openId: '',
            }
        },
        _initMethod: function () {
            vc.component._listStaffAppAuths(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('staffAppAuthManage', 'listStaffAppAuth', function (_param) {
                vc.component._listStaffAppAuths(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        methods: {
            _listStaffAppAuths: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 1
                    }
                };
                //发送get请求
                vc.http.apiGet('/staff/queryStaffAppAuth',
                    param,
                    function (json, res) {
                        let _staffAppAuthManageInfo = JSON.parse(json);
                        vc.copyObject(_staffAppAuthManageInfo.data, $that.staffAppAuthManageInfo);
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddStaffAppAuthModal: function () {
                vc.emit('addStaffAppAuth', 'openAddStaffAppAuthModal', {});
            },
            _queryStaffAppAuthMethod: function () {
                vc.component._listStaffAppAuths(DEFAULT_PAGE, DEFAULT_ROWS);
            }


        }
    });
})(window.vc);
