/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            couponPoolManageInfo: {
                couponPools: [],
                total: 0,
                records: 1,
                moreCondition: false,
                poolId: '',
                conditions: {
                    couponName: '',
                    validityDay: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listCouponPools(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('couponPoolManage', 'listCouponPool', function (_param) {
                vc.component._listCouponPools(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listCouponPools(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listCouponPools: function (_page, _rows) {

                vc.component.couponPoolManageInfo.conditions.page = _page;
                vc.component.couponPoolManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.couponPoolManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('couponPool.listCouponPool',
                    param,
                    function (json, res) {
                        var _couponPoolManageInfo = JSON.parse(json);
                        vc.component.couponPoolManageInfo.total = _couponPoolManageInfo.total;
                        vc.component.couponPoolManageInfo.records = _couponPoolManageInfo.records;
                        vc.component.couponPoolManageInfo.couponPools = _couponPoolManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.couponPoolManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddCouponPoolModal: function () {
                vc.emit('addCouponPool', 'openAddCouponPoolModal', {});
            },
            _openEditCouponPoolModel: function (_couponPool) {
                vc.emit('editCouponPool', 'openEditCouponPoolModal', _couponPool);
            },
            _openDeleteCouponPoolModel: function (_couponPool) {
                vc.emit('deleteCouponPool', 'openDeleteCouponPoolModal', _couponPool);
            },
            _queryCouponPoolMethod: function () {
                vc.component._listCouponPools(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.couponPoolManageInfo.moreCondition) {
                    vc.component.couponPoolManageInfo.moreCondition = false;
                } else {
                    vc.component.couponPoolManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
