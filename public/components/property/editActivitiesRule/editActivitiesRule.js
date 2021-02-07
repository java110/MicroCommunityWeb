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
                remark: '',

            }
        },
        _initMethod: function () {
            vc.initDateTime('editStartTime', function (_startTime) {
                $that.editActivitiesRuleInfo.startTime = _startTime;
            });
            vc.initDateTime('editEndTime', function (_endTime) {
                $that.editActivitiesRuleInfo.endTime = _endTime;
                let start = Date.parse(new Date($that.editActivitiesRuleInfo.startTime))
                let end = Date.parse(new Date($that.editActivitiesRuleInfo.endTime))
                if (start - end >= 0) {
                    vc.toast("结束时间必须大于开始时间")
                    $that.editActivitiesRuleInfo.endTime = '';
                }
            });
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
                        },
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
                        },
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
                        },
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
                        },
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
                        },
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
                        },
                    ],
                    'editActivitiesRuleInfo.ruleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规则ID不能为空"
                        }]

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
                            return;
                        }
                        vc.message(_json.msg);
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
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
