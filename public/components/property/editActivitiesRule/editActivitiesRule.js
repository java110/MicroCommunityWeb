(function (vc, vm) {
    vc.extends({
        data: {
            editActivitiesRuleInfo: {
                ruleId: '',
                ruleType: '',
                ruleName: '',
                startTime: '',
                endTime: '',
                activitiesObj: '',
                remark: ''
            }
        },
        _initMethod: function () {
            vc.component._initEditActivitiesRuleDate();
        },
        _initEvent: function () {
            vc.on('editActivitiesRule', 'openEditActivitiesRuleModal', function (_params) {
                vc.component.refreshEditActivitiesRuleInfo();
                $('#editActivitiesRuleModel').modal('show');
                vc.copyObject(_params, vc.component.editActivitiesRuleInfo);
                vc.component.editActivitiesRuleInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            _initEditActivitiesRuleDate: function () {
                $('.editStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editStartTime").val();
                        vc.component.editActivitiesRuleInfo.startTime = value;
                    });
                $('.editEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editEndTime").val();
                        var start = Date.parse(new Date(vc.component.editActivitiesRuleInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $(".editEndTime").val('')
                        } else {
                            vc.component.editActivitiesRuleInfo.endTime = value;
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
            editActivitiesRuleValidate: function () {
                return vc.validate.validate({
                    editActivitiesRuleInfo: vc.component.editActivitiesRuleInfo
                }, {
                    'editActivitiesRuleInfo.ruleType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "活动类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "活动类型格式错误"
                        }
                    ],
                    'editActivitiesRuleInfo.ruleName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规则名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "规则名称太长"
                        }
                    ],
                    'editActivitiesRuleInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "128",
                            errInfo: "开始时间格式错误"
                        }
                    ],
                    'editActivitiesRuleInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "结束时间格式错误"
                        }
                    ],
                    'editActivitiesRuleInfo.activitiesObj': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "活动对象不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "活动对象格式错误"
                        }
                    ],
                    'editActivitiesRuleInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规则说明不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "1024",
                            errInfo: "规则说明太长"
                        }
                    ],
                    'editActivitiesRuleInfo.ruleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规则ID不能为空"
                        }
                    ]
                });
            },
            editActivitiesRule: function () {
                if (!vc.component.editActivitiesRuleValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/activitiesRule/updateActivitiesRule',
                    JSON.stringify(vc.component.editActivitiesRuleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editActivitiesRuleModel').modal('hide');
                            vc.emit('activitiesRuleManage', 'listActivitiesRule', {});
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
            refreshEditActivitiesRuleInfo: function () {
                vc.component.editActivitiesRuleInfo = {
                    ruleId: '',
                    ruleType: '',
                    ruleName: '',
                    startTime: '',
                    endTime: '',
                    activitiesObj: '',
                    remark: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
