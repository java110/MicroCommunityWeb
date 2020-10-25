/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            groupBuyManageInfo: {
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
            let batchId = vc.getParam('batchId');
            if(batchId){
                $that.groupBuyManageInfo.conditions.batchId = batchId;
            }
            vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('groupBuyManage', 'listProduct', function (_param) {
                $that.groupBuyManageInfo.componentShow = 'groupBuyManage';
                vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listProducts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listProducts: function (_page, _rows) {

                vc.component.groupBuyManageInfo.conditions.page = _page;
                vc.component.groupBuyManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.groupBuyManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/groupBuy/queryGroupBuy',
                    param,
                    function (json, res) {
                        var _groupBuyManageInfo = JSON.parse(json);
                        vc.component.groupBuyManageInfo.total = _groupBuyManageInfo.total;
                        vc.component.groupBuyManageInfo.records = _groupBuyManageInfo.records;
                        vc.component.groupBuyManageInfo.products = _groupBuyManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.groupBuyManageInfo.records,
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
                if (vc.component.groupBuyManageInfo.moreCondition) {
                    vc.component.groupBuyManageInfo.moreCondition = false;
                } else {
                    vc.component.groupBuyManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
