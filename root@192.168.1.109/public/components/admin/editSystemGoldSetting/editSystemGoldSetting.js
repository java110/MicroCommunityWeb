(function (vc, vm) {

    vc.extends({
        data: {
            editSystemGoldSettingInfo: {
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
            vc.on('editSystemGoldSetting', 'openEditSystemGoldSettingModal', function (_params) {
                vc.component.refreshEditSystemGoldSettingInfo();
                $('#editSystemGoldSettingModel').modal('show');
                vc.copyObject(_params, vc.component.editSystemGoldSettingInfo);
            });
        },
        methods: {
            editSystemGoldSettingValidate: function () {
                return vc.validate.validate({
                    editSystemGoldSettingInfo: vc.component.editSystemGoldSettingInfo
                }, {
                    'editSystemGoldSettingInfo.goldName': [
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
                    'editSystemGoldSettingInfo.goldType': [
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
                    'editSystemGoldSettingInfo.buyPrice': [
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
                    'editSystemGoldSettingInfo.usePrice': [
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
                    'editSystemGoldSettingInfo.validity': [
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
                    'editSystemGoldSettingInfo.state': [
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
                    'editSystemGoldSettingInfo.settingId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设置ID不能为空"
                        }]

                });
            },
            editSystemGoldSetting: function () {
                if (!vc.component.editSystemGoldSettingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/systemGoldSetting/updateSystemGoldSetting',
                    JSON.stringify(vc.component.editSystemGoldSettingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editSystemGoldSettingModel').modal('hide');
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
            refreshEditSystemGoldSettingInfo: function () {
                vc.component.editSystemGoldSettingInfo = {
                    settingId: '',
                    goldName: '',
                    goldType: '',
                    buyPrice: '',
                    usePrice: '',
                    validity: '',
                    state: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
