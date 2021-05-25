(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addSystemGoldSettingInfo: {
                settingId: '',
                goldName: '',
                goldType: '',
                buyPrice: '',
                usePrice: '',
                validity: '',
                state: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addSystemGoldSetting', 'openAddSystemGoldSettingModal', function () {
                $('#addSystemGoldSettingModel').modal('show');
            });
        },
        methods: {
            addSystemGoldSettingValidate() {
                return vc.validate.validate({
                    addSystemGoldSettingInfo: vc.component.addSystemGoldSettingInfo
                }, {
                    'addSystemGoldSettingInfo.goldName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,64",
                            errInfo: "名称不能超过64位"
                        },
                    ],
                    'addSystemGoldSettingInfo.goldType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "类型格式错误"
                        },
                    ],
                    'addSystemGoldSettingInfo.buyPrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "购买价格不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "购买价格格式错误"
                        },
                    ],
                    'addSystemGoldSettingInfo.usePrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "使用价格不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "使用价格格式错误"
                        },
                    ],
                    'addSystemGoldSettingInfo.validity': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "有效期不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "有效期必须为整数"
                        },
                    ],
                    'addSystemGoldSettingInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "状态不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "状态格式错误"
                        },
                    ],




                });
            },
            saveSystemGoldSettingInfo: function () {
                if (!vc.component.addSystemGoldSettingValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addSystemGoldSettingInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addSystemGoldSettingInfo);
                    $('#addSystemGoldSettingModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    'systemGoldSetting.saveSystemGoldSetting',
                    JSON.stringify(vc.component.addSystemGoldSettingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addSystemGoldSettingModel').modal('hide');
                            vc.component.clearAddSystemGoldSettingInfo();
                            vc.emit('systemGoldSettingManage', 'listSystemGoldSetting', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddSystemGoldSettingInfo: function () {
                vc.component.addSystemGoldSettingInfo = {
                    goldName: '',
                    goldType: '',
                    buyPrice: '',
                    usePrice: '',
                    validity: '',
                    state: '',

                };
            }
        }
    });

})(window.vc);
