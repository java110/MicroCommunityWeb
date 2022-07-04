/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            mainCategoryProductManageInfo: {
                mainCategoryProducts: [],
                total: 0,
                records: 1,
                moreCondition: false,
                mcProductId: '',
                mainCategorys: [],
                conditions: {
                    mainCategoryId: '',
                    productId: '',
                    categoryName: '',
                    state: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listMainCategoryProducts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('mainCategoryProductManage', 'listMainCategoryProduct', function (_param) {
                vc.component._listMainCategoryProducts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMainCategoryProducts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMainCategoryProducts: function (_page, _rows) {

                vc.component.mainCategoryProductManageInfo.conditions.page = _page;
                vc.component.mainCategoryProductManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.mainCategoryProductManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/productCategory/aggregateSupply',
                    param,
                    function (json, res) {
                        var _mainCategoryProductManageInfo = JSON.parse(json);
                        vc.component.mainCategoryProductManageInfo.total = _mainCategoryProductManageInfo.total;
                        vc.component.mainCategoryProductManageInfo.records = _mainCategoryProductManageInfo.records;
                        vc.component.mainCategoryProductManageInfo.mainCategoryProducts = _mainCategoryProductManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.mainCategoryProductManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMainCategoryProductModal: function () {
                vc.emit('addMainCategoryProduct', 'openAddMainCategoryProductModal', {});
            },
            _openEditMainCategoryProductModel: function (_mainCategoryProduct) {
                vc.emit('addAggregateSupply', 'openAddAggregateSupplyModal', _mainCategoryProduct);
            },
            _openDeleteMainCategoryProductModel: function (_mainCategoryProduct) {
                vc.emit('deleteMainCategoryProduct', 'openDeleteMainCategoryProductModal', _mainCategoryProduct);
            },
            _queryMainCategoryProductMethod: function () {
                vc.component._listMainCategoryProducts(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.mainCategoryProductManageInfo.moreCondition) {
                    vc.component.mainCategoryProductManageInfo.moreCondition = false;
                } else {
                    vc.component.mainCategoryProductManageInfo.moreCondition = true;
                }
            },

        }
    });
})(window.vc);
