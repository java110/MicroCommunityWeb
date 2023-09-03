/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            inspectionPlanStaffManageInfo: {
                inspectionPlanStaffs: [],
                inspectionPlanId: '',
                inspectionPlanName: '',
                inspectionPlanPeriodName: '',
                total: 0,
                records: 1,
                routeName: ''
            }
        },
        _initMethod: function () {
            //vc.component._listInspectionRoutePoints(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('inspectionPlanStaffManage', 'listInspectionPlanStaff', function (_param) {
                if (!_param.hasOwnProperty('inspectionPlanId')) {
                    return;
                }
                vc.component.inspectionPlanStaffManageInfo.inspectionPlanId = _param.inspectionPlanId;
                if (_param.hasOwnProperty('inspectionPlanName')) {
                    $that.inspectionPlanStaffManageInfo.inspectionPlanName = _param.inspectionPlanName;
                }
                if (_param.hasOwnProperty('inspectionPlanPeriodName')) {
                    $that.inspectionPlanStaffManageInfo.inspectionPlanPeriodName = _param.inspectionPlanPeriodName;
                }
                vc.component._listInspectionPlanStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('inspectionPlanStaffManage', 'paginationPlus', 'page_event', function(_currentPage) {
                vc.component._listInspectionPlanStaffs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listInspectionPlanStaffs: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        communityId: vc.getCurrentCommunity().communityId,
                        inspectionPlanId: vc.component.inspectionPlanStaffManageInfo.inspectionPlanId
                    }
                };
                //发送get请求
                vc.http.apiGet('inspectionPlanStaff.listInspectionPlanStaffs',
                    param,
                    function (json, res) {
                        var _inspectionRouteManageInfo = JSON.parse(json);
                        vc.component.inspectionPlanStaffManageInfo.total = _inspectionRouteManageInfo.total;
                        vc.component.inspectionPlanStaffManageInfo.records = _inspectionRouteManageInfo.records;
                        vc.component.inspectionPlanStaffManageInfo.inspectionPlanStaffs = _inspectionRouteManageInfo.inspectionPlanStaffs;
                        vc.emit('inspectionPlanStaffManage', 'paginationPlus', 'init', {
                            total: vc.component.inspectionPlanStaffManageInfo.records,
                            dataCount: vc.component.inspectionPlanStaffManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddInspectionPlanStaffModal: function () {
                vc.emit('addInspectionPlanStaff', 'openAddInspectionPlanStaffModal', $that.inspectionPlanStaffManageInfo);
            },
            _openDeleteInspectionPlanStaffModel: function (_inspectionPlanStaff) {
                _inspectionPlanStaff.inspectionPlanId = $that.inspectionPlanStaffManageInfo.inspectionPlanId;
                vc.emit('deleteInspectionPlanStaff', 'openDeleteInspectionPlanStaffModal', _inspectionPlanStaff);
            },
            _goBack: function () {
                vc.emit('inspectionPlanManage', 'goBack', {});
            }
        }
    });
})(window.vc);