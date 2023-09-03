/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailCouponInfo: {
                coupons: [],
                ownerId: '',
                link: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerDetailCoupon', 'switch', function (_data) {
                $that.ownerDetailCouponInfo.ownerId = _data.ownerId;
                $that.ownerDetailCouponInfo.link = _data.link;
                $that._loadOwnerDetailCouponData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailCoupon', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadOwnerDetailCouponData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadOwnerDetailCouponData: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        tel: $that.ownerDetailCouponInfo.link,
                    }
                };

                //发送get请求
                vc.http.apiGet('/couponProperty.listCouponPropertyUser',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.ownerDetailCouponInfo.coupons = _roomInfo.data;
                        vc.emit('ownerDetailCoupon', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyOwnerDetailCoupon: function () {
                $that._loadOwnerDetailCouponData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);