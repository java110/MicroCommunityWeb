(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addRepairSettingInfo: {
                settingId: '',
                repairTypeName: '',
                repairWay: '',
                remark: '',
                publicArea: '',
                payFeeFlag: 'F',
                priceScope: '',
                returnVisitFlag: ''

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addRepairSetting', 'openAddRepairSettingModal', function () {
                $('#addRepairSettingModel').modal('show');
            });
        },
        methods: {
            addRepairSettingValidate() {
                return vc.validate.validate({
                    addRepairSettingInfo: vc.component.addRepairSettingInfo
                }, {
                    'addRepairSettingInfo.repairTypeName': [
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
                    'addRepairSettingInfo.repairWay': [
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
                    'addRepairSettingInfo.publicArea': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "公共区域不能为空"
                        }
                    ],
                    'addRepairSettingInfo.payFeeFlag': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "收费情况不能为空"
                        }
                    ],
                    'addRepairSettingInfo.returnVisitFlag': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "回访设置不能为空"
                        }
                    ],
                    'addRepairSettingInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "说明不能超过500位"
                        },
                    ],




                });
            },
            saveRepairSettingInfo: function () {

                if ($that.addRepairSettingInfo.payFeeFlag == 'F') {
                    $that.addRepairSettingInfo.priceScope = '不收费';
                }
                if (!vc.component.addRepairSettingValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addRepairSettingInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addRepairSettingInfo);
                    $('#addRepairSettingModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    'repair.saveRepairSetting',
                    JSON.stringify(vc.component.addRepairSettingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addRepairSettingModel').modal('hide');
                            vc.component.clearAddRepairSettingInfo();
                            vc.emit('repairSettingManage', 'listRepairSetting', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddRepairSettingInfo: function () {
                vc.component.addRepairSettingInfo = {
                    repairTypeName: '',
                    repairWay: '',
                    remark: '',
                    publicArea: '',
                    payFeeFlag: 'F',
                    priceScope: '',
                    returnVisitFlag: ''
                };
            }
        }
    });

})(window.vc);
