(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            chargeRuleInfo: {
                curChargeRule: {},
                tabName: 'chargeRuleConfig'
            },
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('chargeRule', 'switchChargeRule', function (_param) {
                $that.chargeRuleInfo.curChargeRule = _param;
                $that._changeChargeRuleTab('chargeRuleConfig');
            })
        },
        methods: {
            _changeChargeRuleTab: function (_tabName) {
                $that.chargeRuleInfo.tabName = _tabName;
                vc.emit('chargeRuleFee', 'switch', {ruleId: $that.chargeRuleInfo.curChargeRule.ruleId});
            }
        },
    });
})(window.vc);