(function(vc) {
    vc.extends({
        data: {
            addChainProductInfo: {
                productId: '',
                catalogId: '',
                prodName: '',
                prodDesc: '',
                unitName: '',
                sort: '',
                catalogs: [],
                content: '',
                states: [],
                state: '',
                coverPhoto: '',
                carouselFigurePhoto: [],
                productSpecs: [],
                areaCode: '',
                csId:''
            }
        },
        watch: {
            "addChainProductInfo.productSpecs": {
                deep: true,
                handler: function() {}
            }
        },
        _initMethod: function() {
            vc.getDict('product', "state", function(_data) {
                vc.component.addChainProductInfo.states = _data;
            });
            $that.addChainProductInfo.csId = vc.getParam('csId');
            $that._listAddCatalogs();
            $that._initAddProduct();
        },
        _initEvent: function() {
            vc.on('addProduct', 'openAddProductModal', function() {
                $('#addProductModel').modal('show');
            });
            vc.on("addProduct", "notifyUploadCoverImage", function(_param) {
                if (_param.length > 0) {
                    vc.component.addChainProductInfo.coverPhoto = _param[0];
                } else {
                    vc.component.addChainProductInfo.coverPhoto = '';
                }
            });
            vc.on("addProduct", "notifyUploadCarouselFigureImage", function(_param) {
                vc.component.addChainProductInfo.carouselFigurePhoto = _param;
            });
        },
        methods: {
            addProductValidate() {
                return vc.validate.validate({
                    addChainProductInfo: vc.component.addChainProductInfo
                }, {
                    'addChainProductInfo.catalogId': [{
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
                    'addChainProductInfo.prodName': [{
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
                    'addChainProductInfo.prodDesc': [{
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
                    'addChainProductInfo.unitName': [{
                        limit: "maxLength",
                        param: "32",
                        errInfo: "单位不能超过32位"
                    }, ],
                    'addChainProductInfo.sort': [{
                        limit: "num",
                        param: "",
                        errInfo: "排序格式错误"
                    }, ],
                });
            },
            saveProductInfo: function() {
                let flag = false;
                let _productSpecs = $that.addChainProductInfo.productSpecs;
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
                if (!vc.component.addProductValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                
                vc.http.apiPost(
                    '/chainProduct.saveChainProduct',
                    JSON.stringify(vc.component.addChainProductInfo), {
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
                let _catalogs = $that.addChainProductInfo.catalogs;
                let _csId = $that.addChainProductInfo.csId;
                vc.component.addChainProductInfo = {
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
                    carouselFigurePhoto: [],
                    productSpecs: [],
                    areaCode: '',
                    csId:_csId
                };
            },
            _closeAddProduct: function() {
                vc.goBack();
            },
            _listAddCatalogs: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        csId: $that.addChainProductInfo.csId
                    }
                };
                //发送get请求
                vc.http.apiGet('/chainSupplierCatalog.listChainSupplierCatalog',
                    param,
                    function(json, res) {
                        let _productCategoryManageInfo = JSON.parse(json);
                        $that.addChainProductInfo.catalogs = _productCategoryManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initAddProduct: function() {
                let $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入商品描述',
                    callbacks: {
                        onImageUpload: function(files, editor, $editable) {
                            $that.sendFile($summernote, files);
                        },
                        onChange: function(contents, $editable) {
                            $that.addChainProductInfo.content = contents;
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
                    'addNoticeView',
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
                let _productSpecs = $that.addChainProductInfo.productSpecs;
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
            _doAddDefaultProductSpec: function(_product, _defaultProductSpec) {
                _product.productSpecs.forEach(item => {
                    item.isDefault = "F";
                });
                _defaultProductSpec.isDefault = "T";
                $that.addChainProductInfo.productSpecs = JSON.parse(JSON.stringify(_product.productSpecs));
            },
            _addChainProductSpec:function(){
                let _productSpec = {
                    specName:'',
                    specValue:'',
                    price:'',
                    barCode:''
                };
                $that.addChainProductInfo.productSpecs.push(_productSpec);
                let _productSpecs = $that.addChainProductInfo.productSpecs;
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