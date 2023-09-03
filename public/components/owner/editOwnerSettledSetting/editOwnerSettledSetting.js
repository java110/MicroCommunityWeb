(function (vc, vm) {

    vc.extends({
        data: {
            editOwnerSettledSettingInfo: {
                settingId: '',
                settingName: '',
                auditWay: '',
                flowName: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editOwnerSettledSetting', 'openEditOwnerSettledSettingModal', function (_params) {
                vc.component.refreshEditOwnerSettledSettingInfo();
                $('#editOwnerSettledSettingModel').modal('show');
                vc.copyObject(_params, vc.component.editOwnerSettledSettingInfo);
                vc.component.editOwnerSettledSettingInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editOwnerSettledSettingValidate: function () {
                return vc.validate.validate({
                    editOwnerSettledSettingInfo: vc.component.editOwnerSettledSettingInfo
                }, {
                    'editOwnerSettledSettingInfo.settingName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设置名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设置名称不能超过64"
                        },
                    ],
                    'editOwnerSettledSettingInfo.auditWay': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物业审核不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "物业审核不能超过12"
                        },
                    ],
                    'editOwnerSettledSettingInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        },
                    ],
                    'editOwnerSettledSettingInfo.settingId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editOwnerSettledSetting: function () {
                if (!vc.component.editOwnerSettledSettingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/ownerSettled.updateOwnerSettledSetting',
                    JSON.stringify(vc.component.editOwnerSettledSettingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editOwnerSettledSettingModel').modal('hide');
                            vc.emit('ownerSettledSettingManage', 'listOwnerSettledSetting', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshEditOwnerSettledSettingInfo: function () {
                vc.component.editOwnerSettledSettingInfo = {
                    settingId: '',
                    settingName: '',
                    auditWay: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
