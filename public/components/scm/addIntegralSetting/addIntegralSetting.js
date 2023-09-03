(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addIntegralSettingInfo: {
                settingId: '',
                money: '',
                remark: '',
                thirdFlag: 'N',
                thirdUrl: '',

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addIntegralSetting', 'openAddIntegralSettingModal', function() {
                $('#addIntegralSettingModel').modal('show');
            });
        },
        methods: {
            addIntegralSettingValidate() {
                return vc.validate.validate({
                    addIntegralSettingInfo: vc.component.addIntegralSettingInfo
                }, {
                    'addIntegralSettingInfo.money': [{
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
                    'addIntegralSettingInfo.remark': [{
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
                    'addIntegralSettingInfo.thirdFlag': [{
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
                    'addIntegralSettingInfo.thirdUrl': [{
                        limit: "maxLength",
                        param: "512",
                        errInfo: "平台地址不能超过512"
                    }, ],
                });
            },
            saveIntegralSettingInfo: function() {
                if (!vc.component.addIntegralSettingValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addIntegralSettingInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/integral.saveIntegralSetting',
                    JSON.stringify(vc.component.addIntegralSettingInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addIntegralSettingModel').modal('hide');
                            vc.component.clearAddIntegralSettingInfo();
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
            clearAddIntegralSettingInfo: function() {
                vc.component.addIntegralSettingInfo = {
                    money: '',
                    remark: '',
                    thirdFlag: 'N',
                    thirdUrl: '',

                };
            }
        }
    });

})(window.vc);