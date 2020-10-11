/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            productManageInfo: {
                products: [],
                total: 0,
                records: 1,
                moreCondition: false,
                productId: '',
                componentShow:'productManage',
                conditions: {
                    prodName: '',
                    keyword: '',
                    barCode: '',
                }
            }
        },
        _initMethod: function () {
            vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('productManage', 'listProduct', function (_param) {
                $that.productManageInfo.componentShow = 'productManage';
                vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listProducts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listProducts: function (_page, _rows) {

                vc.component.productManageInfo.conditions.page = _page;
                vc.component.productManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.productManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/product/queryProduct',
                    param,
                    function (json, res) {
                        var _productManageInfo = JSON.parse(json);
                        vc.component.productManageInfo.total = _productManageInfo.total;
                        vc.component.productManageInfo.records = _productManageInfo.records;
                        vc.component.productManageInfo.products = _productManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.productManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddProductModal: function () {
                //vc.emit('addProduct', 'openAddProductModal', {});
                $that.productManageInfo.componentShow = 'addProduct';
            },
            _openEditProductModel: function (_product) {
                $that.productManageInfo.componentShow = 'editProduct';
                vc.emit('editProduct', 'openEditProductModal', _product);
            },
            _openDeleteProductModel: function (_product) {
                vc.emit('deleteProduct', 'openDeleteProductModal', _product);
            },
            _queryProductMethod: function () {
                vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.productManageInfo.moreCondition) {
                    vc.component.productManageInfo.moreCondition = false;
                } else {
                    vc.component.productManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
