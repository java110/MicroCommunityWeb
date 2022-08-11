(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addReportInfoSettingInfo: {
                reportTypes: [],
                settingId: '',
                reportType: '',
                name: '',
                startTime: '',
                endTime: '',
                remark: ''
            }
        },
        _initMethod: function () {
            vc.initDateTime('addStartTime', function (_startTime) {
                $that.addReportInfoSettingInfo.startTime = _startTime;
            });
            vc.initDateTime('addEndTime', function (_endTime) {
                $that.addReportInfoSettingInfo.endTime = _endTime;
                let start = Date.parse(new Date($that.addReportInfoSettingInfo.startTime))
                let end = Date.parse(new Date($that.addReportInfoSettingInfo.endTime))
                if (start - end >= 0) {
                    vc.toast("结束时间必须大于开始时间")
                    $that.addReportInfoSettingInfo.endTime = '';
                }
            });

            //防止多次点击时间插件失去焦点
            document.getElementsByClassName('form-control addStartTime')[0].addEventListener('click', myfunc)

            function myfunc(e) {
                e.currentTarget.blur();
            }

            document.getElementsByClassName("form-control addEndTime")[0].addEventListener('click', myfunc)

            function myfunc(e) {
                e.currentTarget.blur();
            }
        },
        _initEvent: function () {
            //与字典表项目类型关联
            vc.getDict('report_info_setting', "report_type", function (_data) {
                vc.component.addReportInfoSettingInfo.reportTypes = _data;
            });
            vc.on('addReportInfoSetting', 'openAddReportInfoSettingModal', function () {
                $('#addReportInfoSettingModel').modal('show');
            });
        },
        methods: {
            addReportInfoSettingValidate() {
                return vc.validate.validate({
                    addReportInfoSettingInfo: vc.component.addReportInfoSettingInfo
                }, {
                    'addReportInfoSettingInfo.reportType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "项目类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "项目类型格式错误"
                        },
                    ],
                    'addReportInfoSettingInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "项目名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "项目名称太长"
                        },
                    ],
                    'addReportInfoSettingInfo.startTime': [
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
                    'addReportInfoSettingInfo.endTime': [
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
                    'addReportInfoSettingInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注太长"
                        },
                    ]
                });
            },
            saveReportInfoSettingInfo: function () {
                if (!vc.component.addReportInfoSettingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addReportInfoSettingInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addReportInfoSettingInfo);
                    $('#addReportInfoSettingModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/reportInfoSetting/saveReportInfoSetting',
                    JSON.stringify(vc.component.addReportInfoSettingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addReportInfoSettingModel').modal('hide');
                            vc.component.clearAddReportInfoSettingInfo();
                            //与字典表项目类型关联
                            vc.getDict('report_info_setting', "report_type", function (_data) {
                                vc.component.addReportInfoSettingInfo.reportTypes = _data;
                            });
                            vc.toast("添加成功")
                            vc.emit('reportInfoSettingManage', 'listReportInfoSetting', {});
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
            clearAddReportInfoSettingInfo: function () {
                vc.component.addReportInfoSettingInfo = {
                    settingId: '',
                    reportTypes: [],
                    reportType: '',
                    name: '',
                    startTime: '',
                    endTime: '',
                    remark: ''
                };
            }
        }
    });
})(window.vc);
