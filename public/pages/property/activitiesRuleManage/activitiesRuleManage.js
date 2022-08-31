/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            activitiesRuleManageInfo: {
                activitiesRules: [],
                total: 0,
                records: 1,
                moreCondition: false,
                ruleId: '',
                conditions: {
                    ruleType: '',
                    ruleName: '',
                    activitiesObj: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listActivitiesRules(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('activitiesRuleManage', 'listActivitiesRule', function (_param) {
                vc.component._listActivitiesRules(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listActivitiesRules(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listActivitiesRules: function (_page, _rows) {
                vc.component.activitiesRuleManageInfo.conditions.page = _page;
                vc.component.activitiesRuleManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.activitiesRuleManageInfo.conditions
                };
                param.params.ruleName = param.params.ruleName.trim();
                //发送get请求
                vc.http.apiGet('/activitiesRule/queryActivitiesRule',
                    param,
                    function (json, res) {
                        var _activitiesRuleManageInfo = JSON.parse(json);
                        vc.component.activitiesRuleManageInfo.total = _activitiesRuleManageInfo.total;
                        vc.component.activitiesRuleManageInfo.records = _activitiesRuleManageInfo.records;
                        vc.component.activitiesRuleManageInfo.activitiesRules = _activitiesRuleManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.activitiesRuleManageInfo.records,
                            dataCount: vc.component.activitiesRuleManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置方法
            /*_resetActivitiesRules: function (_page, _rows) {
                vc.component.activitiesRuleManageInfo.conditions.ruleType = "";
                vc.component.activitiesRuleManageInfo.conditions.ruleName = "";
                vc.component.activitiesRuleManageInfo.conditions.activitiesObj = "";
                var param = {
                    params: vc.component.activitiesRuleManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/activitiesRule/queryActivitiesRule',
                    param,
                    function (json, res) {
                        var _activitiesRuleManageInfo = JSON.parse(json);
                        vc.component.activitiesRuleManageInfo.total = _activitiesRuleManageInfo.total;
                        vc.component.activitiesRuleManageInfo.records = _activitiesRuleManageInfo.records;
                        vc.component.activitiesRuleManageInfo.activitiesRules = _activitiesRuleManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.activitiesRuleManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },*/
            _openAddActivitiesRuleModal: function () {
                vc.emit('addActivitiesRule', 'openAddActivitiesRuleModal', {});
            },
            _openEditActivitiesRuleModel: function (_activitiesRule) {
                vc.emit('editActivitiesRule', 'openEditActivitiesRuleModal', _activitiesRule);
            },
            _openDeleteActivitiesRuleModel: function (_activitiesRule) {
                vc.emit('deleteActivitiesRule', 'openDeleteActivitiesRuleModal', _activitiesRule);
            },
            //查询
            _queryActivitiesRuleMethod: function () {
                vc.component._listActivitiesRules(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetActivitiesRuleMethod: function () {
                vc.component.activitiesRuleManageInfo.conditions.ruleType = "";
                vc.component.activitiesRuleManageInfo.conditions.ruleName = "";
                vc.component.activitiesRuleManageInfo.conditions.activitiesObj = "";
                vc.component._listActivitiesRules(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.activitiesRuleManageInfo.moreCondition) {
                    vc.component.activitiesRuleManageInfo.moreCondition = false;
                } else {
                    vc.component.activitiesRuleManageInfo.moreCondition = true;
                }
            },
            _getActivitiesObjName: function (_activitiesObj) {
                if (_activitiesObj == '2222') {
                    return '大众';
                } else if (_activitiesObj == '3333') {
                    return '业主';
                }
                return '员工';
            }
        }
    });
})(window.vc);
