(function (vc) {

    vc.extends({
        data: {
            editProductInfo: {
                productId: '',
                categoryId: '',
                prodName: '',
                prodDesc: '',
                keyword: '',
                barCode: '1',
                unitName: '',
                sort: '',
                isPostage: '2',
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

                //$that.editProductInfo.shopId = vc.getCurrentCommunity().shopId;

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
                    barCode: '1',
                    unitName: '',
                    sort: '',
                    isPostage: '2',
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
                        row:50,
                        //shopId:vc.getCurrentCommunity().shopId
                    }
                };
                //发送get请求
                vc.http.apiGet('/productCategory/queryAdminProductCategory',
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
                    },
                    toolbar: [
                    ],
                });

            },
            _openEditChooseSpecModal:function(){
                vc.emit('chooseProductSpec', 'openChooseProductSpecModel',{});
            },
            _openEditDeleteProductSpec:function(_productSpec){
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
                vc.http.apiGet('/product/queryAdminProduct',
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
