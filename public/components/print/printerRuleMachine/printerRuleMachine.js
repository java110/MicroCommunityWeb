/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            printerRuleMachineInfo: {
                printerRuleMachines: [],
                total: 0,
                records: 1,
                moreCondition: false,
                textId: '',
                conditions: {
                    crcId: '',
                    ruleId: '',
                    cppId: '',
                    communityId: vc.getCurrentCommunity().communityId,
                    quantity: '',

                }
            }
        },
        _initMethod: function() {
            vc.component._listPrinterRuleMachines(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('printerRuleMachine', 'switch', function(_data) {
                $that.printerRuleMachineInfo.conditions.ruleId = _data.ruleId;
                $that._listPrinterRuleMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('printerRuleMachineManage', 'listPrinterRuleMachine', function(_param) {
                vc.component._listPrinterRuleMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('printerRuleMachine', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._listPrinterRuleMachines(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listPrinterRuleMachines: function(_page, _rows) {

                vc.component.printerRuleMachineInfo.conditions.page = _page;
                vc.component.printerRuleMachineInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.printerRuleMachineInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/printer.listPrinterRuleMachine',
                    param,
                    function(json, res) {
                        var _printerRuleMachineInfo = JSON.parse(json);
                        vc.component.printerRuleMachineInfo.total = _printerRuleMachineInfo.total;
                        vc.component.printerRuleMachineInfo.records = _printerRuleMachineInfo.records;
                        vc.component.printerRuleMachineInfo.printerRuleMachines = _printerRuleMachineInfo.data;
                        vc.emit('printerRuleMachine', 'paginationPlus', 'init', {
                            total: vc.component.printerRuleMachineInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddPrinterRuleMachineModal: function() {
                vc.emit('addPrinterRuleMachine', 'openAddPrinterRuleMachineModal', {
                    ruleId: $that.printerRuleMachineInfo.conditions.ruleId,
                });
            },
            _openEditPrinterRuleMachineModel: function(_printerRuleMachine) {
                vc.emit('editPrinterRuleMachine', 'openEditPrinterRuleMachineModal', _printerRuleMachine);
            },
            _openDeletePrinterRuleMachineModel: function(_printerRuleMachine) {
                vc.emit('deletePrinterRuleMachine', 'openDeletePrinterRuleMachineModal', _printerRuleMachine);
            },
            _queryPrinterRuleMachineMethod: function() {
                vc.component._listPrinterRuleMachines(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.printerRuleMachineInfo.moreCondition) {
                    vc.component.printerRuleMachineInfo.moreCondition = false;
                } else {
                    vc.component.printerRuleMachineInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);