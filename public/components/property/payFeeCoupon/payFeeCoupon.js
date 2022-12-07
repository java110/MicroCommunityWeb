/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 20;
    vc.extends({
        data: {
            payFeeCouponInfo: {
                feeCoupons: [],
                feeId: '',
                communityId: vc.getCurrentCommunity().communityId,
                cycles: 1,
                endTime:''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('payFeeCoupon', 'computeFeeCoupon', function (_param) {
                vc.copyObject(_param, $that.payFeeCouponInfo);
                if ($that.payFeeCouponInfo.cycles < 0) {
                    return;
                }
                vc.component._listFeeCoupons(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        methods: {
            _listFeeCoupons: function (_page, _rows) {
                let param = {
                    params: {
                        page: DEFAULT_PAGE,
                        row: DEFAULT_ROWS,
                        feeId: $that.payFeeCouponInfo.feeId,
                        communityId: $that.payFeeCouponInfo.communityId,
                        cycles: $that.payFeeCouponInfo.cycles,
                        endTime: $that.payFeeCouponInfo.endTime
                    }
                };
                //发送get请求
                vc.http.apiGet('/coupon.computePayFeeCoupon',
                    param,
                    function (json, res) {
                        let _payFeeCouponInfo = JSON.parse(json);
                        $that.payFeeCouponInfo.feeCoupons = _payFeeCouponInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);
