(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            editGroupBuyProductInfo: {
                groupId: '',
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

            $that._initEditGroupBuyProduct();
        },
        _initEvent: function () {
            vc.on('editGroupBuyProduct', 'openEditProductModal', function (_product) {
                //加载数据

                vc.copyObject(_product, $that.editGroupBuyProductInfo);

                $that._loadGroupProductInfo(_product);
            });
            vc.on("editGroupBuyProduct", "notifyUploadCarouselFigureImage", function (_param) {
                vc.component.editGroupBuyProductInfo.carouselFigurePhoto = _param;
            });
        },
        methods: {
            editGroupBuyProductValidate() {
                return vc.validate.validate({
                    editGroupBuyProductInfo: vc.component.editGroupBuyProductInfo
                }, {

                    'editGroupBuyProductInfo.groupProdName': [
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
                    'editGroupBuyProductInfo.groupProdDesc': [
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
                    'editGroupBuyProductInfo.productId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品不能为空"
                        }
                    ],
                    'editGroupBuyProductInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "活动状态不能为空"
                        }
                    ],
                    'editGroupBuyProductInfo.sort': [
                        {
                            limit: "num",
                            param: "",
                            errInfo: "排序格式错误"
                        },
                    ],
                    'editGroupBuyProductInfo.userCount': [
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
            updateProductInfo: function () {
                if (!vc.component.editGroupBuyProductValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/groupBuy/updateGroupBuyProduct',
                    JSON.stringify(vc.component.editGroupBuyProductInfo),
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
            clearEditProductInfo: function () {
                vc.component.editGroupBuyProductInfo = {
                    groupId: '',
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
            _closeEditProduct: function () {
                $that.clearEditProductInfo();
                vc.emit('groupBuyProductManage', 'listProduct', {});
            },
            _initEditGroupBuyProduct: function () {
                let $summernote = $('.editSummernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入商品描述',
                    callbacks: {
                        onImageUpload: function (files, editor, $editable) {
                            $that.sendFile($summernote, files);
                        },
                        onChange: function (contents, $editable) {
                            $that.editGroupBuyProductInfo.content = contents;
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
            _loadGroupProductInfo: function (_product) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        groupId: _product.groupId
                    }
                };

                //发送get请求
                vc.http.apiGet('/groupBuy/queryGroupBuyProduct',
                    param,
                    function (json) {
                        let _productInfo = JSON.parse(json);
                        let _product = _productInfo.data[0];

                        $that.editGroupBuyProductInfo.productSpecs = _product.groupBuyProductSpecs;
                        $that.editGroupBuyProductInfo.content = _product.content;
                        $(".editSummernote").summernote('code', _product.content);

                        let _productSpecValues = _product.groupBuyProductSpecs;

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
