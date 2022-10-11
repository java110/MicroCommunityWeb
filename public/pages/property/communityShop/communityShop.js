/**
    入驻小区
**/
(function(vc) {
    let DEFAULT_PAGE = 1;
    let DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            communityShopInfo: {
                shops: [],
                total: 0,
                records: 1,
                moreCondition: false,
                couponId: '',
                conditions: {
                    tel: '',
                    shopName: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            vc.component._listCommunityShops(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('communityShop', 'listCommunityShop', function(_param) {
                vc.component._listCommunityShops(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listCommunityShops(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listCommunityShops: function(_page, _rows) {

                vc.component.communityShopInfo.conditions.page = _page;
                vc.component.communityShopInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.communityShopInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/store.listCommunityStoreShop',
                    param,
                    function(json, res) {
                        var _communityShopInfo = JSON.parse(json);
                        vc.component.communityShopInfo.total = _communityShopInfo.total;
                        vc.component.communityShopInfo.records = _communityShopInfo.records;
                        vc.component.communityShopInfo.shops = _communityShopInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.communityShopInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddCommunityShopModal: function() {
                vc.emit('addCommunityShop', 'openAddCommunityShopModal', {});
            },
            _openBuyParkingCouponModel: function(_shop) {
                vc.emit('buyParkingCoupon', 'openBuyParkingCouponModal', _shop);
            },
            _openDeleteCommunityShopModel: function(_parkingCoupon) {
                vc.emit('deleteCommunityShop', 'openDeleteCommunityShopModal', _parkingCoupon);
            },
            _queryCommunityShopMethod: function() {
                vc.component._listCommunityShops(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetStaffPwd: function(_shop) {
                vc.emit('resetStaffPwd', 'openResetStaffPwd', {
                    staffId: _shop.userId
                });
            },
            _viewShopCoupon: function(_shop) {
                vc.emit('viewShopCoupons', 'openViewShopCouponsModel', _shop);
            },
            _moreCondition: function() {
                if (vc.component.communityShopInfo.moreCondition) {
                    vc.component.communityShopInfo.moreCondition = false;
                } else {
                    vc.component.communityShopInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);