/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            machineVistorPhotoManageInfo: {
                machineRecords: [],
                total: 0,
                records: 1,
                moreCondition: false,
                name: '',
                conditions: {
                    name: '',
                    openTypeCd: '',
                    tel: '',
                    ownerTypeCd: '',
                    machineName: '',
                    machineCode: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listMachineRecords(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('machineVistorPhotoManage', 'listMachineRecord', function (_param) {
                vc.component._listMachineRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMachineRecords(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMachineRecords: function (_page, _rows) {
                vc.component.machineVistorPhotoManageInfo.conditions.page = _page;
                vc.component.machineVistorPhotoManageInfo.conditions.row = _rows;
                vc.component.machineVistorPhotoManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.machineVistorPhotoManageInfo.conditions
                };
                param.params.name = param.params.name.trim();
                param.params.tel = param.params.tel.trim();
                param.params.machineCode = param.params.machineCode.trim();
                param.params.machineName = param.params.machineName.trim();
                //发送get请求
                vc.http.apiGet('/machineRecord.listMachineRecords',
                    param,
                    function (json, res) {
                        var _machineVistorPhotoManageInfo = JSON.parse(json);
                        vc.component.machineVistorPhotoManageInfo.total = _machineVistorPhotoManageInfo.total;
                        vc.component.machineVistorPhotoManageInfo.records = _machineVistorPhotoManageInfo.records;
                        vc.component.machineVistorPhotoManageInfo.machineRecords = _machineVistorPhotoManageInfo.machineRecords;
                        vc.emit('pagination', 'init', {
                            total: vc.component.machineVistorPhotoManageInfo.records,
                            dataCount: vc.component.machineVistorPhotoManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryMachineRecordMethod: function () {
                vc.component._listMachineRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMachineRecordMethod: function () {
                vc.component.machineVistorPhotoManageInfo.conditions.name = "";
                vc.component.machineVistorPhotoManageInfo.conditions.openTypeCd = "";
                vc.component.machineVistorPhotoManageInfo.conditions.tel = "";
                vc.component.machineVistorPhotoManageInfo.conditions.ownerTypeCd = "";
                vc.component.machineVistorPhotoManageInfo.conditions.machineName = "";
                vc.component.machineVistorPhotoManageInfo.conditions.machineCode = "";
                vc.component._listMachineRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openMachineRecordDetailModel: function (_machineRecord) {
                vc.emit('machineRecordDetail', 'openMachineRecordDetailModal', _machineRecord);
            },
            _moreCondition: function () {
                if (vc.component.machineVistorPhotoManageInfo.moreCondition) {
                    vc.component.machineVistorPhotoManageInfo.moreCondition = false;
                } else {
                    vc.component.machineVistorPhotoManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);