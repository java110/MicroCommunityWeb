(function (vc, vm) {

    vc.extends({
        data: {
            editMarketRuleInfo: {
                ruleId: '',
                name: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editMarketRule', 'openEditMarketRuleModal', function (_params) {
                vc.component.refreshEditMarketRuleInfo();
                $('#editMarketRuleModel').modal('show');
                vc.copyObject(_params, vc.component.editMarketRuleInfo);
            });
        },
        methods: {
            editMarketRuleValidate: function () {
                return vc.validate.validate({
                    editMarketRuleInfo: vc.component.editMarketRuleInfo
                }, {
                    'editMarketRuleInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "名称不能超过64"
                        },
                    ],
                    'editMarketRuleInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注'不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注'不能超过512"
                        },
                    ],
                    'editMarketRuleInfo.ruleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editMarketRule: function () {
                if (!vc.component.editMarketRuleValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/marketRule.updateMarketRule',
                    JSON.stringify(vc.component.editMarketRuleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMarketRuleModel').modal('hide');
                            vc.emit('marketRuleManage', 'listMarketRule', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshEditMarketRuleInfo: function () {
                vc.component.editMarketRuleInfo = {
                    ruleId: '',
                    name: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
