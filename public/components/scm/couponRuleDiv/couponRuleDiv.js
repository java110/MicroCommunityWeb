/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            couponRuleDivInfo: {
                couponRules: [],
                ruleId: '',
                curCouponRule: {}
            }
        },
        _initMethod: function () {
            $that._listCouponRules();
        },
        _initEvent: function () {
            vc.on('couponRuleManage', 'listCouponRule', function (_param) {
                $that._listCouponRules();
            });
        },
        methods: {
            _listCouponRules: function () {

                let param = {
                    params: {
                        page:1,
                        row:100,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/couponRule.listCouponRule',
                    param,
                    function (json, res) {
                        let _couponRuleManageInfo = JSON.parse(json);
                        $that.couponRuleDivInfo.total = _couponRuleManageInfo.total;
                        $that.couponRuleDivInfo.records = _couponRuleManageInfo.records;
                        $that.couponRuleDivInfo.couponRules = _couponRuleManageInfo.data;
                        if($that.couponRuleDivInfo.couponRules && $that.couponRuleDivInfo.couponRules.length>0){
                            $that._switchCouponRule($that.couponRuleDivInfo.couponRules[0])
                        }
                        
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddCouponRuleModal: function () {
                vc.emit('addCouponRule', 'openAddCouponRuleModal', {});
            },
            _openEditCouponRuleModel: function () {
                if (!$that.couponRuleDivInfo.curCouponRule) {
                    vc.toast('未选择营销规则');
                    return;
                }
                vc.emit('editCouponRule', 'openEditCouponRuleModal', $that.couponRuleDivInfo.curCouponRule);
            },
            _openDeleteCouponRuleModel: function () {
                if (!$that.couponRuleDivInfo.curCouponRule) {
                    vc.toast('未选择营销规则');
                    return;
                }
                vc.emit('deleteCouponRule', 'openDeleteCouponRuleModal', $that.couponRuleDivInfo.curCouponRule);
            },
            _switchCouponRule: function (_couponRule) {
                $that.couponRuleDivInfo.curCouponRule = _couponRule;
                vc.emit('couponRule', 'switchCouponRule', _couponRule);
            },
        }
    });
})(window.vc);