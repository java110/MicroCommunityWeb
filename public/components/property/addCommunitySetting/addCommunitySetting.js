(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addCommunitySettingInfo: {
                csId: '',
                settingType: '',
                settingName: '',
                settingKey: '',
                settingValue: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addCommunitySetting', 'openAddCommunitySettingModal', function () {
                $('#addCommunitySettingModel').modal('show');
            });
        },
        methods: {
            addCommunitySettingValidate() {
                return vc.validate.validate({
                    addCommunitySettingInfo: vc.component.addCommunitySettingInfo
                }, {
                    'addCommunitySettingInfo.settingType': [
                        {
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
                    'addCommunitySettingInfo.settingName': [
                        {
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
                    'addCommunitySettingInfo.settingKey': [
                        {
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
                    'addCommunitySettingInfo.settingValue': [
                        {
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
                    'addCommunitySettingInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注内容不能超过200"
                        },
                    ],


                });
            },
            saveCommunitySettingInfo: function () {
                if (!vc.component.addCommunitySettingValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addCommunitySettingInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addCommunitySettingInfo);
                    $('#addCommunitySettingModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/communitySetting/saveCommunitySetting',
                    JSON.stringify(vc.component.addCommunitySettingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCommunitySettingModel').modal('hide');
                            vc.component.clearAddCommunitySettingInfo();
                            vc.emit('communitySettingManage', 'listCommunitySetting', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddCommunitySettingInfo: function () {
                vc.component.addCommunitySettingInfo = {
                    settingType: '',
                    settingName: '',
                    settingKey: '',
                    settingValue: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
