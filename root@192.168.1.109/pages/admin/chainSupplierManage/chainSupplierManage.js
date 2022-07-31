/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROW = 10;
    vc.extends({
        data: {
            chainProductInfo: {
                products: [],
                total: 0,
                records: 1,
                moreCondition: false,
                productId: '',
                conditions: {
                    catalogId: '',
                    catalogName: '',
                    state: '',
                    prodName: '',
                    keyword: '',
                    barCode: '',
                    csId: ''
                },
                catalogs: [],
            },
            ssuType:''
        },
        _initMethod: function () {
            //根据 参数查询相应数据
            //vc.component._loadDataByParam();
        },
        _initEvent: function () {
            vc.on('chainSupplierMange', 'switchFloor', function (_param) {
                vc.component.chainProductInfo.conditions.catalogId = "";
                vc.component.chainProductInfo.conditions.csId = _param.csId;

                let _chainSuppliers = $that.chainSupplyInfo.chainSuppliers;
                _chainSuppliers.forEach(item => {
                    if (item.csId == $that.chainProductInfo.conditions.csId) {
                        vc.component.ssuType = item.suType;
                        
                    }
                });   

                console.log(vc.component.ssuType);
                vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROW);
            });

            vc.on('chainSupplierMange', 'switchUnit', function (_param) {
                vc.component.chainProductInfo.conditions.csId = _param.csId;
                vc.component.chainProductInfo.conditions.catalogId = _param.catalogId;
                let _chainSuppliers = $that.chainSupplyInfo.chainSuppliers;
                _chainSuppliers.forEach(item => {
                    if (item.csId == $that.chainProductInfo.conditions.csId) {
                        vc.component.ssuType = item.suType;
                        
                    }
                });   

                console.log(vc.component.ssuType);
                vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROW);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listProducts(_currentPage, DEFAULT_ROW);
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
                        if(_chainProductInfo.code ==404){
                            vc.message("请检查供应链信息是否正确。");
                        }
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
            //查询
            _queryProductMethod: function () {
                vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROW);
            },
            //重置
            _resetProductMethod: function () {
                vc.component.chainProductInfo.conditions.prodName = "";
                vc.component.chainProductInfo.conditions.categoryId = "";
                vc.component.chainProductInfo.conditions.state = "";
                vc.component._listProducts(DEFAULT_PAGE, DEFAULT_ROW);
            },
            _openAddProductModal: function () {
                vc.jumpToPage('/#/pages/admin/addChainProduct?csId='+$that.chainProductInfo.conditions.csId);
            },
            _openEditProductModel: function (_product) {
                vc.jumpToPage('/#/pages/admin/editChainProduct?productId='+_product.productId +'&csId='+_product.csId);
            },
            _openDeleteProductModel: function (_product) {
                vc.emit('deleteChainProduct', 'openDeleteChainProductModal', _product);
            },

            _openChooseFloorMethod: function () {
                vc.emit('searchFloor', 'openSearchFloorModel', {});
            },

            _openAddChainSupplierModal: function () {
                vc.emit('addChainSupplier', 'openAddChainSupplierModal', {});
            },
            _openEditChainSupplierModel: function () {
                if (!$that.chainProductInfo.conditions.csId) {
                    vc.toast('请先选择供应链');
                    return;
                }
                let _chainSuppliers = $that.chainSupplyInfo.chainSuppliers;
                let _chainSupplier ;
                _chainSuppliers.forEach(item => {
                    if (item.csId == $that.chainProductInfo.conditions.csId) {
                        _chainSupplier = item;
                    }
                });
                vc.emit('editChainSupplier', 'openEditChainSupplierModal', _chainSupplier);
            },
            _openDeleteChainSupplierModel: function () {
                if (!$that.chainProductInfo.conditions.csId) {
                    vc.toast('请先选择供应链');
                    return;
                }
                let _chainSuppliers = $that.chainSupplyInfo.chainSuppliers;
                let _chainSupplier ;
                _chainSuppliers.forEach(item => {
                    if (item.csId == $that.chainProductInfo.conditions.csId) {
                        _chainSupplier = item;
                    }
                });    
                vc.emit('deleteChainSupplier', 'openDeleteChainSupplierModal', _chainSupplier);
            },

            _listChainSupplierCatalogs: function (_page, _rows) {
                vc.component.chainSupplierCatalogManageInfo.conditions.page = _page;
                vc.component.chainSupplierCatalogManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.chainSupplierCatalogManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('chainSupplierCatalog.listChainSupplierCatalog',
                    param,
                    function (json, res) {
                        var _chainSupplierCatalogManageInfo = JSON.parse(json);
                        vc.component.chainSupplierCatalogManageInfo.total = _chainSupplierCatalogManageInfo.total;
                        vc.component.chainSupplierCatalogManageInfo.records = _chainSupplierCatalogManageInfo.records;
                        vc.component.chainSupplierCatalogManageInfo.chainSupplierCatalogs = _chainSupplierCatalogManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.chainSupplierCatalogManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddChainSupplierCatalogModal: function () {
                if (!$that.chainProductInfo.conditions.csId) {
                    vc.toast('请先选择供应链');
                    return;
                }
                vc.emit('addChainSupplierCatalog', 'openAddChainSupplierCatalogModal', {csId:$that.chainProductInfo.conditions.csId});
            },
            _openEditChainSupplierCatalogModel: function () {
                if ( !$that.chainProductInfo.conditions.catalogId ) {
                    vc.toast('请先选择供应链类型');
                    return;
                }
                let _chainSuppliers = $that.chainSupplyInfo.chainSuppliers;
                let _chainSupplierCatalog ;
                _chainSuppliers.forEach(item => {
                    if (item.csId == $that.chainProductInfo.conditions.csId) {
                        let  _chainSupplierCatalogs = item.catalogs;
                        _chainSupplierCatalogs.forEach(item1 => {
                            if (item1.catalogId == $that.chainProductInfo.conditions.catalogId) {
                                _chainSupplierCatalog = item1;
                            }
                        });
                    }
                });    
                vc.emit('editChainSupplierCatalog', 'openEditChainSupplierCatalogModal', _chainSupplierCatalog);
            },

            _openDeleteChainSupplierCatalogModel: function () {
                if ( !$that.chainProductInfo.conditions.catalogId) {    
                    vc.toast('请先选择供应链类型');
                    return;
                }
                let _chainSuppliers = $that.chainSupplyInfo.chainSuppliers;
                let _chainSupplierCatalog ;
                _chainSuppliers.forEach(item => {
                    if (item.csId == $that.chainProductInfo.conditions.csId) {
                        let  _chainSupplierCatalogs = item.catalogs;
                        _chainSupplierCatalogs.forEach(item1 => {
                            if (item1.catalogId == $that.chainProductInfo.conditions.catalogId) {
                                _chainSupplierCatalog = item1;
                            }
                        });
                    }
                });    
                vc.emit('deleteChainSupplierCatalog', 'openDeleteChainSupplierCatalogModal', _chainSupplierCatalog);
            },
            _queryChainSupplierCatalogMethod: function () {
                vc.component._listChainSupplierCatalogs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _openViewProductModel: function (_product) {
                vc.emit('viewChainSupplierProduct', 'openAddChainSupplierProductModal', _product);
                
            },
        }
    });
})(window.vc);