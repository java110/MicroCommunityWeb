(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addGroupBuyProductInfo: {
                productId: '',
                groupProdName: '',
                prodName: '',
                groupProdDesc: '',
                sort: '',
                content: '',
                state: '',
                userCount: '3',
                productSpecs: []
            }
        },
        _initMethod: function () {

            $that._initAddGroupBuyProduct();
        },
        _initEvent: function () {
            vc.on('addGroupBuyProduct', 'openAddProductModal', function () {
                $('#addGroupBuyProductModel').modal('show');
            });
            vc.on('addGroupBuyProduct', 'chooseProduct', function (_product) {
                vc.copyObject(_product, $that.addGroupBuyProductInfo);
                $that.addGroupBuyProductInfo.groupProdDesc = _product.prodDesc;
                $that.addGroupBuyProductInfo.groupProdName = _product.prodName;
                $that._loadProductInfo(_product.productId);
            });
            vc.on("addGroupBuyProduct", "notifyUploadCoverImage", function (_param) {
                if (_param.length > 0) {
                    vc.component.addGroupBuyProductInfo.coverPhoto = _param[0];
                } else {
                    vc.component.addGroupBuyProductInfo.coverPhoto = '';
                }

            });
            vc.on("addGroupBuyProduct", "notifyUploadCarouselFigureImage", function (_param) {
                vc.component.addGroupBuyProductInfo.carouselFigurePhoto = _param;
            });
        },
        methods: {
            addGroupBuyProductValidate() {
                return vc.validate.validate({
                    addGroupBuyProductInfo: vc.component.addGroupBuyProductInfo
                }, {

                    'addGroupBuyProductInfo.groupProdName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "拼团名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "拼团名称不能超过128位"
                        },
                    ],
                    'addGroupBuyProductInfo.groupProdDesc': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "拼团简介不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "拼团简介不能超过256位"
                        },
                    ],
                    'addGroupBuyProductInfo.productId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品不能为空"
                        }
                    ],
                    'addGroupBuyProductInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "活动状态不能为空"
                        }
                    ],
                    'addGroupBuyProductInfo.sort': [
                        {
                            limit: "num",
                            param: "",
                            errInfo: "排序格式错误"
                        },
                    ],
                    'addGroupBuyProductInfo.userCount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "拼团人数不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "拼团人数必须是数字"
                        }
                    ]
                });
            },
            saveProductInfo: function () {
                if (!vc.component.addGroupBuyProductValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/groupBuy/saveGroupBuyProduct',
                    JSON.stringify(vc.component.addGroupBuyProductInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            vc.component.clearAddProductInfo();
                            vc.emit('groupBuyProductManage', 'listProduct', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);

                    });
            },
            clearAddProductInfo: function () {
                vc.component.addGroupBuyProductInfo = {
                    productId: '',
                    groupProdName: '',
                    prodName: '',
                    groupProdDesc: '',
                    sort: '',
                    content: '',
                    state: '',
                    userCount: '3',
                    productSpecs: []
                };
            },
            _closeAddProduct: function () {
                $that.clearAddProductInfo();
                vc.emit('groupBuyProductManage', 'listProduct', {});
            },
            _initAddGroupBuyProduct: function () {
                let $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入商品描述',
                    callbacks: {
                        onImageUpload: function (files, editor, $editable) {
                            $that.sendFile($summernote, files);
                        },
                        onChange: function (contents, $editable) {
                            $that.addGroupBuyProductInfo.content = contents;
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
            sendFile: function ($summernote, files) {
                console.log('上传图片', files);

                var param = new FormData();
                param.append("uploadFile", files[0]);
                param.append('communityId', vc.getCurrentCommunity().communityId);

                vc.http.upload(
                    'addNoticeView',
                    'uploadImage',
                    param,
                    {
                        emulateJSON: true,
                        //添加请求头
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            var data = JSON.parse(json);
                            //关闭model
                            $summernote.summernote('insertImage', "/callComponent/download/getFile/file?fileId=" + data.fileId + "&communityId=" + vc.getCurrentCommunity().communityId);
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });

            },
            _openChooseProductModal: function () {
                vc.emit('chooseProduct', 'openChooseProductModel', {});
            },
            _loadProductInfo: function (_productId) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        productId: _productId
                    }
                };

                //发送get请求
                vc.http.apiGet('/product/queryProduct',
                    param,
                    function (json) {
                        let _productInfo = JSON.parse(json);
                        let _product = _productInfo.data[0];

                        $that.addGroupBuyProductInfo.productSpecs = _product.productSpecValues;
                        $that.addGroupBuyProductInfo.content = _product.content;
                        $(".summernote").summernote('code', _product.content);

                        let _productSpecValues = _product.productSpecValues;

                        _productSpecValues.forEach(item => {
                            let _productSpecDetails = item.productSpecDetails;
                            let _specValue = '';
                            _productSpecDetails.forEach(detail => {
                                _specValue += (detail.detailValue + "/");
                            });

                            item.specValue = _specValue;
                        });


                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },

        }
    });

})(window.vc);
