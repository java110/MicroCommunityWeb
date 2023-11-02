(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            printerRuleInfo: {
                curPrinterRule: {},
                tabName: 'printerRuleMachine'
            },
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('printerRule', 'switchPrinterRule', function (_param) {
                $that.printerRuleInfo.curPrinterRule = _param;
                $that._changePrinterRuleTab('printerRuleMachine');
            })
        },
        methods: {
            _changePrinterRuleTab: function (_tabName) {
                $that.printerRuleInfo.tabName = _tabName;
                if (_tabName == 'printerRuleMachine') {
                    vc.emit('printerRuleMachine', 'switch', {ruleId: $that.printerRuleInfo.curPrinterRule.ruleId});
                }
                if (_tabName == 'printerRuleFees') {
                    vc.emit('printerRuleFees', 'switch', {ruleId: $that.printerRuleInfo.curPrinterRule.ruleId});
                }
                if (_tabName == 'printerRuleRepair') {
                    vc.emit('printerRuleRepair', 'switch', {ruleId: $that.printerRuleInfo.curPrinterRule.ruleId});
                }
            }
        },
    });
})(window.vc);