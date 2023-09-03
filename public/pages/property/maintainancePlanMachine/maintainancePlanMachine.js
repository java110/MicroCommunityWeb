/**
 入驻小区
 **/
 (function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            maintainancePlanMachineInfo: {
                machines: [],
                planId: '',
                total: 0,
                records: 1,
                routeName: ''
            }
        },
        _initMethod: function() {
            $that.maintainancePlanMachineInfo.planId = vc.getParam('planId');
            $that._listMaintainancePlanMachines(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('maintainancePlanMachine', 'loadMachine', function() {
                $that._listMaintainancePlanMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('maintainancePlanMachine', 'paginationPlus', 'page_event', function(_currentPage) {
                $that._listMaintainancePlanMachines(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMaintainancePlanMachines: function(_page, _rows) {
                let param = {
                    params: {
                        page: _page,
                        row: _rows,
                        communityId: vc.getCurrentCommunity().communityId,
                        planId: $that.maintainancePlanMachineInfo.planId
                    }
                };
                //发送get请求
                vc.http.apiGet('/maintainancePlan.listMaintainancePlanMachine',
                    param,
                    function(json, res) {
                        let _inspectionRouteManageInfo = JSON.parse(json);
                        $that.maintainancePlanMachineInfo.total = _inspectionRouteManageInfo.total;
                        $that.maintainancePlanMachineInfo.records = _inspectionRouteManageInfo.records;
                        $that.maintainancePlanMachineInfo.machines = _inspectionRouteManageInfo.data;
                        vc.emit('maintainancePlanMachine', 'paginationPlus', 'init', {
                            total: $that.maintainancePlanMachineInfo.records,
                            dataCount: $that.maintainancePlanMachineInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMaintainancePlanMachineModal: function() {
                vc.emit('chooseMaintainancePlanMachine', 'openchooseMaintainancePlanMachineModal', {
                    planId:$that.maintainancePlanMachineInfo.planId
                });
            },
            _openDeleteMaintainancePlanMachineModel: function(_inspectionPoint) {
                _inspectionPoint.planId = $that.maintainancePlanMachineInfo.planId;
                vc.emit('deleteMaintainancePlanMachine', 'openDeleteMaintainancePlanMachineModal', _inspectionPoint);
            },
            _goBack: function() {
                vc.goBack();
            }
        }
    });
})(window.vc);