/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            couponRuleFeesInfo: {
                couponRuleFees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                textId: '',
                conditions: {
                    ruleId: '',
                    communityId: vc.getCurrentCommunity().communityId,
                }
            }
        },
        _initMethod: function () {
            
        },
        _initEvent: function () {
            vc.on('couponRuleFees', 'switch', function (_data) {
                $that.couponRuleFeesInfo.conditions.ruleId = _data.ruleId;
                $that._listCouponRuleFees(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('couponRuleFeeManage', 'listCouponRuleFee', function (_param) {
                vc.component._listCouponRuleFees(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('couponRuleFees', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listCouponRuleFees(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listCouponRuleFees: function (_page, _rows) {

                vc.component.couponRuleFeesInfo.conditions.page = _page;
                vc.component.couponRuleFeesInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.couponRuleFeesInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/couponRule.listCouponRuleFee',
                    param,
                    function (json, res) {
                        var _couponRuleFeesInfo = JSON.parse(json);
                        vc.component.couponRuleFeesInfo.total = _couponRuleFeesInfo.total;
                        vc.component.couponRuleFeesInfo.records = _couponRuleFeesInfo.records;
                        vc.component.couponRuleFeesInfo.couponRuleFees = _couponRuleFeesInfo.data;
                        vc.emit('couponRuleFees', 'paginationPlus', 'init', {
                            total: vc.component.couponRuleFeesInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddCouponRuleFeeModal: function () {
                vc.emit('addCouponRuleFee', 'openAddCouponRuleFeeModal', {
                    ruleId:$that.couponRuleFeesInfo.conditions.ruleId,
                });
            },
            _openEditCouponRuleFeeModel:function(_couponRuleFee){
                vc.emit('editCouponRuleFee','openEditCouponRuleFeeModal',_couponRuleFee);
            },
            _openDeleteCouponRuleFeeModel:function(_couponRuleFee){
                vc.emit('deleteCouponRuleFee','openDeleteCouponRuleFeeModal',_couponRuleFee);
            },
            _queryCouponRuleCppsMethod: function () {
                vc.component._listCouponRuleCppss(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.couponRuleFeesInfo.moreCondition) {
                    vc.component.couponRuleFeesInfo.moreCondition = false;
                } else {
                    vc.component.couponRuleFeesInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);