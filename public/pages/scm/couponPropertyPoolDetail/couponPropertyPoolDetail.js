/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            couponPropertyPoolDetailInfo: {
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

            vc.on('couponPropertyPoolDetail', 'listCouponPropertyPool', function (_param) {
                vc.component._listCouponPropertyPools(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listCouponPropertyPools(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listCouponPropertyPools: function (_page, _rows) {

                vc.component.couponPropertyPoolDetailInfo.conditions.page = _page;
                vc.component.couponPropertyPoolDetailInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.couponPropertyPoolDetailInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/couponProperty.listCouponPropertyPoolDetail',
                    param,
                    function (json, res) {
                        var _couponPropertyPoolDetailInfo = JSON.parse(json);
                        vc.component.couponPropertyPoolDetailInfo.total = _couponPropertyPoolDetailInfo.total;
                        vc.component.couponPropertyPoolDetailInfo.records = _couponPropertyPoolDetailInfo.records;
                        vc.component.couponPropertyPoolDetailInfo.couponPropertyPools = _couponPropertyPoolDetailInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.couponPropertyPoolDetailInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
           
            _queryCouponPropertyPoolMethod: function () {
                vc.component._listCouponPropertyPools(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.couponPropertyPoolDetailInfo.moreCondition) {
                    vc.component.couponPropertyPoolDetailInfo.moreCondition = false;
                } else {
                    vc.component.couponPropertyPoolDetailInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
