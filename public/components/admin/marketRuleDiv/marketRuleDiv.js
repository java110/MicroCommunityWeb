/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            marketRuleDivInfo: {
                marketRules: [],
                ruleId: '',
                curMarketRule: {}
            }
        },
        _initMethod: function () {
            $that._listMarketRules();
        },
        _initEvent: function () {
            vc.on('marketRuleManage', 'listMarketRule', function (_param) {
                $that._listMarketRules();
            });
        },
        methods: {
            _listMarketRules: function () {

                let param = {
                    params: {
                        page:1,
                        row:100
                    }
                };
                //发送get请求
                vc.http.apiGet('/marketRule.listMarketRule',
                    param,
                    function (json, res) {
                        let _marketRuleManageInfo = JSON.parse(json);
                        $that.marketRuleDivInfo.total = _marketRuleManageInfo.total;
                        $that.marketRuleDivInfo.records = _marketRuleManageInfo.records;
                        $that.marketRuleDivInfo.marketRules = _marketRuleManageInfo.data;
                        if($that.marketRuleDivInfo.marketRules && $that.marketRuleDivInfo.marketRules.length>0){
                            $that._switchMarketRule($that.marketRuleDivInfo.marketRules[0])
                        }
                        
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMarketRuleModal: function () {
                vc.emit('addMarketRule', 'openAddMarketRuleModal', {});
            },
            _openEditMarketRuleModel: function () {
                if (!$that.marketRuleDivInfo.curMarketRule) {
                    vc.toast('未选择营销规则');
                    return;
                }
                vc.emit('editMarketRule', 'openEditMarketRuleModal', $that.marketRuleDivInfo.curMarketRule);
            },
            _openDeleteMarketRuleModel: function () {
                if (!$that.marketRuleDivInfo.curMarketRule) {
                    vc.toast('未选择营销规则');
                    return;
                }
                vc.emit('deleteMarketRule', 'openDeleteMarketRuleModal', $that.marketRuleDivInfo.curMarketRule);
            },
            _switchMarketRule: function (_marketRule) {
                $that.marketRuleDivInfo.curMarketRule = _marketRule;
                vc.emit('marketRule', 'switchMarketRule', _marketRule);
            },
        }
    });
})(window.vc);