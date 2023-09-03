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
                keys: [],
                settingTypes: []
            }
        },
        _initMethod: function () {
            vc.getDict('community_setting_key', "setting_type", function (_data) {
                $that.addCommunitySettingInfo.settingTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('addCommunitySetting', 'openAddCommunitySettingModal', function () {
                $that.clearAddCommunitySettingInfo();
                $('#addCommunitySettingModel').modal('show');
            });
        },
        methods: {
            addCommunitySettingValidate() {
                return vc.validate.validate({
                    addCommunitySettingInfo: $that.addCommunitySettingInfo
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
                        }
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
                        }
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
                        }
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
                        }
                    ],
                    'addCommunitySettingInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "4000",
                            errInfo: "备注内容不能超过4000"
                        }
                    ],
                });
            },
            saveCommunitySettingInfo: function () {
                if (!$that.addCommunitySettingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.addCommunitySettingInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, $that.addCommunitySettingInfo);
                    $('#addCommunitySettingModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/communitySetting/saveCommunitySetting',
                    JSON.stringify($that.addCommunitySettingInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCommunitySettingModel').modal('hide');
                            $that.clearAddCommunitySettingInfo();
                            vc.emit('communitySettingManage', 'listCommunitySetting', {});
                            vc.message(_json.msg);
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearAddCommunitySettingInfo: function () {
                let _settingTypes = $that.addCommunitySettingInfo.settingTypes;
                $that.addCommunitySettingInfo = {
                    settingType: '',
                    settingName: '',
                    settingKey: '',
                    settingValue: '',
                    remark: '',
                    keys: [],
                    settingTypes: _settingTypes
                };
            },
            _changeSettingType: function () {
                $that._loadCommunitySettingKey();
            },
            _changeSettingName: function () {
                $that.addCommunitySettingInfo.keys.forEach(item => {
                    if (item.settingName == $that.addCommunitySettingInfo.settingName) {
                        $that.addCommunitySettingInfo.settingKey = item.settingKey;
                        $that.addCommunitySettingInfo.remark = item.remark;
                    }
                });
            },
            _loadCommunitySettingKey: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        settingType: $that.addCommunitySettingInfo.settingType
                    }
                };
                //发送get请求
                vc.http.apiGet('/communitySettingKey.listCommunitySettingKey',
                    param,
                    function (json, res) {
                        let _communitySettingManageInfo = JSON.parse(json);
                        $that.addCommunitySettingInfo.keys = _communitySettingManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);