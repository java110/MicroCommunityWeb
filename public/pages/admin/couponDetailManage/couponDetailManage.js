/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            couponDetailManageInfo: {
                couponDetails: [],
                total: 0,
                records: 1,
                moreCondition: false,
                detailId: '',
                conditions: {
                    poolId: '',
                    shopId: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listCouponDetails(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('couponDetailManage', 'listCouponDetail', function (_param) {
                vc.component._listCouponDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listCouponDetails(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listCouponDetails: function (_page, _rows) {

                vc.component.couponDetailManageInfo.conditions.page = _page;
                vc.component.couponDetailManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.couponDetailManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('couponDetail.listCouponDetail',
                    param,
                    function (json, res) {
                        var _couponDetailManageInfo = JSON.parse(json);
                        vc.component.couponDetailManageInfo.total = _couponDetailManageInfo.total;
                        vc.component.couponDetailManageInfo.records = _couponDetailManageInfo.records;
                        vc.component.couponDetailManageInfo.couponDetails = _couponDetailManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.couponDetailManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddCouponDetailModal: function () {
                vc.emit('addCouponDetail', 'openAddCouponDetailModal', {});
            },
            _openEditCouponDetailModel: function (_couponDetail) {
                vc.emit('editCouponDetail', 'openEditCouponDetailModal', _couponDetail);
            },
            _openDeleteCouponDetailModel: function (_couponDetail) {
                vc.emit('deleteCouponDetail', 'openDeleteCouponDetailModal', _couponDetail);
            },
            _queryCouponDetailMethod: function () {
                vc.component._listCouponDetails(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.couponDetailManageInfo.moreCondition) {
                    vc.component.couponDetailManageInfo.moreCondition = false;
                } else {
                    vc.component.couponDetailManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
