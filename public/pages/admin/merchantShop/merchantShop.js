/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            merchantShopInfo: {
                shops: [],
                total: 0,
                records: 1,
                storeTypeCd: vc.getData('/nav/getUserInfo').storeTypeCd,
                conditions: {
                    name: '',
                    storeId: '',
                    shopId: ''
                }
            }
        },
        _initMethod: function() {
            $that.merchantShopInfo.conditions.storeId = vc.getParam('storeId');
            vc.component._listShops(DEFAULT_PAGE, DEFAULT_ROWS);

        },
        _initEvent: function() {
            vc.on('merchantShop', 'listShop', function(_param) {
                vc.component._listShops(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on("merchantShop", "merchantShop", "notifyArea", function(_param) {
                vc.component.merchantShopInfo.conditions.cityCode = _param.selectArea;
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listShops(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listShops: function(_page, _rows) {
                vc.component.merchantShopInfo.conditions.page = _page;
                vc.component.merchantShopInfo.conditions.row = _rows;
                var _param = {
                        params: vc.component.merchantShopInfo.conditions
                    }
                    //发送get请求
                vc.http.apiGet('/shop/queryShopsByAdmin',
                    _param,
                    function(json, res) {
                        var _merchantShopInfo = JSON.parse(json);
                        vc.component.merchantShopInfo.total = _merchantShopInfo.total;
                        vc.component.merchantShopInfo.records = _merchantShopInfo.records;
                        vc.component.merchantShopInfo.shops = _merchantShopInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.merchantShopInfo.records,
                            dataCount: vc.component.merchantShopInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMerchantShopModal: function() {
                vc.emit('addMerchantShop', 'openAddMerchantShopModal', {
                    storeId: vc.getParam('storeId')
                });
            },
            _openEditMerchantShopModel: function(_community) {
                _community.storeId = vc.getParam('storeId');
                vc.emit('editMerchantShop', 'openEditMerchantShopModal', _community);
            },
            _openDeleteMerchantShopModel: function(_community) {
                vc.emit('deleteMerchantShop', 'openDeleteMerchantShopModal', _community);
            },
            _openRecallShopModel: function(_community) {
                vc.emit('recallAuditFinishShop', 'openRecallAuditFinishShopModal', _community);
            },
            _queryShopMethod: function() {
                vc.component._listShops(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDeleteShopModel(_community) {
                vc.emit('deleteShop', 'openDeleteShopModal', _community);
            },
        }
    });
})(window.vc);