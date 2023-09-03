(function(vc) {
    vc.extends({
        data: {
            editChainProductInfo: {
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

                productSpecs: [],
                areaCode: '',
                csId: ''
            },
            chainCatalogs: [],
        },
        watch: {
            "editChainProductInfo.productSpecs": {
                deep: true,
                handler: function() {}
            }
        },
        _initMethod: function() {
            vc.getDict('product', "state", function(_data) {
                vc.component.editChainProductInfo.states = _data;
            });
            $that.editChainProductInfo.productId = vc.getParam('productId');
            $that.editChainProductInfo.csId = vc.getParam('csId');
            $that._listEditCatalogs();
            $that._initAddProduct();

            $that._listProducts();

        },
        _initEvent: function() {

            vc.on("editProduct", "notifyUploadCoverImage", function(_param) {
                if (_param.length > 0) {
                    vc.component.editChainProductInfo.coverPhoto = _param[0];
                } else {
                    vc.component.editChainProductInfo.coverPhoto = '';
                }
            });
            vc.on("editProduct", "notifyUploadCarouselFigureImage", function(_param) {
                vc.component.editChainProductInfo.carouselFigurePhotos = _param;
            });


        },
        methods: {
            _listProducts: function() {
                var param = {
                    params: { page: 1, row: 1, productId: $that.editChainProductInfo.productId, csId: vc.getParam('csId') }
                };
                //发送get请求
                vc.http.apiGet('/chainProduct.listChainProduct',
                    param,
                    function(json, res) {
                        var _chainProductInfo = JSON.parse(json);
                        if (_chainProductInfo.code == 404) {
                            vc.message("请检查供应链信息是否正确。");
                        }
                        let product = _chainProductInfo.data[0];
                        vc.copyObject(product, $that.editChainProductInfo);
                        $that.editChainProductInfo.productSpecs = product.chainProductValueDtos;
                        let _photos = [];
                        _photos.push(product.coverPhoto);
                        vc.emit('editProductCover', 'uploadImage', 'notifyPhotos', _photos);
                        vc.emit('editProductCarouselFigure', 'uploadImage', 'notifyPhotos', product.carouselFigurePhotos);

                        $(".editSummernote").summernote('code', product.content);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            editProductValidate() {
                return vc.validate.validate({
                    editChainProductInfo: vc.component.editChainProductInfo
                }, {
                    'editChainProductInfo.catalogId': [{
                            limit: "required",
                            param: "",
                            errInfo: "商品大类不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "商品大类错误"
                        },
                    ],
                    'editChainProductInfo.prodName': [{
                            limit: "required",
                            param: "",
                            errInfo: "商品名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "商品名称不能超过128位"
                        },
                    ],
                    'editChainProductInfo.prodDesc': [{
                            limit: "required",
                            param: "",
                            errInfo: "商品简介不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "商品简介不能超过256位"
                        },
                    ],
                    'editChainProductInfo.unitName': [{
                        limit: "maxLength",
                        param: "32",
                        errInfo: "单位不能超过32位"
                    }, ],
                    'editChainProductInfo.sort': [{
                        limit: "num",
                        param: "",
                        errInfo: "排序格式错误"
                    }, ],
                });
            },
            updateProductInfo: function() {
                let flag = false;
                let _productSpecs = $that.editChainProductInfo.productSpecs;
                for (let i = 0; i < _productSpecs.length; i++) {
                    if (_productSpecs[i].isDefault == "T") {
                        flag = true;
                        break;
                    }
                }
                if (!flag && _productSpecs.length > 0) {
                    vc.toast("未选择默认规格");
                    return;
                }
                vc.component.editChainProductInfo.productSpecs = _productSpecs;
                if (!vc.component.editProductValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/chainProduct.updateChainProduct',
                    JSON.stringify(vc.component.editChainProductInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addProductModel').modal('hide');
                            vc.component.clearAddProductInfo();
                            vc.emit('productManage', 'listProduct', {});
                            vc.toast("添加成功");
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },

            clearAddProductInfo: function() {
                let _catalogs = $that.editChainProductInfo.catalogs;
                let _csId = $that.editChainProductInfo.csId;
                vc.component.editChainProductInfo = {
                    productId: '',
                    catalogId: '',
                    prodName: '',
                    prodDesc: '',
                    unitName: '',
                    sort: '',
                    catalogs: _catalogs,
                    content: '',
                    states: [],
                    state: '',
                    coverPhoto: '',
                    carouselFigurePhotos: [],
                    productSpecs: [],
                    areaCode: '',
                    csId: _csId
                };
            },
            _closeAddProduct: function() {
                vc.goBack();
            },
            _listEditCatalogs: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        csId: $that.editChainProductInfo.csId
                    }
                };
                //发送get请求
                vc.http.apiGet('/chainSupplierCatalog.listChainSupplierCatalog',
                    param,
                    function(json, res) {
                        let _productCategoryManageInfo = JSON.parse(json);
                        $that.chainCatalogs = _productCategoryManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initAddProduct: function() {
                let $summernote = $('.editSummernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入商品描述',
                    callbacks: {
                        onImageUpload: function(files, editor, $editable) {
                            $that.sendFile($summernote, files);
                        },
                        onChange: function(contents, $editable) {
                            $that.editChainProductInfo.content = contents;
                        }
                    },
                    toolbar: [
                        ['style', ['style']],
                        ['font', ['bold', 'italic', 'underline', 'clear']],
                        ['fontname', ['fontname']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['height', ['height']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture']],
                        ['view', ['fullscreen', 'codeview']],
                        ['help', ['help']]
                    ],
                });
            },
            sendFile: function($summernote, files) {
                console.log('上传图片', files);
                var param = new FormData();
                param.append("uploadFile", files[0]);
                param.append('communityId', '123');
                vc.http.upload(
                    'uploadFile',
                    'uploadImage',
                    param, {
                        emulateJSON: true,
                        //添加请求头
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            var data = JSON.parse(json);
                            //关闭model
                            $summernote.summernote('insertImage', data.fileId);
                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _openChooseSpecModal: function() {
                vc.emit('chooseProductSpec', 'openChooseProductSpecModel', {});
            },
            _openAddDeleteProductSpec: function(_productSpec) {
                let _productSpecs = $that.editChainProductInfo.productSpecs;
                let index = _productSpecs.indexOf(_productSpec);
                if (index > -1) {
                    _productSpecs.splice(index, 1);
                }
                let flag = false;
                for (let i = 0; i < _productSpecs.length; i++) {
                    if (_productSpecs[i].isDefault == "T") {
                        flag = true;
                        break;
                    }
                }
                if (!flag && _productSpecs.length > 0) {
                    _productSpecs[0].isDefault = "T"
                }
            },
            _doEditDefaultProductSpec: function(_product, _defaultProductSpec) {
                _product.productSpecs.forEach(item => {
                    item.isDefault = "F";
                });
                _defaultProductSpec.isDefault = "T";
                $that.editChainProductInfo.productSpecs = JSON.parse(JSON.stringify(_product.productSpecs));
            },
            _editChainProductSpec: function() {
                let _productSpec = {
                    specName: '',
                    specValue: '',
                    price: '',
                    barCode: '',
                    isDefault: "F"

                };
                $that.editChainProductInfo.productSpecs.push(_productSpec);
                let _productSpecs = $that.editChainProductInfo.productSpecs;
                let flag = false;
                for (let i = 0; i < _productSpecs.length; i++) {
                    if (_productSpecs[i].isDefault == "T") {
                        flag = true;
                        break;
                    }
                }
                if (!flag && _productSpecs.length > 0) {
                    _productSpecs[0].isDefault = "T"
                }
            }

        }
    });
})(window.vc);