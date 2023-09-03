(function (vc, vm) {

    vc.extends({
        data: {
            editIntegralRuleInfo: {
                ruleId: '',
                ruleName: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editIntegralRule', 'openEditIntegralRuleModal', function (_params) {
                vc.component.refreshEditIntegralRuleInfo();
                $('#editIntegralRuleModel').modal('show');
                vc.copyObject(_params, vc.component.editIntegralRuleInfo);
                vc.component.editIntegralRuleInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editIntegralRuleValidate: function () {
                return vc.validate.validate({
                    editIntegralRuleInfo: vc.component.editIntegralRuleInfo
                }, {
                    'editIntegralRuleInfo.ruleName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规则名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "规则名称不能超过64"
                        },
                    ],
                    'editIntegralRuleInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        },
                    ],
                    'editIntegralRuleInfo.ruleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规则编号不能为空"
                        }]

                });
            },
            editIntegralRule: function () {
                if (!vc.component.editIntegralRuleValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/integral.updateIntegralRule',
                    JSON.stringify(vc.component.editIntegralRuleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editIntegralRuleModel').modal('hide');
                            vc.emit('integralRuleManage', 'listIntegralRule', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditIntegralRuleInfo: function () {
                vc.component.editIntegralRuleInfo = {
                    ruleId: '',
                    ruleName: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
