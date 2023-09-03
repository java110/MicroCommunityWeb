(function (vc, vm) {

    vc.extends({
        data: {
            editChargeRuleInfo: {
                ruleId: '',
                ruleName: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editChargeRule', 'openEditChargeRuleModal', function (_params) {
                vc.component.refreshEditChargeRuleInfo();
                $('#editChargeRuleModel').modal('show');
                vc.copyObject(_params, vc.component.editChargeRuleInfo);
                vc.component.editChargeRuleInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editChargeRuleValidate: function () {
                return vc.validate.validate({
                    editChargeRuleInfo: vc.component.editChargeRuleInfo
                }, {
                    'editChargeRuleInfo.ruleName': [
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
                    'editChargeRuleInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        },
                    ],
                    'editChargeRuleInfo.ruleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editChargeRule: function () {
                if (!vc.component.editChargeRuleValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/chargeRule.updateChargeRule',
                    JSON.stringify(vc.component.editChargeRuleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editChargeRuleModel').modal('hide');
                            vc.emit('chargeRuleManage', 'listChargeRule', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditChargeRuleInfo: function () {
                vc.component.editChargeRuleInfo = {
                    ruleId: '',
                    ruleName: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
