(function (vc, vm) {

    vc.extends({
        data: {
            editRepairSettingInfo: {
                settingId: '',
                repairTypeName: '',
                repairWay: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editRepairSetting', 'openEditRepairSettingModal', function (_params) {
                vc.component.refreshEditRepairSettingInfo();
                $('#editRepairSettingModel').modal('show');
                vc.copyObject(_params, vc.component.editRepairSettingInfo);
                vc.component.editRepairSettingInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editRepairSettingValidate: function () {
                return vc.validate.validate({
                    editRepairSettingInfo: vc.component.editRepairSettingInfo
                }, {
                    'editRepairSettingInfo.repairTypeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型名称不能为空"
                        },
                        {
                            limit: "max",
                            param: "1,200",
                            errInfo: "类型名称不能超过200位"
                        },
                    ],
                    'editRepairSettingInfo.repairWay': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "派单方式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "派单方式格式错误"
                        },
                    ],
                    'editRepairSettingInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "说明不能超过500位"
                        },
                    ],
                    'editRepairSettingInfo.settingId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设置不能为空"
                        }]

                });
            },
            editRepairSetting: function () {
                if (!vc.component.editRepairSettingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'repair.updateRepairSetting',
                    JSON.stringify(vc.component.editRepairSettingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editRepairSettingModel').modal('hide');
                            vc.emit('repairSettingManage', 'listRepairSetting', {});
                            return;
                        }
                        vc.message(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditRepairSettingInfo: function () {
                vc.component.editRepairSettingInfo = {
                    settingId: '',
                    repairTypeName: '',
                    repairWay: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
