/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            integralGiftDetailManageInfo: {
                integralGiftDetails: [],
                total: 0,
                records: 1,
                moreCondition: false,
                detailId: '',
                conditions: {
                    detailId: '',
                    userName: '',
                    tel: '',
                    communityId:vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listIntegralGiftDetails(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('integralGiftDetailManage', 'listIntegralGiftDetail', function (_param) {
                vc.component._listIntegralGiftDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listIntegralGiftDetails(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listIntegralGiftDetails: function (_page, _rows) {

                vc.component.integralGiftDetailManageInfo.conditions.page = _page;
                vc.component.integralGiftDetailManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.integralGiftDetailManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/integral.listIntegralGiftDetail',
                    param,
                    function (json, res) {
                        var _integralGiftDetailManageInfo = JSON.parse(json);
                        vc.component.integralGiftDetailManageInfo.total = _integralGiftDetailManageInfo.total;
                        vc.component.integralGiftDetailManageInfo.records = _integralGiftDetailManageInfo.records;
                        vc.component.integralGiftDetailManageInfo.integralGiftDetails = _integralGiftDetailManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.integralGiftDetailManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddIntegralGiftDetailModal: function () {
                vc.emit('addIntegralGiftDetail', 'openAddIntegralGiftDetailModal', {});
            },
            _openEditIntegralGiftDetailModel: function (_integralGiftDetail) {
                vc.emit('editIntegralGiftDetail', 'openEditIntegralGiftDetailModal', _integralGiftDetail);
            },
            _openDeleteIntegralGiftDetailModel: function (_integralGiftDetail) {
                vc.emit('deleteIntegralGiftDetail', 'openDeleteIntegralGiftDetailModal', _integralGiftDetail);
            },
            _queryIntegralGiftDetailMethod: function () {
                vc.component._listIntegralGiftDetails(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.integralGiftDetailManageInfo.moreCondition) {
                    vc.component.integralGiftDetailManageInfo.moreCondition = false;
                } else {
                    vc.component.integralGiftDetailManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
