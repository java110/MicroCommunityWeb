(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addChargeRuleInfo: {
                ruleId: '',
                ruleName: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addChargeRule', 'openAddChargeRuleModal', function () {
                $('#addChargeRuleModel').modal('show');
            });
        },
        methods: {
            addChargeRuleValidate() {
                return vc.validate.validate({
                    addChargeRuleInfo: vc.component.addChargeRuleInfo
                }, {
                    'addChargeRuleInfo.ruleName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规则名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "规则名称不能超过64"
                        }
                    ],
                    'addChargeRuleInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        }
                    ]
                });
            },
            saveChargeRuleInfo: function () {
                if (!vc.component.addChargeRuleValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addChargeRuleInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/chargeRule.saveChargeRule',
                    JSON.stringify(vc.component.addChargeRuleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addChargeRuleModel').modal('hide');
                            vc.component.clearAddChargeRuleInfo();
                            vc.emit('chargeRuleManage', 'listChargeRule', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddChargeRuleInfo: function () {
                vc.component.addChargeRuleInfo = {
                    ruleName: '',
                    remark: '',
                };
            }
        }
    });
})(window.vc);
