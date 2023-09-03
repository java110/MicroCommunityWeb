(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addIntegralRuleInfo: {
                ruleId: '',
                ruleName: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addIntegralRule', 'openAddIntegralRuleModal', function () {
                $('#addIntegralRuleModel').modal('show');
            });
        },
        methods: {
            addIntegralRuleValidate() {
                return vc.validate.validate({
                    addIntegralRuleInfo: vc.component.addIntegralRuleInfo
                }, {
                    'addIntegralRuleInfo.ruleName': [
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
                    'addIntegralRuleInfo.remark': [
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




                });
            },
            saveIntegralRuleInfo: function () {
                if (!vc.component.addIntegralRuleValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addIntegralRuleInfo.communityId = vc.getCurrentCommunity().communityId;
             

                vc.http.apiPost(
                    '/integral.saveIntegralRule',
                    JSON.stringify(vc.component.addIntegralRuleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addIntegralRuleModel').modal('hide');
                            vc.component.clearAddIntegralRuleInfo();
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
            clearAddIntegralRuleInfo: function () {
                vc.component.addIntegralRuleInfo = {
                    ruleName: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
