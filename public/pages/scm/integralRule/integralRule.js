(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            integralRuleInfo: {
                curIntegralRule: {},
                tabName: 'integralRuleConfig'
            },
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('integralRule', 'switchIntegralRule', function(_param) {
                $that.integralRuleInfo.curIntegralRule = _param;
                $that._changeIntegralRuleTab('integralRuleConfig');
            })
        },
        methods: {
            _changeIntegralRuleTab: function(_tabName) {
                $that.integralRuleInfo.tabName = _tabName;
                if (_tabName == 'integralRuleConfig') {
                    vc.emit('integralRuleConfig', 'switch', { ruleId: $that.integralRuleInfo.curIntegralRule.ruleId });
                }
                if (_tabName == 'integralRuleFee') {
                    vc.emit('integralRuleFees', 'switch', { ruleId: $that.integralRuleInfo.curIntegralRule.ruleId });
                }
            }
        },
    });
})(window.vc);