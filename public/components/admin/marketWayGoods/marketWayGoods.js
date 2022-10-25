/**
 入驻小区
 **/
 (function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            marketWayGoodsInfo: {
                marketGoodss: [],
                total: 0,
                records: 1,
                moreCondition: false,
                textId: '',
                conditions: {
                    name: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listMarketGoodss(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('marketWayGoods', 'switch', function (_data) {
                $that._listMarketGoodss(DEFAULT_PAGE, DEFAULT_ROWS);

            });
            vc.on('marketGoodsManage', 'listMarketGoods', function (_data) {
                $that._listMarketGoodss(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('marketWayGoods', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listMarketGoodss(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listMarketGoodss: function (_page, _rows) {

                vc.component.marketWayGoodsInfo.conditions.page = _page;
                vc.component.marketWayGoodsInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.marketWayGoodsInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/marketGoods.listMarketGoods',
                    param,
                    function (json, res) {
                        let _marketWayGoodsInfo = JSON.parse(json);
                        vc.component.marketWayGoodsInfo.total = _marketWayGoodsInfo.total;
                        vc.component.marketWayGoodsInfo.records = _marketWayGoodsInfo.records;
                        vc.component.marketWayGoodsInfo.marketGoodss = _marketWayGoodsInfo.data;
                        vc.emit('marketWayGoods', 'paginationPlus','init',{
                            total:vc.component.marketWayGoodsInfo.records,
                            currentPage:_page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMarketGoodsModal: function () {
                vc.emit('addMarketGoods', 'openAddMarketGoodsModal', {});
            },
            _openEditMarketGoodsModel: function (_marketGoods) {
                vc.emit('editMarketGoods', 'openEditMarketGoodsModal', _marketGoods);
            },
            _openDeleteMarketGoodsModel: function (_marketGoods) {
                vc.emit('deleteMarketGoods', 'openDeleteMarketGoodsModal', _marketGoods);
            },
            _queryMarketGoodsMethod: function () {
                vc.component._listMarketGoodss(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.marketWayGoodsInfo.moreCondition) {
                    vc.component.marketWayGoodsInfo.moreCondition = false;
                } else {
                    vc.component.marketWayGoodsInfo.moreCondition = true;
                }
            },
            _viewMarketWayGoodsImage: function(_url) {
                vc.emit('viewImage', 'showImage', {
                    url: _url
                });
            },
        }
    });
})(window.vc);