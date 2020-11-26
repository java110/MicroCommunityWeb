/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 20;
    vc.extends({
        data: {
            payFeeDiscountInfo: {
                feeDiscounts: [],
                feeId: '',
                cycles: 1
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('payFeeDiscount', 'computeFeeDiscount', function (_param) {
                vc.copyObject(_param, $that.payFeeDiscountInfo);
                vc.component._listFeeDiscounts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        methods: {
            _listFeeDiscounts: function (_page, _rows) {

                vc.component.payFeeDiscountInfo.conditions.page = _page;
                vc.component.payFeeDiscountInfo.conditions.row = _rows;
                let param = {
                    params: {
                        page: DEFAULT_PAGE,
                        row: DEFAULT_ROWS,
                        feeId: $that.payFeeDiscountInfo.feeId,
                        communityId: $that.payFeeDiscountInfo.communityId,
                        cycles: $that.payFeeDiscountInfo.cycles
                    }
                };

                //发送get请求
                vc.http.apiGet('/feeDiscount/queryFeeDiscount',
                    param,
                    function (json, res) {
                        let _payFeeDiscountInfo = JSON.parse(json);
                        $that.payFeeDiscountInfo.feeDiscounts = _payFeeDiscountInfo.data;
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
                if (vc.component.payFeeDiscountInfo.moreCondition) {
                    vc.component.payFeeDiscountInfo.moreCondition = false;
                } else {
                    vc.component.payFeeDiscountInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
