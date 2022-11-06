/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            maintainancePlanManageInfo: {
                maintainancePlans: [],
                total: 0,
                records: 1,
                moreCondition: false,
                maintainancePlanName: '',
                states: '',
                maintainancePlanStaffModel: false,
                conditions: {
                    maintainancePlanName: '',
                    staffName: '',
                    state: '',
                    maintainancePlanId: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listMaintainancePlans(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('maintainance_plan', "state", function (_data) {
                vc.component.maintainancePlanManageInfo.states = _data;
            });
        },
        _initEvent: function () {
            vc.on('maintainancePlanManage', 'listMaintainancePlan', function (_param) {
                vc.component._listMaintainancePlans(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('maintainancePlanManage', 'reload', function (_param) {
                location.reload();
            });
            vc.on('maintainancePlanManage', 'goBack', function (_param) {
                vc.component.maintainancePlanManageInfo.maintainancePlanStaffModel = false;
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMaintainancePlans(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMaintainancePlans: function (_page, _rows) {
                vc.component.maintainancePlanManageInfo.conditions.page = _page;
                vc.component.maintainancePlanManageInfo.conditions.row = _rows;
                vc.component.maintainancePlanManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.maintainancePlanManageInfo.conditions
                };
                param.params.maintainancePlanId = param.params.maintainancePlanId.trim();
                param.params.maintainancePlanName = param.params.maintainancePlanName.trim();
                param.params.state = param.params.state.trim();
                //发送get请求
                vc.http.apiGet('/maintainancePlan.listMaintainancePlans',
                    param,
                    function (json, res) {
                        var _maintainancePlanManageInfo = JSON.parse(json);
                        vc.component.maintainancePlanManageInfo.total = _maintainancePlanManageInfo.total;
                        vc.component.maintainancePlanManageInfo.records = _maintainancePlanManageInfo.records;
                        vc.component.maintainancePlanManageInfo.maintainancePlans = _maintainancePlanManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.maintainancePlanManageInfo.records,
                            dataCount: vc.component.maintainancePlanManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMaintainancePlanModal: function () {
                //vc.emit('addMaintainancePlan', 'openAddMaintainancePlanModal', {});

                vc.jumpToPage('/#/pages/property/addMaintainancePlan')
            },
            _openEditMaintainancePlanModel: function (_maintainancePlan) {
                vc.emit('editMaintainancePlan', 'openEditMaintainancePlanModal', _maintainancePlan);
            },
            _openDeleteMaintainancePlanModel: function (_maintainancePlan) {
                vc.emit('deleteMaintainancePlan', 'openDeleteMaintainancePlanModal', _maintainancePlan);
            },
            //查询
            _queryMaintainancePlanMethod: function () {
                vc.component._listMaintainancePlans(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMaintainancePlanMethod: function () {
                vc.component.maintainancePlanManageInfo.conditions.maintainancePlanName = "";
                vc.component.maintainancePlanManageInfo.conditions.maintainancePlanId = "";
                vc.component.maintainancePlanManageInfo.conditions.state = "";
                vc.component._listMaintainancePlans(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //启用计划
            _openEnabledMaintainancePlanModel: function (_maintainancePlan) {
                vc.emit('maintainancePlanState', 'openMaintainancePlanStateModal', {
                    maintainancePlanId: _maintainancePlan.maintainancePlanId,
                    stateName: '启用',
                    state: '2020025'
                });
            },
            //停用计划
            _openDisabledMaintainancePlanModel: function (_maintainancePlan) {
                vc.emit('maintainancePlanState', 'openMaintainancePlanStateModal', {
                    maintainancePlanId: _maintainancePlan.maintainancePlanId,
                    stateName: '停用',
                    state: '2020026'
                });
            },
            _moreCondition: function () {
                if (vc.component.maintainancePlanManageInfo.moreCondition) {
                    vc.component.maintainancePlanManageInfo.moreCondition = false;
                } else {
                    vc.component.maintainancePlanManageInfo.moreCondition = true;
                }
            },
            _openPlanStaff: function (_maintainancePlan) {
                $that.maintainancePlanManageInfo.maintainancePlanStaffModel = true;
                vc.emit('maintainancePlanStaffManage', 'listMaintainancePlanStaff', _maintainancePlan);
            }
        }
    });
})(window.vc);