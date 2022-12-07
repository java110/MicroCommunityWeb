(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addActivitiesRuleInfo: {
                ruleId: '',
                ruleType: '',
                ruleName: '',
                startTime: '',
                endTime: '',
                activitiesObj: '',
                remark: '',
                communityId: vc.getCurrentCommunity().communityId
            }
        },
        _initMethod: function () {
            vc.component._initAddActivitiesRuleDate();
        },
        _initEvent: function () {
            vc.on('addActivitiesRule', 'openAddActivitiesRuleModal', function () {
                $('#addActivitiesRuleModel').modal('show');
            });
        },
        methods: {
            _initAddActivitiesRuleDate: function () {
                $('.addStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addStartTime").val();
                        vc.component.addActivitiesRuleInfo.startTime = value;
                    });
                $('.addEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addEndTime").val();
                        var start = Date.parse(new Date(vc.component.addActivitiesRuleInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $(".addEndTime").val('')
                        } else {
                            vc.component.addActivitiesRuleInfo.endTime = value;
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
            addActivitiesRuleValidate() {
                return vc.validate.validate({
                    addActivitiesRuleInfo: vc.component.addActivitiesRuleInfo
                }, {
                    'addActivitiesRuleInfo.ruleType': [
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
                    'addActivitiesRuleInfo.ruleName': [
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
                    'addActivitiesRuleInfo.startTime': [
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
                    'addActivitiesRuleInfo.endTime': [
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
                    'addActivitiesRuleInfo.activitiesObj': [
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
                    'addActivitiesRuleInfo.remark': [
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
                    ]
                });
            },
            saveActivitiesRuleInfo: function () {
                if (!vc.component.addActivitiesRuleValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addActivitiesRuleInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addActivitiesRuleInfo);
                    $('#addActivitiesRuleModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/activitiesRule/saveActivitiesRule',
                    JSON.stringify(vc.component.addActivitiesRuleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addActivitiesRuleModel').modal('hide');
                            vc.component.clearAddActivitiesRuleInfo();
                            vc.emit('activitiesRuleManage', 'listActivitiesRule', {});
                            vc.toast("添加成功");
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
            clearAddActivitiesRuleInfo: function () {
                vc.component.addActivitiesRuleInfo = {
                    ruleType: '',
                    ruleName: '',
                    startTime: '',
                    endTime: '',
                    activitiesObj: '',
                    remark: ''
                };
            }
        }
    });
})(window.vc);
