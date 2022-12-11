/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            integralRuleDivInfo: {
                integralRules: [],
                ruleId: '',
                curIntegralRule: {}
            }
        },
        _initMethod: function () {
            $that._listIntegralRules();
        },
        _initEvent: function () {
            vc.on('integralRuleManage', 'listIntegralRule', function (_param) {
                $that._listIntegralRules();
            });
        },
        methods: {
            _listIntegralRules: function () {

                let param = {
                    params: {
                        page:1,
                        row:100,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/integral.listIntegralRule',
                    param,
                    function (json, res) {
                        let _integralRuleManageInfo = JSON.parse(json);
                        $that.integralRuleDivInfo.total = _integralRuleManageInfo.total;
                        $that.integralRuleDivInfo.records = _integralRuleManageInfo.records;
                        $that.integralRuleDivInfo.integralRules = _integralRuleManageInfo.data;
                        if($that.integralRuleDivInfo.integralRules && $that.integralRuleDivInfo.integralRules.length>0){
                            $that._switchIntegralRule($that.integralRuleDivInfo.integralRules[0])
                        }
                        
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddIntegralRuleModal: function () {
                vc.emit('addIntegralRule', 'openAddIntegralRuleModal', {});
            },
            _openEditIntegralRuleModel: function () {
                if (!$that.integralRuleDivInfo.curIntegralRule) {
                    vc.toast('未选择营销规则');
                    return;
                }
                vc.emit('editIntegralRule', 'openEditIntegralRuleModal', $that.integralRuleDivInfo.curIntegralRule);
            },
            _openDeleteIntegralRuleModel: function () {
                if (!$that.integralRuleDivInfo.curIntegralRule) {
                    vc.toast('未选择营销规则');
                    return;
                }
                vc.emit('deleteIntegralRule', 'openDeleteIntegralRuleModal', $that.integralRuleDivInfo.curIntegralRule);
            },
            _switchIntegralRule: function (_integralRule) {
                $that.integralRuleDivInfo.curIntegralRule = _integralRule;
                vc.emit('integralRule', 'switchIntegralRule', _integralRule);
            },
        }
    });
})(window.vc);