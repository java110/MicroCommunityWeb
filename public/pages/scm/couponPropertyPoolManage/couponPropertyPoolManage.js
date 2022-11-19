/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            couponPropertyPoolManageInfo: {
                couponPropertyPools: [],
                total: 0,
                records: 1,
                moreCondition: false,
                cppId: '',
                conditions: {
                    cppId: '',
                    couponName: '',
                    fromType: '',
                    toType: '',
                    communityId:vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listCouponPropertyPools(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('couponPropertyPoolManage', 'listCouponPropertyPool', function (_param) {
                vc.component._listCouponPropertyPools(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listCouponPropertyPools(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listCouponPropertyPools: function (_page, _rows) {

                vc.component.couponPropertyPoolManageInfo.conditions.page = _page;
                vc.component.couponPropertyPoolManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.couponPropertyPoolManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/couponProperty.listCouponPropertyPool',
                    param,
                    function (json, res) {
                        var _couponPropertyPoolManageInfo = JSON.parse(json);
                        vc.component.couponPropertyPoolManageInfo.total = _couponPropertyPoolManageInfo.total;
                        vc.component.couponPropertyPoolManageInfo.records = _couponPropertyPoolManageInfo.records;
                        vc.component.couponPropertyPoolManageInfo.couponPropertyPools = _couponPropertyPoolManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.couponPropertyPoolManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddCouponPropertyPoolModal: function () {
                vc.emit('addCouponPropertyPool', 'openAddCouponPropertyPoolModal', {});
            },
            _openEditCouponPropertyPoolModel: function (_couponPropertyPool) {
                vc.emit('editCouponPropertyPool', 'openEditCouponPropertyPoolModal', _couponPropertyPool);
            },
            _openDeleteCouponPropertyPoolModel: function (_couponPropertyPool) {
                vc.emit('deleteCouponPropertyPool', 'openDeleteCouponPropertyPoolModal', _couponPropertyPool);
            },
            _queryCouponPropertyPoolMethod: function () {
                vc.component._listCouponPropertyPools(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.couponPropertyPoolManageInfo.moreCondition) {
                    vc.component.couponPropertyPoolManageInfo.moreCondition = false;
                } else {
                    vc.component.couponPropertyPoolManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
