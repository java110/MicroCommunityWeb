(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addRentingConfigInfo: {
                rentingConfigId: '',
                rentingType: '',
                rentingFormula: '',
                servicePrice: '',
                serviceOwnerRate: '',
                serviceTenantRate: '',
                adminSeparateRate: '',
                proxySeparateRate: '0',
                propertySeparateRate: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addRentingConfig', 'openAddRentingConfigModal', function () {
                $('#addRentingConfigModel').modal('show');
            });
        },
        methods: {
            addRentingConfigValidate() {
                return vc.validate.validate({
                    addRentingConfigInfo: vc.component.addRentingConfigInfo
                }, {
                    'addRentingConfigInfo.rentingType': [
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
                    'addRentingConfigInfo.rentingFormula': [
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
                    'addRentingConfigInfo.servicePrice': [
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
                    'addRentingConfigInfo.serviceOwnerRate': [
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
                    'addRentingConfigInfo.serviceTenantRate': [
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
                    'addRentingConfigInfo.adminSeparateRate': [
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
                    'addRentingConfigInfo.proxySeparateRate': [
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
                    'addRentingConfigInfo.propertySeparateRate': [
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
                });
            },
            saveRentingConfigInfo: function () {
                if (!vc.component.addRentingConfigValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addRentingConfigInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addRentingConfigInfo);
                    $('#addRentingConfigModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/renting/saveRentingConfig',
                    JSON.stringify(vc.component.addRentingConfigInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addRentingConfigModel').modal('hide');
                            vc.component.clearAddRentingConfigInfo();
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
            clearAddRentingConfigInfo: function () {
                vc.component.addRentingConfigInfo = {
                    rentingType: '',
                    rentingFormula: '',
                    servicePrice: '',
                    serviceOwnerRate: '',
                    serviceTenantRate: '',
                    adminSeparateRate: '',
                    proxySeparateRate: '',
                    propertySeparateRate: '',

                };
            }
        }
    });

})(window.vc);
