(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            marketRuleInfo: {
                curMarketRule: {},
                tabName: 'marketRuleWay'
            },
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('marketRule', 'switchMarketRule', function(_param) {
                $that.marketRuleInfo.curMarketRule = _param;
                $that._changeMarketRuleTab('marketRuleWay');
            })
        },
        methods: {
            _changeMarketRuleTab: function(_tabName) {
                $that.marketRuleInfo.tabName = _tabName;
                if (_tabName == 'marketRuleWay') {
                    vc.emit('marketRuleWayInfo', 'openMarketRuleWay', { ruleId: $that.marketRuleInfo.curMarketRule.ruleId });
                }
                if (_tabName == 'marketRuleCommunity') {
                    vc.emit('marketRuleCommunityInfo', 'openMarketRuleCommunity', { ruleId: $that.marketRuleInfo.curMarketRule.ruleId });
                }
                if (_tabName == 'staff') {
                    vc.emit('roleStaffInfo', 'openMarketRuleStaff', { ruleId: $that.marketRuleInfo.curMarketRule.ruleId });
                }
            }
        },
    });
})(window.vc);