/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        data: {
            printerRuleDivInfo: {
                printerRules: [],
                ruleId: '',
                curPrinterRule: {}
            }
        },
        _initMethod: function() {
            $that._listPrinterRules();
        },
        _initEvent: function() {
            vc.on('printerRuleManage', 'listPrinterRule', function(_param) {
                $that._listPrinterRules();
            });
        },
        methods: {
            _listPrinterRules: function() {

                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/printer.listPrinterRule',
                    param,
                    function(json, res) {
                        let _printerRuleManageInfo = JSON.parse(json);
                        $that.printerRuleDivInfo.total = _printerRuleManageInfo.total;
                        $that.printerRuleDivInfo.records = _printerRuleManageInfo.records;
                        $that.printerRuleDivInfo.printerRules = _printerRuleManageInfo.data;
                        if ($that.printerRuleDivInfo.printerRules && $that.printerRuleDivInfo.printerRules.length > 0) {
                            $that._switchPrinterRule($that.printerRuleDivInfo.printerRules[0])
                        }

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddPrinterRuleModal: function() {
                vc.emit('addPrinterRule', 'openAddPrinterRuleModal', {});
            },
            _openEditPrinterRuleModel: function() {
                if (!$that.printerRuleDivInfo.curPrinterRule) {
                    vc.toast('未选择营销规则');
                    return;
                }
                vc.emit('editPrinterRule', 'openEditPrinterRuleModal', $that.printerRuleDivInfo.curPrinterRule);
            },
            _openDeletePrinterRuleModel: function() {
                if (!$that.printerRuleDivInfo.curPrinterRule) {
                    vc.toast('未选择营销规则');
                    return;
                }
                vc.emit('deletePrinterRule', 'openDeletePrinterRuleModal', $that.printerRuleDivInfo.curPrinterRule);
            },
            _switchPrinterRule: function(_printerRule) {
                $that.printerRuleDivInfo.curPrinterRule = _printerRule;
                vc.emit('printerRule', 'switchPrinterRule', _printerRule);
            },
        }
    });
})(window.vc);