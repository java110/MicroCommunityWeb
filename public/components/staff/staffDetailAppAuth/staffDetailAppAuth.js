/**
 入驻小区
 **/
 (function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffDetailAppAuthInfo: {
                staffId:'',
                staffName: '',
                appType: '',
                stateName: '',
                auId: '',
                openId: '',
                createTime:'',
                openName:''
            }
        },
        _initMethod: function () {
     
        },
        _initEvent: function () {
            vc.on('staffDetailAppAuth', 'switch', function (_data) {
                $that.staffDetailAppAuthInfo.staffId = _data.staffId;
                $that._loadStaffDetailAppAuthData(DEFAULT_PAGE,DEFAULT_ROWS)
            });
           
            vc.on('staffDetailAppAuth', 'notify', function (_data) {
                $that._loadStaffDetailAppAuthData(DEFAULT_PAGE,DEFAULT_ROWS);
            })
        },
        methods: {
            _loadStaffDetailAppAuthData: function (_page, _row) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        staffId:$that.staffDetailAppAuthInfo.staffId
                    }
                };
                //发送get请求
                vc.http.apiGet('/staff/queryStaffAppAuth',
                    param,
                    function (json, res) {
                        let _staffAppAuthManageInfo = JSON.parse(json);
                        vc.copyObject(_staffAppAuthManageInfo.data, $that.staffDetailAppAuthInfo);
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyStaffDetailAppAuth: function () {
                $that._loadStaffDetailAppAuthData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openAddStaffAppAuthModal: function () {
                vc.emit('addStaffAppAuth', 'openAddStaffAppAuthModal', {});
            },
           
        }
    });
})(window.vc);