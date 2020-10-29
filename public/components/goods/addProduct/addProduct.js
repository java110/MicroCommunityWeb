(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addProductInfo: {
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
        watch: {
            "addProductInfo.productSpecs": {
                deep: true,
                handler: function () {
                    
                }
            }
        },
        _initMethod: function () {
            $that._listAddProductCategorys();

            $that._initAddProduct();
        },
        _initEvent: function () {
            vc.on('addProduct', 'openAddProductModal', function () {
                $('#addProductModel').modal('show');
            });
            vc.on("addProduct", "notifyUploadCoverImage", function (_param) {
                if(_param.length > 0){
                    vc.component.addProductInfo.coverPhoto = _param[0];
                }else{
                    vc.component.addProductInfo.coverPhoto = '';
                }
                
            });
            vc.on("addProduct", "notifyUploadCarouselFigureImage", function (_param) {
                vc.component.addProductInfo.carouselFigurePhoto = _param;
            });

            vc.on("addProduct","chooseProductSpec",function(_productSpec){
                _productSpec.stock = "999";
                _productSpec.sales = "99";
                _productSpec.price = "0.00";
                _productSpec.costPrice = "0.00";
                _productSpec.vipPrice = "0.00";
                _productSpec.otPrice = "0.00";
                $that.addProductInfo.productSpecs.push(_productSpec);
            });
        },
        methods: {
            addProductValidate() {
                return vc.validate.validate({
                    addProductInfo: vc.component.addProductInfo
                }, {
                    'addProductInfo.categoryId': [
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
                    'addProductInfo.prodName': [
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
                    'addProductInfo.prodDesc': [
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
                    'addProductInfo.keyword': [
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
                    'addProductInfo.barCode': [
                        {
                            limit: "maxLength",
                            param: "15",
                            errInfo: "产品条码不能超过15位"
                        },
                    ],
                    'addProductInfo.unitName': [
                        {
                            limit: "maxLength",
                            param: "32",
                            errInfo: "单位不能超过32位"
                        },
                    ],
                    'addProductInfo.sort': [
                        {
                            limit: "num",
                            param: "",
                            errInfo: "排序格式错误"
                        },
                    ],
                    'addProductInfo.isPostage': [
                        {
                            limit: "num",
                            param: "",
                            errInfo: "是否包邮格式错误"
                        },
                    ],
                    'addProductInfo.postage': [
                        {
                            limit: "money",
                            param: "",
                            errInfo: "邮费格式错误,请填写如 3.00"
                        },
                    ],
                });
            },
            saveProductInfo: function () {
                let hasDefault = false;
                vc.component.addProductInfo.productSpecs.forEach(item =>{
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


                if (!vc.component.addProductValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

               
                vc.component.addProductInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addProductInfo);
                    $('#addProductModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/product/saveProduct',
                    JSON.stringify(vc.component.addProductInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addProductModel').modal('hide');
                            vc.component.clearAddProductInfo();
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
            clearAddProductInfo: function () {

                let _productCategorys = $that.addProductInfo.productCategorys;
                vc.component.addProductInfo = {
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
            _closeAddProduct: function () {
                $that.clearAddProductInfo();
                vc.emit('productManage', 'listProduct', {});
            },
            _listAddProductCategorys: function (_page, _rows) {
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
                        $that.addProductInfo.productCategorys = _productCategoryManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initAddProduct:function(){
                let $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入商品描述',
                    callbacks: {
                        onImageUpload: function (files, editor, $editable) {
                            $that.sendFile($summernote, files);
                        },
                        onChange: function (contents, $editable) {
                            $that.addProductInfo.content = contents;
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
            _openChooseSpecModal:function(){
                vc.emit('chooseProductSpec', 'openChooseProductSpecModel',{});
            },
            _openDeleteProductSpec:function(_productSpec){
                let _productSpecs = $that.addProductInfo.productSpecs;
                let index = _productSpecs.indexOf(_productSpec); 
                if (index > -1) { 
                    _productSpecs.splice(index, 1); 
                }
            },
            _doDefaultProductSpec:function(_product,_defaultProductSpec){

                _product.productSpecs.forEach(item => {
                    item.isDefault = "F";
                });
                _defaultProductSpec.isDefault="T";

                $that.addProductInfo.productSpecs = JSON.parse(JSON.stringify(_product.productSpecs));
            }
        }
    });

})(window.vc);
