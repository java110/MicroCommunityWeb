(function (vc) {

    vc.extends({
        data: {
            editProductInfo: {
                productId: '',
                categoryId: '',
                prodName: '',
                prodDesc: '',
                keyword: '',
                barCode: '',
                unitName: '',
                sort: '',
                isPostage: '',
                postage: '0.00',
                productCategorys:[],
                content:'',
                state:'',
                coverPhoto:'',
                carouselFigurePhoto:[],
                productSpecs:[]

            }
        },
        _initMethod: function () {
            $that._listEditProductCategorys();

            $that._initEditProduct();
        },
        _initEvent: function () {
            vc.on('editProduct', 'openEditProductModal', function (_product) {
                //加载产品信息
                $that._listEditProducts(_product);
            });
            vc.on("editProduct", "notifyUploadCoverImage", function (_param) {
                if(_param.length > 0){
                    vc.component.editProductInfo.coverPhoto = _param[0];
                }else{
                    vc.component.editProductInfo.coverPhoto = '';
                }
                
            });
            vc.on("editProduct", "notifyUploadCarouselFigureImage", function (_param) {
                vc.component.editProductInfo.carouselFigurePhoto = _param;
            });

            vc.on("editProduct","chooseProductSpec",function(_productSpec){
                _productSpec.stock = "999";
                _productSpec.sales = "99";
                _productSpec.price = "0.00";
                _productSpec.costPrice = "0.00";
                _productSpec.vipPrice = "0.00";
                _productSpec.otPrice = "0.00";
                $that.editProductInfo.productSpecs.push(_productSpec);
            });
        },
        methods: {
            editProductValidate() {
                return vc.validate.validate({
                    editProductInfo: vc.component.editProductInfo
                }, {
                    'editProductInfo.categoryId': [
                        {
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
                    'editProductInfo.prodName': [
                        {
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
                    'editProductInfo.prodDesc': [
                        {
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
                    'editProductInfo.keyword': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "关键词不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "关键词不能超过256位"
                        },
                    ],
                    'editProductInfo.barCode': [
                        {
                            limit: "maxLength",
                            param: "15",
                            errInfo: "产品条码不能超过15位"
                        },
                    ],
                    'editProductInfo.unitName': [
                        {
                            limit: "maxLength",
                            param: "32",
                            errInfo: "单位不能超过32位"
                        },
                    ],
                    'editProductInfo.sort': [
                        {
                            limit: "num",
                            param: "",
                            errInfo: "排序格式错误"
                        },
                    ],
                    'editProductInfo.isPostage': [
                        {
                            limit: "num",
                            param: "",
                            errInfo: "是否包邮格式错误"
                        },
                    ],
                    'editProductInfo.postage': [
                        {
                            limit: "money",
                            param: "",
                            errInfo: "邮费格式错误,请填写如 3.00"
                        },
                    ],
                });
            },
            _editProductInfo: function () {
                let hasDefault = false;
                vc.component.editProductInfo.productSpecs.forEach(item =>{
                    if(item.isDefault != 'T' && item.isDefault != 'F'){
                        hasDefault = false;
                        return ;
                    }
                    if(item.isDefault == 'T'){
                        hasDefault = true;
                    }
                });

                if(!hasDefault){
                    vc.toast("未选择默认规格");

                    return;
                }
                if (!vc.component.editProductValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }


                vc.http.apiPost(
                    '/product/updateProduct',
                    JSON.stringify(vc.component.editProductInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editProductModel').modal('hide');
                            vc.component.clearEditProductInfo();
                            vc.emit('productManage', 'listProduct', {});

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

                let _productCategorys = $that.editProductInfo.productCategorys;
                vc.component.editProductInfo = {
                    productId: '',
                    categoryId: '',
                    prodName: '',
                    prodDesc: '',
                    keyword: '',
                    barCode: '',
                    unitName: '',
                    sort: '',
                    isPostage: '',
                    postage: '0.00',
                    productCategorys:_productCategorys,
                    content:'',
                    state:'',
                    coverPhoto:'',
                    carouselFigurePhoto:[],
                    productSpecs:[]
                };
            },
            _closeEditProduct: function () {
                $that.clearEditProductInfo();
                vc.emit('productManage', 'listProduct', {});
            },
            _listEditProductCategorys: function (_page, _rows) {
                let param = {
                    params: {
                        page:1,
                        row:50
                    }
                };
                //发送get请求
                vc.http.apiGet('/productCategory/queryProductCategory',
                    param,
                    function (json, res) {
                        let _productCategoryManageInfo = JSON.parse(json);
                        $that.editProductInfo.productCategorys = _productCategoryManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initEditProduct:function(){
                let $summernote = $('.editSummernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入商品描述',
                    callbacks: {
                        onImageUpload: function (files, editor, $editable) {
                            $that.sendEditFile($summernote, files);
                        },
                        onChange: function (contents, $editable) {
                            $that.editProductInfo.content = contents;
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
            sendEditFile: function ($summernote, files) {
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
            _openEditChooseSpecModal:function(){
                vc.emit('chooseProductSpec', 'openChooseProductSpecModel',{});
            },
            _openDeleteProductSpec:function(_productSpec){
                let _productSpecs = $that.editProductInfo.productSpecs;
                let index = _productSpecs.indexOf(_productSpec); 
                if (index > -1) { 
                    _productSpecs.splice(index, 1); 
                }
            },
            _listEditProducts: function (_product) {
                var param = {
                    params: {
                        page:1,
                        row:1,
                        productId:_product.productId
                    }
                };

                //发送get请求
                vc.http.apiGet('/product/queryProduct',
                    param,
                    function (json, res) {
                        var _productManageInfo = JSON.parse(json);
                        let product = _productManageInfo.data[0];
                       vc.copyObject(product,$that.editProductInfo);

                       let _photos = [];
                       _photos.push(product.coverPhoto);
                       vc.emit('editProductCover','uploadImage', 'notifyPhotos',_photos);

                       vc.emit('editProductCarouselFigure','uploadImage', 'notifyPhotos',product.carouselFigurePhotos);

                       $(".editSummernote").summernote('code', product.content);

                       let _productSpecValues = product.productSpecValues;

                       _productSpecValues.forEach(item => {
                            let _productSpecDetails = item.productSpecDetails;
                            let _specValue = '';
                            _productSpecDetails.forEach(detail => {
                                _specValue += (detail.detailValue+"/");
                            });

                            item.specValue = _specValue;
                       });

                       $that.editProductInfo.productSpecs = _productSpecValues;

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _doEditDefaultProductSpec:function(_product,_defaultProductSpec){

                _product.productSpecs.forEach(item => {
                    item.isDefault = "F";
                });
                _defaultProductSpec.isDefault="T";

                $that.addProductInfo.editProductInfo = JSON.parse(JSON.stringify(_product.productSpecs));
            }
        }
    });

})(window.vc);
