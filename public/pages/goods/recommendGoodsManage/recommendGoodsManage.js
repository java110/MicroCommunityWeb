/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            recommendGoodsManageInfo: {
                products: [],
                total: 0,
                records: 1,
                moreCondition: false,
                productId: '',
                conditions: {
                    prodName: '',
                    productId: '',
                    barCode: '',
                    labelCd:'8800012001'
                }
            }
        },
        _initMethod: function () {
            vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('recommendGoodsManage', 'listProduct', function (_param) {
                $that.recommendGoodsManageInfo.componentShow = 'recommendGoodsManage';
                vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listProducts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listProducts: function (_page, _rows) {

                vc.component.recommendGoodsManageInfo.conditions.page = _page;
                vc.component.recommendGoodsManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.recommendGoodsManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/product/queryProductLabel',
                    param,
                    function (json, res) {
                        var _recommendGoodsManageInfo = JSON.parse(json);
                        vc.component.recommendGoodsManageInfo.total = _recommendGoodsManageInfo.total;
                        vc.component.recommendGoodsManageInfo.records = _recommendGoodsManageInfo.records;
                        vc.component.recommendGoodsManageInfo.products = _recommendGoodsManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.recommendGoodsManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryProductMethod: function () {
                vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.recommendGoodsManageInfo.moreCondition) {
                    vc.component.recommendGoodsManageInfo.moreCondition = false;
                } else {
                    vc.component.recommendGoodsManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
