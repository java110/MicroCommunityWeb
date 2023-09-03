/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            supplierCouponBuyInfo: {
                supplierCouponBuys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                buyId: '',
                conditions: {
                    buyId: '',
                    couponId: '',
                    name: '',
                    supplierName: '',
                    storeName: '',
                    objName: '',
                    createUserTel: '',
                    createUserName: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listSupplierCouponBuys(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('supplierCouponBuy', 'listSupplierCouponBuy', function (_param) {
                vc.component._listSupplierCouponBuys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listSupplierCouponBuys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listSupplierCouponBuys: function (_page, _rows) {

                vc.component.supplierCouponBuyInfo.conditions.page = _page;
                vc.component.supplierCouponBuyInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.supplierCouponBuyInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/supplierCoupon.listSupplierCouponBuy',
                    param,
                    function (json, res) {
                        var _supplierCouponBuyInfo = JSON.parse(json);
                        vc.component.supplierCouponBuyInfo.total = _supplierCouponBuyInfo.total;
                        vc.component.supplierCouponBuyInfo.records = _supplierCouponBuyInfo.records;
                        vc.component.supplierCouponBuyInfo.supplierCouponBuys = _supplierCouponBuyInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.supplierCouponBuyInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _querySupplierCouponBuyMethod:function(){
                vc.component._listSupplierCouponBuys(DEFAULT_PAGE, DEFAULT_ROWS);

            },


        }
    });
})(window.vc);
