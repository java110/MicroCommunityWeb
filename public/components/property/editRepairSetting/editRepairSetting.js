(function (vc, vm) {
    vc.extends({
        data: {
            editRepairSettingInfo: {
                settingId: '',
                repairTypeName: '',
                repairWay: '',
                repairSettingType: '',
                remark: '',
                publicArea: '',
                payFeeFlag: '',
                priceScope: '',
                returnVisitFlag: ''
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
                            limit: "maxIn",
                            param: "1,200",
                            errInfo: "类型名称不能超过200位"
                        },
                    ],
                    'editRepairSettingInfo.repairSettingType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修设置类型不能为空"
                        }
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
                    'editRepairSettingInfo.publicArea': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "公共区域不能为空"
                        }
                    ],
                    'editRepairSettingInfo.payFeeFlag': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "收费情况不能为空"
                        }
                    ],
                    'editRepairSettingInfo.returnVisitFlag': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "回访设置不能为空"
                        }
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
                        }
                    ]
                });
            },
            editRepairSetting: function () {
                if ($that.editRepairSettingInfo.payFeeFlag == 'F') {
                    $that.editRepairSettingInfo.priceScope = '不收费';
                }
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
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editRepairSettingModel').modal('hide');
                            vc.emit('repairSettingManage', 'listRepairSetting', {});
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
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
                    repairSettingType: '',
                    remark: '',
                    publicArea: '',
                    payFeeFlag: '',
                    priceScope: '',
                    returnVisitFlag: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
