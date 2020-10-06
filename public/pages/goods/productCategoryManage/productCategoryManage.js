/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            productCategoryManageInfo: {
                productCategorys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                categoryId: '',
                conditions: {
                    categoryName: '',
                    categoryLevel: '',
                    isShow: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listProductCategorys(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('productCategoryManage', 'listProductCategory', function (_param) {
                vc.component._listProductCategorys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listProductCategorys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listProductCategorys: function (_page, _rows) {

                vc.component.productCategoryManageInfo.conditions.page = _page;
                vc.component.productCategoryManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.productCategoryManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('productCategory.listProductCategorys',
                    param,
                    function (json, res) {
                        var _productCategoryManageInfo = JSON.parse(json);
                        vc.component.productCategoryManageInfo.total = _productCategoryManageInfo.total;
                        vc.component.productCategoryManageInfo.records = _productCategoryManageInfo.records;
                        vc.component.productCategoryManageInfo.productCategorys = _productCategoryManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.productCategoryManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddProductCategoryModal: function () {
                vc.emit('addProductCategory', 'openAddProductCategoryModal', {});
            },
            _openEditProductCategoryModel: function (_productCategory) {
                vc.emit('editProductCategory', 'openEditProductCategoryModal', _productCategory);
            },
            _openDeleteProductCategoryModel: function (_productCategory) {
                vc.emit('deleteProductCategory', 'openDeleteProductCategoryModal', _productCategory);
            },
            _queryProductCategoryMethod: function () {
                vc.component._listProductCategorys(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.productCategoryManageInfo.moreCondition) {
                    vc.component.productCategoryManageInfo.moreCondition = false;
                } else {
                    vc.component.productCategoryManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
