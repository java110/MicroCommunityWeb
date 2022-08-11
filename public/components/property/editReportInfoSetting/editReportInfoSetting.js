(function (vc, vm) {
    vc.extends({
        data: {
            editReportInfoSettingInfo: {
                settingId: '',
                reportType: '',
                name: '',
                startTime: '',
                endTime: '',
                remark: '',
            }
        },
        _initMethod: function () {
            vc.initDateTime('editStartTime', function (_startTime) {
                $that.editReportInfoSettingInfo.startTime = _startTime;
            });
            vc.initDateTime('editEndTime', function (_endTime) {
                $that.editReportInfoSettingInfo.endTime = _endTime;
                let start = Date.parse(new Date($that.editReportInfoSettingInfo.startTime))
                let end = Date.parse(new Date($that.editReportInfoSettingInfo.endTime))
                if (start - end >= 0) {
                    vc.toast("结束时间必须大于开始时间")
                    $that.editReportInfoSettingInfo.endTime = '';
                }
            });
            //防止多次点击时间插件失去焦点
            document.getElementsByClassName('form-control editStartTime')[0].addEventListener('click', myfunc)

            function myfunc(e) {
                e.currentTarget.blur();
            }

            document.getElementsByClassName("form-control editEndTime")[0].addEventListener('click', myfunc)

            function myfunc(e) {
                e.currentTarget.blur();
            }
        },
        _initEvent: function () {
            vc.on('editReportInfoSetting', 'openEditReportInfoSettingModal', function (_params) {
                vc.component.refreshEditReportInfoSettingInfo();
                $('#editReportInfoSettingModel').modal('show');
                vc.copyObject(_params, vc.component.editReportInfoSettingInfo);
                vc.component.editReportInfoSettingInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editReportInfoSettingValidate: function () {
                return vc.validate.validate({
                    editReportInfoSettingInfo: vc.component.editReportInfoSettingInfo
                }, {
                    'editReportInfoSettingInfo.reportType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "问卷类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "问卷类型格式错误"
                        },
                    ],
                    'editReportInfoSettingInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "问卷名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "问卷名称太长"
                        },
                    ],
                    'editReportInfoSettingInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "开始时间错误"
                        },
                    ],
                    'editReportInfoSettingInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "结束时间错误"
                        },
                    ],
                    'editReportInfoSettingInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注太长"
                        },
                    ],
                    'editReportInfoSettingInfo.settingId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "问卷ID不能为空"
                        }
                    ]
                });
            },
            editReportInfoSetting: function () {
                if (!vc.component.editReportInfoSettingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/reportInfoSetting/updateReportInfoSetting',
                    JSON.stringify(vc.component.editReportInfoSettingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editReportInfoSettingModel').modal('hide');
                            vc.emit('reportInfoSettingManage', 'listReportInfoSetting', {});
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    }
                );
            },
            refreshEditReportInfoSettingInfo: function () {
                vc.component.editReportInfoSettingInfo = {
                    settingId: '',
                    reportType: '',
                    name: '',
                    startTime: '',
                    endTime: '',
                    remark: '',
                }
            }
        }
    });
})(window.vc, window.vc.component);
