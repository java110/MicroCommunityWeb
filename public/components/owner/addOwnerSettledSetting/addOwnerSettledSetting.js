(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addOwnerSettledSettingInfo: {
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
            vc.on('addOwnerSettledSetting', 'openAddOwnerSettledSettingModal', function () {
                $('#addOwnerSettledSettingModel').modal('show');
            });
        },
        methods: {
            addOwnerSettledSettingValidate() {
                return vc.validate.validate({
                    addOwnerSettledSettingInfo: vc.component.addOwnerSettledSettingInfo
                }, {
                    'addOwnerSettledSettingInfo.settingName': [
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
                    'addOwnerSettledSettingInfo.auditWay': [
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
                    'addOwnerSettledSettingInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        },
                    ],
                });
            },
            saveOwnerSettledSettingInfo: function () {
                if (!vc.component.addOwnerSettledSettingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.component.addOwnerSettledSettingInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/ownerSettled.saveOwnerSettledSetting',
                    JSON.stringify(vc.component.addOwnerSettledSettingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addOwnerSettledSettingModel').modal('hide');
                            vc.component.clearAddOwnerSettledSettingInfo();
                            vc.emit('ownerSettledSettingManage', 'listOwnerSettledSetting', {});
                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddOwnerSettledSettingInfo: function () {
                vc.component.addOwnerSettledSettingInfo = {
                    settingName: '',
                    auditWay: '',
                    flowName: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
