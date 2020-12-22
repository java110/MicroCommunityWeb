/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeDiscountManageInfo: {
                feeDiscounts: [],
                total: 0,
                records: 1,
                moreCondition: false,
                discountId: '',
                conditions: {
                    discountName: '',
                    discountType: '',
                    ruleName: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listFeeDiscounts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('feeDiscountManage', 'listFeeDiscount', function (_param) {
                vc.component._listFeeDiscounts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listFeeDiscounts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listFeeDiscounts: function (_page, _rows) {
                vc.component.feeDiscountManageInfo.conditions.page = _page;
                vc.component.feeDiscountManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.feeDiscountManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/feeDiscount/queryFeeDiscount',
                    param,
                    function (json, res) {
                        var _feeDiscountManageInfo = JSON.parse(json);
                        vc.component.feeDiscountManageInfo.total = _feeDiscountManageInfo.total;
                        vc.component.feeDiscountManageInfo.records = _feeDiscountManageInfo.records;
                        vc.component.feeDiscountManageInfo.feeDiscounts = _feeDiscountManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.feeDiscountManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddFeeDiscountModal: function () {
                vc.emit('addFeeDiscount', 'openAddFeeDiscountModal', {});
            },
            _openEditFeeDiscountModel: function (_feeDiscount) {
                vc.emit('editFeeDiscount', 'openEditFeeDiscountModal', _feeDiscount);
            },
            _openDeleteFeeDiscountModel: function (_feeDiscount) {
                vc.emit('deleteFeeDiscount', 'openDeleteFeeDiscountModal', _feeDiscount);
            },
            _queryFeeDiscountMethod: function () {
                vc.component._listFeeDiscounts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.feeDiscountManageInfo.moreCondition) {
                    vc.component.feeDiscountManageInfo.moreCondition = false;
                } else {
                    vc.component.feeDiscountManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
