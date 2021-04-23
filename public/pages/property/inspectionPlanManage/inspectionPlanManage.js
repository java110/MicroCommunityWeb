/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            inspectionPlanManageInfo: {
                inspectionPlans: [],
                total: 0,
                records: 1,
                moreCondition: false,
                inspectionPlanName: '',
                states:'',
                inspectionPlanStaffModel:false,
                conditions: {
                    inspectionPlanName: '',
                    staffName:'',
                    state: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listInspectionPlans(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('inspection_plan',"state",function(_data){
                vc.component.inspectionPlanManageInfo.states = _data;
            });
        },
        _initEvent: function () {

            vc.on('inspectionPlanManage', 'listInspectionPlan', function (_param) {
                vc.component._listInspectionPlans(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('inspectionPlanManage','goBack',function(_param){
                vc.component.inspectionPlanManageInfo.inspectionPlanStaffModel = false;
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listInspectionPlans(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listInspectionPlans: function (_page, _rows) {

                vc.component.inspectionPlanManageInfo.conditions.page = _page;
                vc.component.inspectionPlanManageInfo.conditions.row = _rows;
                vc.component.inspectionPlanManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.inspectionPlanManageInfo.conditions
                };

                //发送get请求
                vc.http.get('inspectionPlanManage',
                    'list',
                    param,
                    function (json, res) {
                        var _inspectionPlanManageInfo = JSON.parse(json);
                        vc.component.inspectionPlanManageInfo.total = _inspectionPlanManageInfo.total;
                        vc.component.inspectionPlanManageInfo.records = _inspectionPlanManageInfo.records;
                        vc.component.inspectionPlanManageInfo.inspectionPlans = _inspectionPlanManageInfo.inspectionPlans;
                        vc.emit('pagination', 'init', {
                            total: vc.component.inspectionPlanManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddInspectionPlanModal: function () {
                vc.emit('addInspectionPlan', 'openAddInspectionPlanModal', {});
            },
            _openEditInspectionPlanModel: function (_inspectionPlan) {
                vc.emit('editInspectionPlan', 'openEditInspectionPlanModal', _inspectionPlan);
            },
            _openDeleteInspectionPlanModel: function (_inspectionPlan) {
                vc.emit('deleteInspectionPlan', 'openDeleteInspectionPlanModal', _inspectionPlan);
            },
            _queryInspectionPlanMethod: function () {
                vc.component._listInspectionPlans(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //启用计划
            _openEnabledInspectionPlanModel: function (_inspectionPlan) {
                vc.emit('inspectionPlanState', 'openInspectionPlanStateModal', {
                    inspectionPlanId: _inspectionPlan.inspectionPlanId,
                    stateName: '启用',
                    state: '2020025'
                });
            },
            //停用计划
            _openDisabledInspectionPlanModel: function (_inspectionPlan) {
                vc.emit('inspectionPlanState', 'openInspectionPlanStateModal', {
                    inspectionPlanId: _inspectionPlan.inspectionPlanId,
                    stateName: '停用',
                    state: '2020026'
                });
            },
            _moreCondition: function () {
                if (vc.component.inspectionPlanManageInfo.moreCondition) {
                    vc.component.inspectionPlanManageInfo.moreCondition = false;
                } else {
                    vc.component.inspectionPlanManageInfo.moreCondition = true;
                }
            },
            _openPlanStaff:function(_inspectionPlan){
                $that.inspectionPlanManageInfo.inspectionPlanStaffModel = true;
                vc.emit('inspectionPlanStaffManage','listInspectionPlanStaff',_inspectionPlan);
            }


        }
    });
})(window.vc);
