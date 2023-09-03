/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            machineRecordManageInfo: {
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
        _initMethod: function() {
            vc.component._listMachineRecords(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('machineRecordManage', 'listMachineRecord', function(_param) {
                vc.component._listMachineRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listMachineRecords(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMachineRecords: function(_page, _rows) {
                vc.component.machineRecordManageInfo.conditions.page = _page;
                vc.component.machineRecordManageInfo.conditions.row = _rows;
                vc.component.machineRecordManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.machineRecordManageInfo.conditions
                };
                param.params.name = param.params.name.trim();
                param.params.tel = param.params.tel.trim();
                param.params.machineCode = param.params.machineCode.trim();
                param.params.machineName = param.params.machineName.trim();
                //发送get请求
                vc.http.apiGet('/machineRecord.listMachineRecords',
                    param,
                    function(json, res) {
                        var _machineRecordManageInfo = JSON.parse(json);
                        vc.component.machineRecordManageInfo.total = _machineRecordManageInfo.total;
                        vc.component.machineRecordManageInfo.records = _machineRecordManageInfo.records;
                        vc.component.machineRecordManageInfo.machineRecords = _machineRecordManageInfo.machineRecords;
                        vc.emit('pagination', 'init', {
                            total: vc.component.machineRecordManageInfo.records,
                            dataCount: vc.component.machineRecordManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryMachineRecordMethod: function() {
                vc.component._listMachineRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMachineRecordMethod: function() {
                vc.component.machineRecordManageInfo.conditions.name = "";
                vc.component.machineRecordManageInfo.conditions.openTypeCd = "";
                vc.component.machineRecordManageInfo.conditions.tel = "";
                vc.component.machineRecordManageInfo.conditions.ownerTypeCd = "";
                vc.component.machineRecordManageInfo.conditions.machineName = "";
                vc.component.machineRecordManageInfo.conditions.machineCode = "";
                vc.component._listMachineRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openMachineRecordDetailModel: function(_machineRecord) {
                vc.emit('machineRecordDetail', 'openMachineRecordDetailModal', _machineRecord);
            },
            _moreCondition: function() {
                if (vc.component.machineRecordManageInfo.moreCondition) {
                    vc.component.machineRecordManageInfo.moreCondition = false;
                } else {
                    vc.component.machineRecordManageInfo.moreCondition = true;
                }
            },
            _viewOwnerFace: function(_url) {
                vc.emit('viewImage', 'showImage', {
                    url: _url
                });
            },
        }
    });
})(window.vc);