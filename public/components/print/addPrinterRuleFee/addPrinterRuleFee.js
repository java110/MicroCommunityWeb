(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addPrinterRuleFeeInfo: {
                prfId: '',
                ruleId: '',
                feeId: '',
                feeConfigs: []

            }
        },
        _initMethod: function() {


        },
        _initEvent: function() {
            vc.on('addPrinterRuleFee', 'openAddPrinterRuleFeeModal', function(_param) {
                vc.copyObject(_param, $that.addPrinterRuleFeeInfo);
                $that._listAddPrinterConfigFees();
                $('#addPrinterRuleFeeModel').modal('show');
            });
        },
        methods: {

            addPrinterRuleFeeValidate() {
                return vc.validate.validate({
                    addPrinterRuleFeeInfo: vc.component.addPrinterRuleFeeInfo
                }, {
                    'addPrinterRuleFeeInfo.ruleId': [{
                            limit: "required",
                            param: "",
                            errInfo: "规则ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "规则ID不能超过30"
                        },
                    ],
                    'addPrinterRuleFeeInfo.feeId': [{
                            limit: "required",
                            param: "",
                            errInfo: "费用不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "费用不能超过64"
                        },
                    ],
                });
            },
            savePrinterRuleFeeInfo: function() {
                if (!vc.component.addPrinterRuleFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addPrinterRuleFeeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/printer.savePrinterRuleFee',
                    JSON.stringify(vc.component.addPrinterRuleFeeInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addPrinterRuleFeeModel').modal('hide');
                            vc.component.clearAddPrinterRuleFeeInfo();
                            vc.emit('printerRuleFeeManage', 'listPrinterRuleFee', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddPrinterRuleFeeInfo: function() {
                vc.component.addPrinterRuleFeeInfo = {
                    prfId: '',
                    ruleId: '',
                    feeId: '',
                    feeConfigs: []
    
                };
            },
            _listAddPrinterConfigFees: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs',
                    param,
                    function(json, res) {
                        var _printerPropertyPoolManageInfo = JSON.parse(json);
                        vc.component.addPrinterRuleFeeInfo.feeConfigs = _printerPropertyPoolManageInfo.feeConfigs;

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);