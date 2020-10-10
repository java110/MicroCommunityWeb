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
                postage: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addProduct', 'openAddProductModal', function () {
                $('#addProductModel').modal('show');
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
                vc.component.addProductInfo = {
                    categoryId: '',
                    prodName: '',
                    prodDesc: '',
                    keyword: '',
                    barCode: '',
                    unitName: '',
                    sort: '',
                    isPostage: '',
                    postage: '',

                };
            },
            _closeAddProduct: function () {
                $that.clearAddProductInfo();
                vc.emit('productManage', 'listProduct', {});
            }
        }
    });

})(window.vc);
