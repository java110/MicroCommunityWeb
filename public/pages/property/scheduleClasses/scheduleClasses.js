/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            scheduleClassesInfo: {
                scheduleClassess: [],
                total: 0,
                records: 1,
                moreCondition: false,
                states: [],
                conditions: {
                    nameLike: '',
                    staffName: '',
                    state: '',
                    inspectionPlanId: ''
                }
            }
        },
        _initMethod: function() {
            vc.component._listScheduleClassess(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('schedule_classes', "state", function (_data) {
                $that.scheduleClassesInfo.states = _data;
            });
        },
        _initEvent: function() {
            vc.on('scheduleClasses', 'listScheduleClasses', function(_param) {
                vc.component._listScheduleClassess(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listScheduleClassess(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listScheduleClassess: function(_page, _rows) {
                vc.component.scheduleClassesInfo.conditions.page = _page;
                vc.component.scheduleClassesInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.scheduleClassesInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/scheduleClasses.listScheduleClasses',
                    param,
                    function(json, res) {
                        var _scheduleClassesInfo = JSON.parse(json);
                        vc.component.scheduleClassesInfo.total = _scheduleClassesInfo.total;
                        vc.component.scheduleClassesInfo.records = _scheduleClassesInfo.records;
                        vc.component.scheduleClassesInfo.scheduleClassess = _scheduleClassesInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.scheduleClassesInfo.records,
                            dataCount: vc.component.scheduleClassesInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddScheduleClassesModal: function() {
                //vc.emit('addScheduleClasses', 'openAddScheduleClassesModal', {});
                vc.jumpToPage('/#/pages/property/addScheduleClasses');
            },
            _openEditScheduleClassesModel: function (_inspectionPlan) {
                vc.jumpToPage('/#/pages/property/editScheduleClasses?scheduleId=' + _inspectionPlan.scheduleId);
            },
            _openDeleteScheduleClassesModel: function(_inspectionPlan) {
                vc.emit('deleteScheduleClasses', 'openDeleteScheduleClassesModal', _inspectionPlan);
            },
            //查询
            _queryScheduleClassesMethod: function() {
                vc.component._listScheduleClassess(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetScheduleClassesMethod: function() {
                vc.component.scheduleClassesInfo.conditions.inspectionPlanName = "";
                vc.component.scheduleClassesInfo.conditions.inspectionPlanId = "";
                vc.component.scheduleClassesInfo.conditions.state = "";
                vc.component._listScheduleClassess(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //启用计划
            _openEnabledScheduleClassesModel: function(_inspectionPlan) {
                vc.emit('scheduleClassesState', 'openScheduleClassesStateModal', {
                    scheduleId: _inspectionPlan.scheduleId,
                    stateName: '启用',
                    state: '1001'
                });
            },
            //停用计划
            _openDisabledScheduleClassesModel: function(_inspectionPlan) {
                vc.emit('scheduleClassesState', 'openScheduleClassesStateModal', {
                    scheduleId: _inspectionPlan.scheduleId,
                    stateName: '停用',
                    state: '2002'
                });
            },
            _moreCondition: function() {
                if (vc.component.scheduleClassesInfo.moreCondition) {
                    vc.component.scheduleClassesInfo.moreCondition = false;
                } else {
                    vc.component.scheduleClassesInfo.moreCondition = true;
                }
            },
            _openPlanStaff: function(_inspectionPlan) {
                $that.scheduleClassesInfo.inspectionPlanStaffModel = true;
                vc.emit('inspectionPlanStaffManage', 'listScheduleClassesStaff', _inspectionPlan);
            },
            _scheduleClassesStaff: function (_scheduleClasses) {
                vc.jumpToPage('/#/pages/property/scheduleClassesStaffManage?scheduleId=' + _scheduleClasses.scheduleId)
            }
        }
    });
})(window.vc);