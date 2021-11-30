(function(vc, vm) {

    vc.extends({
        data: {
            editCommunitySettingInfo: {
                csId: '',
                settingType: '',
                settingName: '',
                settingKey: '',
                settingValue: '',
                remark: '',

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('editCommunitySetting', 'openEditCommunitySettingModal', function(_params) {
                vc.component.refreshEditCommunitySettingInfo();
                $('#editCommunitySettingModel').modal('show');
                vc.copyObject(_params, vc.component.editCommunitySettingInfo);
                vc.component.editCommunitySettingInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editCommunitySettingValidate: function() {
                return vc.validate.validate({
                    editCommunitySettingInfo: vc.component.editCommunitySettingInfo
                }, {
                    'editCommunitySettingInfo.settingType': [{
                            limit: "required",
                            param: "",
                            errInfo: "配置类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "配置类型不能为空"
                        },
                    ],
                    'editCommunitySettingInfo.settingName': [{
                            limit: "required",
                            param: "",
                            errInfo: "配置名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "流配置名称超过64位"
                        },
                    ],
                    'editCommunitySettingInfo.settingKey': [{
                            limit: "required",
                            param: "",
                            errInfo: "配置KEY不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "配置取值超过200位"
                        },
                    ],
                    'editCommunitySettingInfo.settingValue': [{
                            limit: "required",
                            param: "",
                            errInfo: "配置取值不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "配置取值超过200位"
                        },
                    ],
                    'editCommunitySettingInfo.remark': [{
                        limit: "maxLength",
                        param: "4000",
                        errInfo: "备注内容不能超过4000"
                    }, ],
                    'editCommunitySettingInfo.csId': [{
                        limit: "required",
                        param: "",
                        errInfo: "小区设置ID不能为空"
                    }]

                });
            },
            editCommunitySetting: function() {
                if (!vc.component.editCommunitySettingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/communitySetting/updateCommunitySetting',
                    JSON.stringify(vc.component.editCommunitySettingInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editCommunitySettingModel').modal('hide');
                            vc.emit('communitySettingManage', 'listCommunitySetting', {});
                            vc.toast(_json.msg);
                            return;
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditCommunitySettingInfo: function() {
                vc.component.editCommunitySettingInfo = {
                    csId: '',
                    settingType: '',
                    settingName: '',
                    settingKey: '',
                    settingValue: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);