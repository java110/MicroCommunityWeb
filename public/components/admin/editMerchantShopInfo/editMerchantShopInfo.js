(function (vc) {

    vc.extends({
        data: {
            editMerchantShopInfo: {
                storeId:'',
                shopName: '',
                shopId:'',
                areaAddress: '',
                returnAddress: "",
                returnLink: "",
                areaCode: '',
                shopType: '',
                shopTypes: [],
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editMerchantShopInfo', 'openAddMerchantShopModal', function (_param) {
                vc.copyObject(_param,$that.editMerchantShopInfo);
                $that._listEditShopTypes();
                $('#editMerchantShopInfoModel').modal('show');
            });
        },
        methods: {
            editMerchantShopValidate() {
                return vc.validate.validate({
                    editMerchantShopInfo: vc.component.editMerchantShopInfo
                }, {
                    'editMerchantShopInfo.shopId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商铺不存在"
                        }
                    ],
                    'editMerchantShopInfo.shopName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商铺名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "商铺名称必须在200位之内"
                        },
                    ],
                });
            },
            _editMerchantShopInfo: function () {
                if (!vc.component.editMerchantShopValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/shop.adminUpdateShop',
                    JSON.stringify(vc.component.editMerchantShopInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMerchantShopInfoModel').modal('hide');
                            vc.component.clearEditMerchantShopInfo();
                            vc.emit('merchantShop', 'listShop', {});
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);

                    });
            },
            clearEditMerchantShopInfo: function () {
                vc.component.editMerchantShopInfo = {
                    storeId:'',
                    shopName: '',
                    shopId:'',
                    areaAddress: '',
                    returnAddress: "",
                    returnLink: "",
                    areaCode: '',
                    shopType: '',
                    shopTypes: [],
                };
            },
            
            _listEditShopTypes: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                    }
                };
                //发送get请求
                vc.http.apiGet('/shopType/queryShopType',
                    param,
                    function (json, res) {
                        let _shopTypeManageInfo = JSON.parse(json);
                        $that.editMerchantShopInfo.shopTypes = _shopTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);