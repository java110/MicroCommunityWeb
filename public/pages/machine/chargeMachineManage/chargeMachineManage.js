/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            chargeMachineManageInfo: {
                chargeMachines: [],
                total: 0,
                records: 1,
                moreCondition: false,
                machineId: '',
                conditions: {
                    machineName: '',
                    machineCode: '',
                    implBean: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            vc.component._listChargeMachines(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('chargeMachineManage', 'listChargeMachine', function(_param) {
                vc.component._listChargeMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listChargeMachines(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listChargeMachines: function(_page, _rows) {

                vc.component.chargeMachineManageInfo.conditions.page = _page;
                vc.component.chargeMachineManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.chargeMachineManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/chargeMachine.listChargeMachine',
                    param,
                    function(json, res) {
                        var _chargeMachineManageInfo = JSON.parse(json);
                        vc.component.chargeMachineManageInfo.total = _chargeMachineManageInfo.total;
                        vc.component.chargeMachineManageInfo.records = _chargeMachineManageInfo.records;
                        vc.component.chargeMachineManageInfo.chargeMachines = _chargeMachineManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.chargeMachineManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddChargeMachineModal: function() {
                vc.emit('addChargeMachine', 'openAddChargeMachineModal', {});
            },
            _openEditChargeMachineModel: function(_chargeMachine) {
                vc.emit('editChargeMachine', 'openEditChargeMachineModal', _chargeMachine);
            },
            _openDeleteChargeMachineModel: function(_chargeMachine) {
                vc.emit('deleteChargeMachine', 'openDeleteChargeMachineModal', _chargeMachine);
            },
            _queryChargeMachineMethod: function() {
                vc.component._listChargeMachines(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.chargeMachineManageInfo.moreCondition) {
                    vc.component.chargeMachineManageInfo.moreCondition = false;
                } else {
                    vc.component.chargeMachineManageInfo.moreCondition = true;
                }
            },
            _viewPort: function(_chargeMachine) {
                vc.jumpToPage('/#/pages/machine/chargeMachinePortManage?machineId=' + _chargeMachine.machineId);
            },
            _chargeMachineQrCode: function(_chargeMachine) {
                vc.emit('chargeMachineQrCode', 'openChargeMachineQrCodeModal', _chargeMachine);
            }


        }
    });
})(window.vc);