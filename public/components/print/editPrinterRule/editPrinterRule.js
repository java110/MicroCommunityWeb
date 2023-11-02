(function (vc, vm) {
    vc.extends({
        data: {
            editPrinterRuleInfo: {
                ruleId: '',
                ruleName: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editPrinterRule', 'openEditPrinterRuleModal', function (_params) {
                vc.component.refreshEditPrinterRuleInfo();
                $('#editPrinterRuleModel').modal('show');
                vc.copyObject(_params, vc.component.editPrinterRuleInfo);
                vc.component.editPrinterRuleInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editPrinterRuleValidate: function () {
                return vc.validate.validate({
                    editPrinterRuleInfo: vc.component.editPrinterRuleInfo
                }, {
                    'editPrinterRuleInfo.ruleName': [
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
                    'editPrinterRuleInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        }
                    ],
                    'editPrinterRuleInfo.ruleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }
                    ]
                });
            },
            editPrinterRule: function () {
                if (!vc.component.editPrinterRuleValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/printer.updatePrinterRule',
                    JSON.stringify(vc.component.editPrinterRuleInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editPrinterRuleModel').modal('hide');
                            vc.emit('printerRuleManage', 'listPrinterRule', {});
                            vc.toast("修改成功");
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
            refreshEditPrinterRuleInfo: function () {
                vc.component.editPrinterRuleInfo = {
                    ruleId: '',
                    ruleName: '',
                    remark: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);