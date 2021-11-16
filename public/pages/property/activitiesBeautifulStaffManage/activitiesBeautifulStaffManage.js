/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            activitiesBeautifulStaffManageInfo: {
                activitiesBeautifulStaffs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                componentShow: 'activitiesBeautifulStaffManage',
                beId: '',
                activitiesRules: [],
                conditions: {
                    ruleId: '',
                    staffName: '',
                    activitiesNum: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._queryActivitiesRules();
            vc.component._listActivitiesBeautifulStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('activitiesBeautifulStaffManage', 'listActivitiesBeautifulStaff', function (_param) {
                vc.component._listActivitiesBeautifulStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listActivitiesBeautifulStaffs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listActivitiesBeautifulStaffs: function (_page, _rows) {
                $that.activitiesBeautifulStaffManageInfo.componentShow = 'activitiesBeautifulStaffManage';
                vc.component.activitiesBeautifulStaffManageInfo.conditions.page = _page;
                vc.component.activitiesBeautifulStaffManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.activitiesBeautifulStaffManageInfo.conditions
                };
                param.params.staffName = param.params.staffName.trim();
                param.params.activitiesNum = param.params.activitiesNum.trim();
                //发送get请求
                vc.http.apiGet('/activitiesRule/queryActivitiesBeautifulStaff',
                    param,
                    function (json, res) {
                        var _activitiesBeautifulStaffManageInfo = JSON.parse(json);
                        vc.component.activitiesBeautifulStaffManageInfo.total = _activitiesBeautifulStaffManageInfo.total;
                        vc.component.activitiesBeautifulStaffManageInfo.records = _activitiesBeautifulStaffManageInfo.records;
                        vc.component.activitiesBeautifulStaffManageInfo.activitiesBeautifulStaffs = _activitiesBeautifulStaffManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.activitiesBeautifulStaffManageInfo.records,
                            dataCount: vc.component.activitiesBeautifulStaffManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询规则
            _queryActivitiesRules: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/activitiesRule/queryActivitiesRule',
                    param,
                    function (json, res) {
                        var _activitiesRuleManageInfo = JSON.parse(json);
                        $that.activitiesBeautifulStaffManageInfo.activitiesRules = _activitiesRuleManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddActivitiesBeautifulStaffModal: function () {
                $that.activitiesBeautifulStaffManageInfo.componentShow = 'addActivitiesBeautifulStaff';
                vc.emit('addActivitiesBeautifulStaff', 'openAddActivitiesBeautifulStaffModal', {});
            },
            _openEditActivitiesBeautifulStaffModel: function (_activitiesBeautifulStaff) {
                $that.activitiesBeautifulStaffManageInfo.componentShow = 'editActivitiesBeautifulStaff';
                vc.emit('editActivitiesBeautifulStaff', 'openEditActivitiesBeautifulStaffModal', _activitiesBeautifulStaff);
            },
            _openDeleteActivitiesBeautifulStaffModel: function (_activitiesBeautifulStaff) {
                vc.emit('deleteActivitiesBeautifulStaff', 'openDeleteActivitiesBeautifulStaffModal', _activitiesBeautifulStaff);
            },
            //查询
            _queryActivitiesBeautifulStaffMethod: function () {
                vc.component._listActivitiesBeautifulStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetActivitiesBeautifulStaffMethod: function () {
                vc.component.activitiesBeautifulStaffManageInfo.conditions.ruleId = "";
                vc.component.activitiesBeautifulStaffManageInfo.conditions.staffName = "";
                vc.component.activitiesBeautifulStaffManageInfo.conditions.activitiesNum = "";
                vc.component._listActivitiesBeautifulStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.activitiesBeautifulStaffManageInfo.moreCondition) {
                    vc.component.activitiesBeautifulStaffManageInfo.moreCondition = false;
                } else {
                    vc.component.activitiesBeautifulStaffManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
