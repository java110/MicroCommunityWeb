(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMarketGoodsItemInfo: {
                itemId: '',
                goodsId: '',
                prodName: '',
                prodDesc: '',
                picUrl: '',
                picLink: '',
                price: '',
                shopName: '',
                sort: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addMarketGoodsItem', 'openAddMarketGoodsItemModal', function (_param) {
                vc.copyObject(_param,$that.addMarketGoodsItemInfo);
                $('#addMarketGoodsItemModel').modal('show');
            });

            vc.on("addMarketGoodsItem", "notifyUploadImage", function(_param) {
                if (!_param || _param.length < 1) {
                    return;
                }
                _param.forEach(item => {
                    vc.component.addMarketGoodsItemInfo.picUrl = item;
                });
            });
        },
        methods: {
            addMarketGoodsItemValidate() {
                return vc.validate.validate({
                    addMarketGoodsItemInfo: vc.component.addMarketGoodsItemInfo
                }, {
                    'addMarketGoodsItemInfo.goodsId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "营销商品ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "营销商品ID不能超过30"
                        },
                    ],
                    'addMarketGoodsItemInfo.prodName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "商品名称不能超过128"
                        },
                    ],
                    'addMarketGoodsItemInfo.prodDesc': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品简介不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "商品简介不能超过256"
                        },
                    ],
                    'addMarketGoodsItemInfo.picUrl': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "图片地址不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "图片地址不能超过512"
                        },
                    ],
                    'addMarketGoodsItemInfo.picLink': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "图片访问地址不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "图片访问地址不能超过512"
                        },
                    ],
                    'addMarketGoodsItemInfo.price': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "金额不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10",
                            errInfo: "金额不能超过10"
                        },
                    ],
                    'addMarketGoodsItemInfo.shopName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商铺名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "商铺名称不能超过128"
                        },
                    ],
                    'addMarketGoodsItemInfo.sort': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "排序不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10",
                            errInfo: "排序不能超过10"
                        },
                    ],




                });
            },
            saveMarketGoodsItemInfo: function () {
                if (!vc.component.addMarketGoodsItemValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.http.apiPost(
                    '/marketGoods.saveMarketGoodsItem',
                    JSON.stringify(vc.component.addMarketGoodsItemInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMarketGoodsItemModel').modal('hide');
                            vc.component.clearAddMarketGoodsItemInfo();
                            vc.emit('marketGoodsItemManage', 'listMarketGoodsItem', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddMarketGoodsItemInfo: function () {
                vc.component.addMarketGoodsItemInfo = {
                    goodsId: '',
                    prodName: '',
                    prodDesc: '',
                    picUrl: '',
                    picLink: '',
                    price: '',
                    shopName: '',
                    sort: '',

                };
            }
        }
    });

})(window.vc);
