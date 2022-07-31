(function (vc) {
    vc.extends({
        data: {
            viewFeeDetailDiscountInfo: {
                feeDetailDiscounts: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('viewFeeDetailDiscount', 'openModel', function (_param) {
                $('#viewFeeDetailDiscountModel').modal('show');
                $that.viewFeeDetailDiscountInfo.feeDetailDiscounts = [];
                vc.component._loadAllFeeDetailDiscountInfo(_param);
            });
        },
        methods: {
            _loadAllFeeDetailDiscountInfo: function (_param) {
                var param = {
                    params: {
                        page: 1,
                        row: 30,
                        communityId: vc.getCurrentCommunity().communityId,
                        detailId: _param.detailId
                    }
                };

                //发送get请求
                vc.http.apiGet('/feeDiscount/queryFeeDetailDiscount',
                    param,
                    function (json) {
                        var _feeDetailDiscountInfo = JSON.parse(json);
                        $that.viewFeeDetailDiscountInfo.feeDetailDiscounts = _feeDetailDiscountInfo.data;
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            }
        }

    });
})(window.vc);
