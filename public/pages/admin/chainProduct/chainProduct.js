/**
 入驻小区
 **/
 (function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            chainProductInfo: {
                products: [],
                total: 0,
                records: 1,
                moreCondition: false,
                productId: '',
                conditions: {
                    categoryId: '',
                    state: '',
                    prodName: '',
                    keyword: '',
                    barCode: '',
                    csId:''
                },
                catalogs: [],
            }
        },
        _initMethod: function () {
            $that.chainProductInfo.conditions.csId = vc.getParam('csId');
            vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listProductCategorys();
        },
        _initEvent: function () {
            vc.on('productManage', 'choose', function (_param) {
                $that._doEnterProductStock(_param.productId, _param.valueId);
            });
            vc.on('productManage', 'listProduct', function (_param) {
                $that.chainProductInfo.componentShow = 'productManage';
                vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listProducts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listProducts: function (_page, _rows) {
                vc.component.chainProductInfo.conditions.page = _page;
                vc.component.chainProductInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.chainProductInfo.conditions
                };
                param.params.prodName = param.params.prodName.trim();
                //发送get请求
                vc.http.apiGet('/chainProduct.listChainProduct',
                    param,
                    function (json, res) {
                        var _chainProductInfo = JSON.parse(json);
                        vc.component.chainProductInfo.total = _chainProductInfo.total;
                        vc.component.chainProductInfo.records = _chainProductInfo.records;
                        vc.component.chainProductInfo.products = _chainProductInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.chainProductInfo.records,
                            dataCount: vc.component.chainProductInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listProductCategorys: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        shopId: vc.getCurrentCommunity().shopId
                    }
                };
                //发送get请求
                vc.http.apiGet('/chainSupplierCatalog.listChainSupplierCatalog',
                    param,
                    function (json, res) {
                        let _productCategoryManageInfo = JSON.parse(json);
                        $that.chainProductInfo.catalogs = _productCategoryManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddProductModal: function () {
                vc.jumpToPage('/#/pages/admin/addChainProduct?csId='+$that.chainProductInfo.conditions.csId);
            },
            _openEditProductModel: function (_product) {
                $that.chainProductInfo.componentShow = 'editProduct';
                vc.emit('editProduct', 'openEditProductModal', _product);
            },
            _openDeleteProductModel: function (_product) {
                vc.emit('deleteProduct', 'openDeleteProductModal', _product);
            },
            //查询
            _queryProductMethod: function () {
                vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetProductMethod: function () {
                vc.component.chainProductInfo.conditions.prodName = "";
                vc.component.chainProductInfo.conditions.categoryId = "";
                vc.component.chainProductInfo.conditions.state = "";
                vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
          
            _moreCondition: function () {
                if (vc.component.chainProductInfo.moreCondition) {
                    vc.component.chainProductInfo.moreCondition = false;
                } else {
                    vc.component.chainProductInfo.moreCondition = true;
                }
            },
            _goBack:function(){
                vc.goBack();
            }
        }
    });
})(window.vc);