/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            machinePrinterManageInfo: {
                machinePrinters: [],
                total: 0,
                records: 1,
                moreCondition: false,
                machineId: '',
                conditions: {
                    machineId: '',
                    machineName: '',
                    machineCode: '',
                    implBean: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listMachinePrinters(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('machinePrinterManage', 'listMachinePrinter', function (_param) {
                vc.component._listMachinePrinters(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMachinePrinters(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMachinePrinters: function (_page, _rows) {
                vc.component.machinePrinterManageInfo.conditions.page = _page;
                vc.component.machinePrinterManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.machinePrinterManageInfo.conditions
                };
                param.params.machineName = param.params.machineName.trim();
                param.params.machineCode = param.params.machineCode.trim();
                //发送get请求
                vc.http.apiGet('/printer.listMachinePrinter',
                    param,
                    function (json, res) {
                        var _machinePrinterManageInfo = JSON.parse(json);
                        vc.component.machinePrinterManageInfo.total = _machinePrinterManageInfo.total;
                        vc.component.machinePrinterManageInfo.records = _machinePrinterManageInfo.records;
                        vc.component.machinePrinterManageInfo.machinePrinters = _machinePrinterManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.machinePrinterManageInfo.records,
                            dataCount: vc.component.machinePrinterManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMachinePrinterModal: function () {
                vc.emit('addMachinePrinter', 'openAddMachinePrinterModal', {});
            },
            _openEditMachinePrinterModel: function (_machinePrinter) {
                vc.emit('editMachinePrinter', 'openEditMachinePrinterModal', _machinePrinter);
            },
            _openDeleteMachinePrinterModel: function (_machinePrinter) {
                vc.emit('deleteMachinePrinter', 'openDeleteMachinePrinterModal', _machinePrinter);
            },
            //查询
            _queryMachinePrinterMethod: function () {
                vc.component._listMachinePrinters(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMachinePrinterMethod: function () {
                vc.component.machinePrinterManageInfo.conditions.machineName = "";
                vc.component.machinePrinterManageInfo.conditions.machineCode = "";
                vc.component._listMachinePrinters(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.machinePrinterManageInfo.moreCondition) {
                    vc.component.machinePrinterManageInfo.moreCondition = false;
                } else {
                    vc.component.machinePrinterManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);