/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            printerRuleRepairsInfo: {
                printerRuleRepairs: [],
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
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('printerRuleRepair', 'switch', function(_data) {
                $that.printerRuleRepairsInfo.conditions.ruleId = _data.ruleId;
                $that._listPrinterRuleRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('printerRuleRepairManage', 'listPrinterRuleRepair', function(_param) {
                vc.component._listPrinterRuleRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('printerRuleRepairs', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._listPrinterRuleRepairs(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listPrinterRuleRepairs: function(_page, _rows) {

                vc.component.printerRuleRepairsInfo.conditions.page = _page;
                vc.component.printerRuleRepairsInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.printerRuleRepairsInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/printer.listPrinterRuleRepair',
                    param,
                    function(json, res) {
                        var _printerRuleRepairsInfo = JSON.parse(json);
                        vc.component.printerRuleRepairsInfo.total = _printerRuleRepairsInfo.total;
                        vc.component.printerRuleRepairsInfo.records = _printerRuleRepairsInfo.records;
                        vc.component.printerRuleRepairsInfo.printerRuleRepairs = _printerRuleRepairsInfo.data;
                        vc.emit('printerRuleRepairs', 'paginationPlus', 'init', {
                            total: vc.component.printerRuleRepairsInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddPrinterRuleRepairModal: function() {
                vc.emit('addPrinterRuleRepair', 'openAddPrinterRuleRepairModal', {
                    ruleId: $that.printerRuleRepairsInfo.conditions.ruleId,
                });
            },
            _openEditPrinterRuleRepairModel: function(_printerRuleRepair) {
                vc.emit('editPrinterRuleRepair', 'openEditPrinterRuleRepairModal', _printerRuleRepair);
            },
            _openDeletePrinterRuleRepairModel: function(_printerRuleRepair) {
                vc.emit('deletePrinterRuleRepair', 'openDeletePrinterRuleRepairModal', _printerRuleRepair);
            },
            _queryPrinterRuleRepairsMethod: function() {
                vc.component._listPrinterRuleRepairs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.printerRuleRepairsInfo.moreCondition) {
                    vc.component.printerRuleRepairsInfo.moreCondition = false;
                } else {
                    vc.component.printerRuleRepairsInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);