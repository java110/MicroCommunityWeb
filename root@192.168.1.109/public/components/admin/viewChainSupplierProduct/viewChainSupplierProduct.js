(function (vc, vm) {
    vc.extends({
        data: {
            addChainProductInfo: {
                productId: '',
                catalogId: '',
                prodName: '',
                prodDesc: '',
                unitName: '',
                sort: '',
                content: '',
                states: [],
                state: '',
                coverPhoto: '',
                carouselFigurePhotos: [],
                chainProductValueDtos: [],
                productSpecs: [],
                areaCode: '',
                csId:''
            },
            chainProductDetail:{},
            productComments:[],
            skuId:''
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('viewChainSupplierProduct', 'openAddChainSupplierProductModal', function (_params) {
                vc.component.refreshAddChainSupplierProduct();
                $('#viewChainSupplierProduct').modal('show');
                vc.copyObject(_params, vc.component.addChainProductInfo);
                vc.component.addChainProductInfo.shopId = vc.getCurrentCommunity().shopId;
                vc.component._listProductDetail();
            });
        },
        methods: {
            _listProductDetail: function() {
                var param = {
                    params: {
                        productId:vc.component.addChainProductInfo.productId,
                        page:1,
                        row:50,
                        csId:vc.component.chainProductInfo.conditions.csId
                    }
                };
                //发送get请求
                vc.http.apiGet('chainProduct.queryProductDeatil',
                    param,
                    function(json, res) {
                        var _productDetail = JSON.parse(json);
                        vc.component.chainProductDetail = _productDetail.data;
                        $that._listProductComments();
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listProductComments: function() {
                            var param = {
                                params: {
                                    productId:vc.component.skuId,
                                    page:1,
                                    row:50,
                                    csId:vc.component.chainProductInfo.conditions.csId
                                }
                            };
                            //发送get请求
                            vc.http.apiGet('chainProduct.queryProductComments',
                                param,
                                function(json, res) {
                                    var _comment = JSON.parse(json);
                                    vc.component.productComments = _comment.data;
                                },
                                function(errInfo, error) {
                                    console.log('请求失败处理');
                                }
                            );
                        },

            saveSupplierOrder: function () {
                vc.http.apiPost(
                    'chainInoutOrder.saveChainInoutOrder',
                    JSON.stringify(vc.component.addChainProductInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#viewChainSupplierProduct').modal('hide');
                            vc.component.refreshAddChainSupplierProduct();
                            vc.toast("采购成功");
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshAddChainSupplierProduct: function () {
                vc.component.addChainProductInfo = {
                    productId: '',
                    catalogId: '',
                    prodName: '',
                    prodDesc: '',
                    unitName: '',
                    sort: '',
                    content: '',
                    states: [],
                    state: '',
                    coverPhoto: '',
                    carouselFigurePhotos: [],
                    chainProductValueDtos: [],
                    productSpecs: [],
                    areaCode: '',
                    csId:''
                }
            }
        }
    });
})(window.vc, window.vc.component);
