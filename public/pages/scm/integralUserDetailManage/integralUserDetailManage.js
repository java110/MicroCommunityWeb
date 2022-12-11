/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            integralUserDetailManageInfo: {
                integralUserDetails: [],
                total: 0,
                records: 1,
                moreCondition: false,
                uoId: '',
                conditions: {
                    uoId: '',
                    acctName: '',
                    userName: '',
                    tel: '',
                    communityId:vc.getCurrentCommunity().communityId

                }
            }
        },
        _initMethod: function () {
            vc.component._listIntegralUserDetails(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('integralUserDetailManage', 'listIntegralUserDetail', function (_param) {
                vc.component._listIntegralUserDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listIntegralUserDetails(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listIntegralUserDetails: function (_page, _rows) {

                vc.component.integralUserDetailManageInfo.conditions.page = _page;
                vc.component.integralUserDetailManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.integralUserDetailManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/integral.listIntegralUserDetail',
                    param,
                    function (json, res) {
                        var _integralUserDetailManageInfo = JSON.parse(json);
                        vc.component.integralUserDetailManageInfo.total = _integralUserDetailManageInfo.total;
                        vc.component.integralUserDetailManageInfo.records = _integralUserDetailManageInfo.records;
                        vc.component.integralUserDetailManageInfo.integralUserDetails = _integralUserDetailManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.integralUserDetailManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddIntegralUserDetailModal: function () {
                vc.emit('addIntegralUserDetail', 'openAddIntegralUserDetailModal', {});
            },
            _openEditIntegralUserDetailModel: function (_integralUserDetail) {
                vc.emit('editIntegralUserDetail', 'openEditIntegralUserDetailModal', _integralUserDetail);
            },
            _openDeleteIntegralUserDetailModel: function (_integralUserDetail) {
                vc.emit('deleteIntegralUserDetail', 'openDeleteIntegralUserDetailModal', _integralUserDetail);
            },
            _queryIntegralUserDetailMethod: function () {
                vc.component._listIntegralUserDetails(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.integralUserDetailManageInfo.moreCondition) {
                    vc.component.integralUserDetailManageInfo.moreCondition = false;
                } else {
                    vc.component.integralUserDetailManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
