(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addGroupBuySettingInfo: {
                settingId: '',
                groupBuyName: '',
                groupBuyDesc: '',
                validHours: '',
                startTime: '',
                endTime: '',
            }
        },
        _initMethod: function () {

            vc.initDateTime('addStartTime', function (_value) {
                $that.addGroupBuySettingInfo.startTime = _value;
            });

            vc.initDateTime('addEndTime', function (_value) {
                $that.addGroupBuySettingInfo.endTime = _value;
            });

        },
        _initEvent: function () {
            vc.on('addGroupBuySetting', 'openAddGroupBuySettingModal', function () {
                $('#addGroupBuySettingModel').modal('show');
            });
        },
        methods: {
            addGroupBuySettingValidate() {
                return vc.validate.validate({
                    addGroupBuySettingInfo: vc.component.addGroupBuySettingInfo
                }, {
                    'addGroupBuySettingInfo.groupBuyName': [
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
                    'addGroupBuySettingInfo.groupBuyDesc': [
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
                    'addGroupBuySettingInfo.validHours': [
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
                    'addGroupBuySettingInfo.startTime': [
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
                    'addGroupBuySettingInfo.endTime': [
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
                });
            },
            saveGroupBuySettingInfo: function () {
                if (!vc.component.addGroupBuySettingValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addGroupBuySettingInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addGroupBuySettingInfo);
                    $('#addGroupBuySettingModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/groupBuy/saveGroupBuySetting',
                    JSON.stringify(vc.component.addGroupBuySettingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addGroupBuySettingModel').modal('hide');
                            vc.component.clearAddGroupBuySettingInfo();
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
            clearAddGroupBuySettingInfo: function () {
                vc.component.addGroupBuySettingInfo = {
                    groupBuyName: '',
                    groupBuyDesc: '',
                    validHours: '',
                    startTime: '',
                    endTime: '',

                };
            }
        }
    });

})(window.vc);
