/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            chargeRuleDivInfo: {
                chargeRules: [],
                ruleId: '',
                curChargeRule: {}
            }
        },
        _initMethod: function () {
            $that._listChargeRules();
        },
        _initEvent: function () {
            vc.on('chargeRuleManage', 'listChargeRule', function (_param) {
                $that._listChargeRules();
            });
        },
        methods: {
            _listChargeRules: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/chargeRule.listChargeRule',
                    param,
                    function (json, res) {
                        let _chargeRuleManageInfo = JSON.parse(json);
                        $that.chargeRuleDivInfo.total = _chargeRuleManageInfo.total;
                        $that.chargeRuleDivInfo.records = _chargeRuleManageInfo.records;
                        $that.chargeRuleDivInfo.chargeRules = _chargeRuleManageInfo.data;
                        if ($that.chargeRuleDivInfo.chargeRules && $that.chargeRuleDivInfo.chargeRules.length > 0) {
                            $that._switchChargeRule($that.chargeRuleDivInfo.chargeRules[0])
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddChargeRuleModal: function () {
                vc.emit('addChargeRule', 'openAddChargeRuleModal', {});
            },
            _openEditChargeRuleModel: function () {
                if (!$that.chargeRuleDivInfo.curChargeRule) {
                    vc.toast('未选择规则');
                    return;
                }
                vc.emit('editChargeRule', 'openEditChargeRuleModal', $that.chargeRuleDivInfo.curChargeRule);
            },
            _openDeleteChargeRuleModel: function () {
                if (!$that.chargeRuleDivInfo.curChargeRule) {
                    vc.toast('未选择规则');
                    return;
                }
                vc.emit('deleteChargeRule', 'openDeleteChargeRuleModal', $that.chargeRuleDivInfo.curChargeRule);
            },
            _switchChargeRule: function (_chargeRule) {
                $that.chargeRuleDivInfo.curChargeRule = _chargeRule;
                vc.emit('chargeRule', 'switchChargeRule', _chargeRule);
            },
        }
    });
})(window.vc);