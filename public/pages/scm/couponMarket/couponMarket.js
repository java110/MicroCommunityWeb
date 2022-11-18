(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 15;
    vc.extends({
        data: {
            couponMarketInfo: {
                coupons: [],
                suppliers: [],
                total: 0,
                records: 1,
                url:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.zhimg.com%2Fv2-e262fc8062b7ef085a9f4de51a31f08f_1440w.jpg%3Fsource%3D172ae18b&refer=http%3A%2F%2Fpic1.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1671372327&t=5644f55f337250a4f5af2baae7f34e3e'
            },
        },
        _initMethod: function () {
            

            $that._loadTopSupplier();
            $that._loadCoupons(DEFAULT_PAGE,DEFAULT_ROWS,'');

        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listSupplierCoupons(_currentPage, DEFAULT_ROWS,'');
            });
        },
        methods: {
            _querySupplierCoupon:function(_item){
                $that._loadCoupons(DEFAULT_PAGE,DEFAULT_ROWS,_item.supplierId);
            },
            _doSearch:function(){
                $that._loadCoupons(DEFAULT_PAGE,DEFAULT_ROWS,'');
            },
            _loadTopSupplier: function () {

                let param = {
                    params: {
                        page: 1,
                        row: 5,
                    }
                };

                //发送get请求
                vc.http.apiGet('/supplier.listSupplier',
                    param,
                    function (json, res) {
                        let _supplierManageInfo = JSON.parse(json);
                        vc.component.couponMarketInfo.suppliers = _supplierManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadCoupons: function (_page, _row, _supplierId) {

                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        supplierId: _supplierId
                    }
                };

                //发送get请求
                vc.http.apiGet('/supplierCoupon.listSupplierCoupon',
                    param,
                    function (json, res) {
                        let _supplierCouponInfo = JSON.parse(json);
                        vc.component.couponMarketInfo.total = _supplierCouponInfo.total;
                        vc.component.couponMarketInfo.records = _supplierCouponInfo.records;
                        vc.component.couponMarketInfo.coupons = _supplierCouponInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.couponMarketInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }

        },
    });
})(window.vc);