(function (vc, vm) {

    vc.extends({
        data: {
            editRentingConfigInfo: {
                rentingConfigId: '',
                rentingType: '',
                rentingFormula: '',
                servicePrice: '',
                serviceOwnerRate: '',
                serviceTenantRate: '',
                adminSeparateRate: '',
                proxySeparateRate: '',
                propertySeparateRate: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editRentingConfig', 'openEditRentingConfigModal', function (_params) {
                vc.component.refreshEditRentingConfigInfo();
                $('#editRentingConfigModel').modal('show');
                vc.copyObject(_params, vc.component.editRentingConfigInfo);
                vc.component.editRentingConfigInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editRentingConfigValidate: function () {
                return vc.validate.validate({
                    editRentingConfigInfo: vc.component.editRentingConfigInfo
                }, {
                    'editRentingConfigInfo.rentingType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "租聘类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "值超过200位"
                        },
                    ],
                    'editRentingConfigInfo.rentingFormula': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "收费公式不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "显示格式错误"
                        },
                    ],
                    'editRentingConfigInfo.servicePrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "服务费不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "格式错误"
                        },
                    ],
                    'editRentingConfigInfo.serviceOwnerRate': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "业主收费比率不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "格式错误"
                        },
                    ],
                    'editRentingConfigInfo.serviceTenantRate': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "租客收费比率不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "格式错误"
                        },
                    ],
                    'editRentingConfigInfo.adminSeparateRate': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "运营分账比率不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "格式错误"
                        },
                    ],
                    'editRentingConfigInfo.proxySeparateRate': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "代理商分账比率不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "格式错误"
                        },
                    ],
                    'editRentingConfigInfo.propertySeparateRate': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物业分账比率不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "格式错误"
                        },
                    ],
                    'editRentingConfigInfo.rentingConfigId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "配置ID不能为空"
                        }]

                });
            },
            editRentingConfig: function () {
                if (!vc.component.editRentingConfigValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/renting/updateRentingConfig',
                    JSON.stringify(vc.component.editRentingConfigInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editRentingConfigModel').modal('hide');
                            vc.emit('rentingConfigManage', 'listRentingConfig', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditRentingConfigInfo: function () {
                vc.component.editRentingConfigInfo = {
                    rentingConfigId: '',
                    rentingType: '',
                    rentingFormula: '',
                    servicePrice: '',
                    serviceOwnerRate: '',
                    serviceTenantRate: '',
                    adminSeparateRate: '',
                    proxySeparateRate: '',
                    propertySeparateRate: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
