(function (vc, vm) {

    vc.extends({
        data: {
            editChainSupplierInfo: {
                csId: '',
                name: '',
                appId: '',
                appSecure: '',
                mchId: '',
                mchKey: '',
                url: '',
                remark: '',
                beanName:'',
                suType:''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editChainSupplier', 'openEditChainSupplierModal', function (_params) {
                vc.component.refreshEditChainSupplierInfo();
                $('#editChainSupplierModel').modal('show');
                vc.copyObject(_params, vc.component.editChainSupplierInfo);
                vc.component.editChainSupplierInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editChainSupplierValidate: function () {
                return vc.validate.validate({
                    editChainSupplierInfo: vc.component.editChainSupplierInfo
                }, {
                    'editChainSupplierInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "供应商名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "供应商名称不能超过30"
                        },
                    ],
                    'editChainSupplierInfo.appId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "接口应用ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "接口应用ID不能为空"
                        },
                    ],
                    'editChainSupplierInfo.appSecure': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "接口秘钥不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "接口秘钥不能为空"
                        },
                    ],
                    'editChainSupplierInfo.mchId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商户ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "32",
                            errInfo: "商户ID不能为空"
                        },
                    ],
                    'editChainSupplierInfo.mchKey': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "秘钥不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "秘钥不能为空"
                        },
                    ],
                    'editChainSupplierInfo.url': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "接口地址不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "接口地址不能为空"
                        },
                    ],
                    'editChainSupplierInfo.beanName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "适配器名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "适配器名称不能为空"
                        },
                    ],
                    'editChainSupplierInfo.csId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "供应商ID不能为空"
                        }]

                });
            },
            editChainSupplier: function () {
                if (!vc.component.editChainSupplierValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'chainSupplier.updateChainSupplier',
                    JSON.stringify(vc.component.editChainSupplierInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editChainSupplierModel').modal('hide');
                            vc.emit('chainSupplierManage', 'listChainSupplier', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditChainSupplierInfo: function () {
                vc.component.editChainSupplierInfo = {
                    csId: '',
                    name: '',
                    appId: '',
                    appSecure: '',
                    mchId: '',
                    mchKey: '',
                    url: '',
                    remark: '',
                    beanName:'',
                    suType:'',
                }
            }
        }
    });

})(window.vc, window.vc.component);
