/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            marketGoodsItemManageInfo: {
                marketGoodsItems: [],
                total: 0,
                records: 1,
                moreCondition: false,
                itemId: '',
                conditions: {
                    goodsId: '',
                    prodName: '',
                    shopName: '',

                }
            }
        },
        _initMethod: function () {
            $that.marketGoodsItemManageInfo.conditions.goodsId = vc.getParam('goodsId');
            vc.component._listMarketGoodsItems(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('marketGoodsItemManage', 'listMarketGoodsItem', function (_param) {
                vc.component._listMarketGoodsItems(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMarketGoodsItems(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMarketGoodsItems: function (_page, _rows) {

                vc.component.marketGoodsItemManageInfo.conditions.page = _page;
                vc.component.marketGoodsItemManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.marketGoodsItemManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/marketGoods.listMarketGoodsItem',
                    param,
                    function (json, res) {
                        var _marketGoodsItemManageInfo = JSON.parse(json);
                        vc.component.marketGoodsItemManageInfo.total = _marketGoodsItemManageInfo.total;
                        vc.component.marketGoodsItemManageInfo.records = _marketGoodsItemManageInfo.records;
                        vc.component.marketGoodsItemManageInfo.marketGoodsItems = _marketGoodsItemManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.marketGoodsItemManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMarketGoodsItemModal: function () {
                vc.emit('addMarketGoodsItem', 'openAddMarketGoodsItemModal', {
                    goodsId:$that.marketGoodsItemManageInfo.conditions.goodsId
                });
            },
            _openEditMarketGoodsItemModel: function (_marketGoodsItem) {
                vc.emit('editMarketGoodsItem', 'openEditMarketGoodsItemModal', _marketGoodsItem);
            },
            _openDeleteMarketGoodsItemModel: function (_marketGoodsItem) {
                vc.emit('deleteMarketGoodsItem', 'openDeleteMarketGoodsItemModal', _marketGoodsItem);
            },
            _queryMarketGoodsItemMethod: function () {
                vc.component._listMarketGoodsItems(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.marketGoodsItemManageInfo.moreCondition) {
                    vc.component.marketGoodsItemManageInfo.moreCondition = false;
                } else {
                    vc.component.marketGoodsItemManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
