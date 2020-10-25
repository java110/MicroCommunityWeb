/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            groupBuyBatchManageInfo: {
                products: [],
                total: 0,
                records: 1,
                moreCondition: false,
                productId: '',
                conditions: {
                    groupProdName: '',
                    keyword: '',
                    barCode: '',
                }
            }
        },
        _initMethod: function () {
            vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('groupBuyBatchManage', 'listProduct', function (_param) {
                $that.groupBuyBatchManageInfo.componentShow = 'groupBuyBatchManage';
                vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listProducts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listProducts: function (_page, _rows) {

                vc.component.groupBuyBatchManageInfo.conditions.page = _page;
                vc.component.groupBuyBatchManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.groupBuyBatchManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/groupBuy/queryGroupBuyBatch',
                    param,
                    function (json, res) {
                        var _groupBuyBatchManageInfo = JSON.parse(json);
                        vc.component.groupBuyBatchManageInfo.total = _groupBuyBatchManageInfo.total;
                        vc.component.groupBuyBatchManageInfo.records = _groupBuyBatchManageInfo.records;
                        vc.component.groupBuyBatchManageInfo.products = _groupBuyBatchManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.groupBuyBatchManageInfo.records,
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
                if (vc.component.groupBuyBatchManageInfo.moreCondition) {
                    vc.component.groupBuyBatchManageInfo.moreCondition = false;
                } else {
                    vc.component.groupBuyBatchManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
