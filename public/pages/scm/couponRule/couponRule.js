(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            couponRuleInfo: {
                curCouponRule: {},
                tabName: 'couponRuleWay'
            },
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('couponRule', 'switchCouponRule', function(_param) {
                $that.couponRuleInfo.curCouponRule = _param;
                $that._changeCouponRuleTab('couponRuleWay');
            })
        },
        methods: {
            _changeCouponRuleTab: function(_tabName) {
                $that.couponRuleInfo.tabName = _tabName;
                if (_tabName == 'couponRuleCpps') {
                    vc.emit('couponRuleWayInfo', 'openCouponRuleWay', { ruleId: $that.couponRuleInfo.curCouponRule.ruleId });
                }
                if (_tabName == 'couponRuleFee') {
                    vc.emit('couponRuleCommunityInfo', 'openCouponRuleCommunity', { ruleId: $that.couponRuleInfo.curCouponRule.ruleId });
                }
            }
        },
    });
})(window.vc);