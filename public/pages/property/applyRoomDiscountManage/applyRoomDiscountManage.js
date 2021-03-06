/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            applyRoomDiscountManageInfo: {
                applyRoomDiscounts: [],
                applyTypes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                ardId: '',
                conditions: {
                    roomName: '',
                    applyType: '',
                    state: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listApplyRoomDiscounts(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listApplyRoomDiscountTypes();
        },
        _initEvent: function () {

            vc.on('applyRoomDiscountManage', 'listApplyRoomDiscount', function (_param) {
                vc.component._listApplyRoomDiscounts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listApplyRoomDiscounts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listApplyRoomDiscounts: function (_page, _rows) {

                vc.component.applyRoomDiscountManageInfo.conditions.page = _page;
                vc.component.applyRoomDiscountManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.applyRoomDiscountManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/applyRoomDiscount/queryApplyRoomDiscount',
                    param,
                    function (json, res) {
                        var _applyRoomDiscountManageInfo = JSON.parse(json);
                        vc.component.applyRoomDiscountManageInfo.total = _applyRoomDiscountManageInfo.total;
                        vc.component.applyRoomDiscountManageInfo.records = _applyRoomDiscountManageInfo.records;
                        vc.component.applyRoomDiscountManageInfo.applyRoomDiscounts = _applyRoomDiscountManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.applyRoomDiscountManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddApplyRoomDiscountModal: function () {
                vc.emit('addApplyRoomDiscount', 'openAddApplyRoomDiscountModal', {});
            },
            _openEditApplyRoomDiscountModel: function (_applyRoomDiscount) {
                vc.emit('editApplyRoomDiscount', 'openEditApplyRoomDiscountModal', _applyRoomDiscount);
            },
            _openDeleteApplyRoomDiscountModel: function (_applyRoomDiscount) {
                vc.emit('deleteApplyRoomDiscount', 'openDeleteApplyRoomDiscountModal', _applyRoomDiscount);
            },
            _queryApplyRoomDiscountMethod: function () {
                vc.component._listApplyRoomDiscounts(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _listApplyRoomDiscountTypes: function (_page, _rows) {

                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/applyRoomDiscount/queryApplyRoomDiscountType',
                    param,
                    function (json, res) {
                        let _applyRoomDiscountTypeManageInfo = JSON.parse(json);
                        vc.component.applyRoomDiscountManageInfo.applyTypes = _applyRoomDiscountTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if (vc.component.applyRoomDiscountManageInfo.moreCondition) {
                    vc.component.applyRoomDiscountManageInfo.moreCondition = false;
                } else {
                    vc.component.applyRoomDiscountManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
