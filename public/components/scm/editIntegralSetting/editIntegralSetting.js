(function(vc, vm) {

    vc.extends({
        data: {
            editIntegralSettingInfo: {
                settingId: '',
                money: '',
                remark: '',
                thirdFlag: '',
                thirdUrl: '',

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('editIntegralSetting', 'openEditIntegralSettingModal', function(_params) {
                vc.component.refreshEditIntegralSettingInfo();
                $('#editIntegralSettingModel').modal('show');
                vc.copyObject(_params, vc.component.editIntegralSettingInfo);
                vc.component.editIntegralSettingInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editIntegralSettingValidate: function() {
                return vc.validate.validate({
                    editIntegralSettingInfo: vc.component.editIntegralSettingInfo
                }, {
                    'editIntegralSettingInfo.money': [{
                            limit: "required",
                            param: "",
                            errInfo: "积分金额不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "积分金额不能超过12"
                        },
                    ],
                    'editIntegralSettingInfo.remark': [{
                            limit: "required",
                            param: "",
                            errInfo: "使用说明不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "使用说明不能超过512"
                        },
                    ],
                    'editIntegralSettingInfo.thirdFlag': [{
                            limit: "required",
                            param: "",
                            errInfo: "通知三方平台不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "三方标识不能超过12"
                        },
                    ],
                    'editIntegralSettingInfo.thirdUrl': [{
                        limit: "maxLength",
                        param: "512",
                        errInfo: "平台地址不能超过512"
                    }, ],
                    'editIntegralSettingInfo.settingId': [{
                        limit: "required",
                        param: "",
                        errInfo: "编号不能为空"
                    }]

                });
            },
            editIntegralSetting: function() {
                if (!vc.component.editIntegralSettingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/integral.updateIntegralSetting',
                    JSON.stringify(vc.component.editIntegralSettingInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editIntegralSettingModel').modal('hide');
                            vc.emit('integralSettingManage', 'listIntegralSetting', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditIntegralSettingInfo: function() {
                vc.component.editIntegralSettingInfo = {
                    settingId: '',
                    money: '',
                    remark: '',
                    thirdFlag: '',
                    thirdUrl: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);