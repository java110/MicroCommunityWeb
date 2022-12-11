/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            integralRuleFeesInfo: {
                integralRuleFees: [],
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
            vc.on('integralRuleFees', 'switch', function (_data) {
                $that.integralRuleFeesInfo.conditions.ruleId = _data.ruleId;
                $that._listIntegralRuleFees(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('integralRuleFeeManage', 'listIntegralRuleFee', function (_param) {
                vc.component._listIntegralRuleFees(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('integralRuleFees', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listIntegralRuleFees(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listIntegralRuleFees: function (_page, _rows) {

                vc.component.integralRuleFeesInfo.conditions.page = _page;
                vc.component.integralRuleFeesInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.integralRuleFeesInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/integral.listIntegralRuleFee',
                    param,
                    function (json, res) {
                        var _integralRuleFeesInfo = JSON.parse(json);
                        vc.component.integralRuleFeesInfo.total = _integralRuleFeesInfo.total;
                        vc.component.integralRuleFeesInfo.records = _integralRuleFeesInfo.records;
                        vc.component.integralRuleFeesInfo.integralRuleFees = _integralRuleFeesInfo.data;
                        vc.emit('integralRuleFees', 'paginationPlus', 'init', {
                            total: vc.component.integralRuleFeesInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddIntegralRuleFeeModal: function () {
                vc.emit('addIntegralRuleFee', 'openAddIntegralRuleFeeModal', {
                    ruleId:$that.integralRuleFeesInfo.conditions.ruleId,
                });
            },
            _openEditIntegralRuleFeeModel:function(_integralRuleFee){
                vc.emit('editIntegralRuleFee','openEditIntegralRuleFeeModal',_integralRuleFee);
            },
            _openDeleteIntegralRuleFeeModel:function(_integralRuleFee){
                vc.emit('deleteIntegralRuleFee','openDeleteIntegralRuleFeeModal',_integralRuleFee);
            },
            _queryIntegralRuleCppsMethod: function () {
                vc.component._listIntegralRuleCppss(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.integralRuleFeesInfo.moreCondition) {
                    vc.component.integralRuleFeesInfo.moreCondition = false;
                } else {
                    vc.component.integralRuleFeesInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);