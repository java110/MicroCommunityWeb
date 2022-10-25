(function (vc, vm) {

    vc.extends({
        data: {
            editMarketGoodsItemInfo: {
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
            vc.on('editMarketGoodsItem', 'openEditMarketGoodsItemModal', function (_params) {
                vc.component.refreshEditMarketGoodsItemInfo();
                $('#editMarketGoodsItemModel').modal('show');
                vc.copyObject(_params, vc.component.editMarketGoodsItemInfo);

                let _photos = [];
                _photos.push(_params.picUrl);
                vc.emit('editMarketGoodsItem', 'uploadImage', 'notifyPhotos', _photos);
            });

            vc.on("editMarketGoodsItem", "notifyUploadImage", function(_param) {

                if (!_param || _param.length < 1) {
                    return;
                }
                _param.forEach(item => {
                    vc.component.editMarketGoodsItemInfo.picUrl = item;
                });
            });
        },
        methods: {
            editMarketGoodsItemValidate: function () {
                return vc.validate.validate({
                    editMarketGoodsItemInfo: vc.component.editMarketGoodsItemInfo
                }, {
                    'editMarketGoodsItemInfo.goodsId': [
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
                    'editMarketGoodsItemInfo.prodName': [
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
                    'editMarketGoodsItemInfo.prodDesc': [
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
                    'editMarketGoodsItemInfo.picUrl': [
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
                    'editMarketGoodsItemInfo.picLink': [
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
                    'editMarketGoodsItemInfo.price': [
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
                    'editMarketGoodsItemInfo.shopName': [
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
                    'editMarketGoodsItemInfo.sort': [
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
                    'editMarketGoodsItemInfo.itemId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editMarketGoodsItem: function () {
                if (!vc.component.editMarketGoodsItemValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/marketGoods.updateMarketGoodsItem',
                    JSON.stringify(vc.component.editMarketGoodsItemInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMarketGoodsItemModel').modal('hide');
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
            refreshEditMarketGoodsItemInfo: function () {
                vc.component.editMarketGoodsItemInfo = {
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
            }
        }
    });

})(window.vc, window.vc.component);
