/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            chargeRuleFeeInfo: {
                chargeRuleFees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                textId: '',
                conditions: {
                    crcId: '',
                    ruleId: '',
                    communityId: vc.getCurrentCommunity().communityId,
                    quantity: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listChargeRuleFees(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('chargeRuleFee', 'switch', function (_data) {
                $that.chargeRuleFeeInfo.conditions.ruleId = _data.ruleId;
                $that._listChargeRuleFees(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('chargeRuleFee', 'listChargeRuleFee', function (_param) {
                vc.component._listChargeRuleFees(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('chargeRuleFee', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listChargeRuleFees(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listChargeRuleFees: function (_page, _rows) {
                vc.component.chargeRuleFeeInfo.conditions.page = _page;
                vc.component.chargeRuleFeeInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.chargeRuleFeeInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/chargeRule.listChargeRuleFee',
                    param,
                    function (json, res) {
                        var _chargeRuleFeeInfo = JSON.parse(json);
                        vc.component.chargeRuleFeeInfo.total = _chargeRuleFeeInfo.total;
                        vc.component.chargeRuleFeeInfo.records = _chargeRuleFeeInfo.records;
                        vc.component.chargeRuleFeeInfo.chargeRuleFees = _chargeRuleFeeInfo.data;
                        vc.emit('chargeRuleFee', 'paginationPlus', 'init', {
                            total: vc.component.chargeRuleFeeInfo.records,
                            dataCount: vc.component.chargeRuleFeeInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddChargeRuleFeeModal: function () {
                vc.emit('addChargeRuleFee', 'openAddChargeRuleFeeModal', {
                    ruleId: $that.chargeRuleFeeInfo.conditions.ruleId,
                });
            },
            _openEditChargeRuleFeeModel: function (_chargeRuleFee) {
                vc.emit('editChargeRuleFee', 'openEditChargeRuleFeeModal', _chargeRuleFee);
            },
            _openDeleteChargeRuleFeeModel: function (_chargeRuleFee) {
                vc.emit('deleteChargeRuleFee', 'openDeleteChargeRuleFeeModal', _chargeRuleFee);
            },
            _queryChargeRuleFeeMethod: function () {
                vc.component._listChargeRuleFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.chargeRuleFeeInfo.moreCondition) {
                    vc.component.chargeRuleFeeInfo.moreCondition = false;
                } else {
                    vc.component.chargeRuleFeeInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);