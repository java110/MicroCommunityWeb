(function (vc, vm) {

    vc.extends({
        data: {
            editGroupBuySettingInfo: {
                settingId: '',
                groupBuyName: '',
                groupBuyDesc: '',
                validHours: '',
                startTime: '',
                endTime: '',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editGroupBuySetting', 'openEditGroupBuySettingModal', function (_params) {
                vc.component.refreshEditGroupBuySettingInfo();
                $('#editGroupBuySettingModel').modal('show');
                vc.copyObject(_params, vc.component.editGroupBuySettingInfo);
                vc.component.editGroupBuySettingInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editGroupBuySettingValidate: function () {
                return vc.validate.validate({
                    editGroupBuySettingInfo: vc.component.editGroupBuySettingInfo
                }, {
                    'editGroupBuySettingInfo.groupBuyName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "拼团名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "拼团名称不能超过256位"
                        },
                    ],
                    'editGroupBuySettingInfo.groupBuyDesc': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "拼团简介不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "拼团简介不能超过500位"
                        },
                    ],
                    'editGroupBuySettingInfo.validHours': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "拼团时效不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "拼团时效不是有效数字"
                        },
                    ],
                    'editGroupBuySettingInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "开始时间不是有效日期"
                        },
                    ],
                    'editGroupBuySettingInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "结束时间不是有效日期"
                        },
                    ],
                    'editGroupBuySettingInfo.settingId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设置ID不能为空"
                        }]

                });
            },
            editGroupBuySetting: function () {
                if (!vc.component.editGroupBuySettingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'groupBuySetting.updateGroupBuySetting',
                    JSON.stringify(vc.component.editGroupBuySettingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editGroupBuySettingModel').modal('hide');
                            vc.emit('groupBuySettingManage', 'listGroupBuySetting', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditGroupBuySettingInfo: function () {
                vc.component.editGroupBuySettingInfo = {
                    settingId: '',
                    groupBuyName: '',
                    groupBuyDesc: '',
                    validHours: '',
                    startTime: '',
                    endTime: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
