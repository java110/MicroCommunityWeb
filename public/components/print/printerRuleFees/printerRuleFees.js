/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            printerRuleFeesInfo: {
                printerRuleFees: [],
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
            vc.on('printerRuleFees', 'switch', function (_data) {
                $that.printerRuleFeesInfo.conditions.ruleId = _data.ruleId;
                $that._listPrinterRuleFees(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('printerRuleFeeManage', 'listPrinterRuleFee', function (_param) {
                vc.component._listPrinterRuleFees(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('printerRuleFees', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listPrinterRuleFees(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listPrinterRuleFees: function (_page, _rows) {
                vc.component.printerRuleFeesInfo.conditions.page = _page;
                vc.component.printerRuleFeesInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.printerRuleFeesInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/printer.listPrinterRuleFee',
                    param,
                    function (json, res) {
                        var _printerRuleFeesInfo = JSON.parse(json);
                        vc.component.printerRuleFeesInfo.total = _printerRuleFeesInfo.total;
                        vc.component.printerRuleFeesInfo.records = _printerRuleFeesInfo.records;
                        vc.component.printerRuleFeesInfo.printerRuleFees = _printerRuleFeesInfo.data;
                        vc.emit('printerRuleFees', 'paginationPlus', 'init', {
                            total: vc.component.printerRuleFeesInfo.records,
                            dataCount: vc.component.printerRuleFeesInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddPrinterRuleFeeModal: function () {
                vc.emit('addPrinterRuleFee', 'openAddPrinterRuleFeeModal', {
                    ruleId: $that.printerRuleFeesInfo.conditions.ruleId,
                });
            },
            _openEditPrinterRuleFeeModel: function (_printerRuleFee) {
                vc.emit('editPrinterRuleFee', 'openEditPrinterRuleFeeModal', _printerRuleFee);
            },
            _openDeletePrinterRuleFeeModel: function (_printerRuleFee) {
                vc.emit('deletePrinterRuleFee', 'openDeletePrinterRuleFeeModal', _printerRuleFee);
            },
            _queryPrinterRuleFeesMethod: function () {
                vc.component._listPrinterRuleCppss(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.printerRuleFeesInfo.moreCondition) {
                    vc.component.printerRuleFeesInfo.moreCondition = false;
                } else {
                    vc.component.printerRuleFeesInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);