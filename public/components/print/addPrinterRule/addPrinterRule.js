(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addPrinterRuleInfo: {
                ruleName: '',
                remark: '',
                state: '1001'
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addPrinterRule', 'openAddPrinterRuleModal', function() {
                $('#addPrinterRuleModel').modal('show');
            });
        },
        methods: {
            addPrinterRuleValidate() {
                return vc.validate.validate({
                    addPrinterRuleInfo: vc.component.addPrinterRuleInfo
                }, {
                    'addPrinterRuleInfo.ruleName': [{
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
                    'addPrinterRuleInfo.remark': [{
                        limit: "maxLength",
                        param: "512",
                        errInfo: "备注不能超过512"
                    }, ],
                });
            },
            savePrinterRuleInfo: function() {
                if (!vc.component.addPrinterRuleValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addPrinterRuleInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/printer.savePrinterRule',
                    JSON.stringify(vc.component.addPrinterRuleInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addPrinterRuleModel').modal('hide');
                            vc.component.clearAddPrinterRuleInfo();
                            vc.emit('printerRuleManage', 'listPrinterRule', {});
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddPrinterRuleInfo: function() {
                vc.component.addPrinterRuleInfo = {
                    ruleName: '',
                    remark: '',
                    state: '1001'
                };
            }
        }
    });

})(window.vc);