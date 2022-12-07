/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            machineTranslateManageInfo: {
                machineTranslates: [],
                total: 0,
                records: 1,
                moreCondition: false,
                machineName: '',
                typeCds: [],
                conditions: {
                    machineCode: '',
                    typeCd: '',
                    objName: '',
                    objId: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.getDict('machine_translate', "type_cd", function (_data) {
                vc.component.machineTranslateManageInfo.typeCds = _data;
            });
            vc.component._listMachineTranslates(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('machineTranslateManage', 'listMachineTranslate', function (_param) {
                vc.component._listMachineTranslates(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMachineTranslates(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMachineTranslates: function (_page, _rows) {
                vc.component.machineTranslateManageInfo.conditions.page = _page;
                vc.component.machineTranslateManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.machineTranslateManageInfo.conditions
                };
                param.params.machineCode = param.params.machineCode.trim();
                param.params.objId = param.params.objId.trim();
                param.params.objName = param.params.objName.trim();
                //发送get请求
                vc.http.apiGet('/machineTranslate.listMachineTranslates',
                    param,
                    function (json, res) {
                        var _machineTranslateManageInfo = JSON.parse(json);
                        vc.component.machineTranslateManageInfo.total = _machineTranslateManageInfo.total;
                        vc.component.machineTranslateManageInfo.records = _machineTranslateManageInfo.records;
                        vc.component.machineTranslateManageInfo.machineTranslates = _machineTranslateManageInfo.machineTranslates;
                        vc.emit('pagination', 'init', {
                            total: vc.component.machineTranslateManageInfo.records,
                            dataCount: vc.component.machineTranslateManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMachineTranslateModal: function () {
                vc.emit('addMachineTranslate', 'openAddMachineTranslateModal', {});
            },
            _openEditMachineTranslateModel: function (_machineTranslate) {
                vc.emit('editMachineTranslate', 'openEditMachineTranslateModal', _machineTranslate);
            },
            _openDeleteMachineTranslateModel: function (_machineTranslate) {
                vc.emit('deleteMachineTranslate', 'openDeleteMachineTranslateModal', _machineTranslate);
            },
            //查询
            _queryMachineTranslateMethod: function () {
                vc.component._listMachineTranslates(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMachineTranslateMethod: function () {
                vc.component.machineTranslateManageInfo.conditions.machineCode = "";
                vc.component.machineTranslateManageInfo.conditions.typeCd = "";
                vc.component.machineTranslateManageInfo.conditions.objName = "";
                vc.component.machineTranslateManageInfo.conditions.objId = "";
                vc.component._listMachineTranslates(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.machineTranslateManageInfo.moreCondition) {
                    vc.component.machineTranslateManageInfo.moreCondition = false;
                } else {
                    vc.component.machineTranslateManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
