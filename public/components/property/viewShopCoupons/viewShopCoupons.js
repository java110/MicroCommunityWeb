(function(vc) {
    vc.extends({
        data: {
            viewShopCouponsInfo: {
                coupons: [],
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('viewShopCoupons', 'openViewShopCouponsModel', function(_param) {
                $('#viewShopCouponsModel').modal('show');
                vc.component._loadShopCouponsInfo(_param);
            });
        },
        methods: {
            _loadShopCouponsInfo: function(_param) {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        shopId: _param.shopId,
                    }
                };

                //发送get请求
                vc.http.apiGet('/parkingCoupon.listShopParkingCoupon',
                    param,
                    function(json) {
                        let _unitInfo = JSON.parse(json);
                        vc.component.viewShopCouponsInfo.coupons = _unitInfo.data;
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
        }

    });
})(window.vc);