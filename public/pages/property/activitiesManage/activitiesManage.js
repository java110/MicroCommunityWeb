/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            activitiesManageInfo: {
                activitiess: [],
                total: 0,
                records: 1,
                moreCondition: false,
                componentShow: 'activitiesList',
                title: '',
                typeCds: [],
                conditions: {
                    title: '',
                    typeCd: '',
                    staffName: '',
                    activitiesId: '',
                    endTimeFlag: '1'
                }
            }
        },
        _initMethod: function () {
            vc.component._listActivitiess(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._loadActivitiesType();
        },
        _initEvent: function () {
            vc.on('activitiesManage', 'listActivities', function (_param) {
                vc.component.activitiesManageInfo.componentShow = 'activitiesList';
                vc.component._listActivitiess(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('activitiesManage', 'pageReload', function () {
                location.reload();
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listActivitiess(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listActivitiess: function (_page, _rows) {
                vc.component.activitiesManageInfo.conditions.page = _page;
                vc.component.activitiesManageInfo.conditions.row = _rows;
                vc.component.activitiesManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.activitiesManageInfo.conditions
                };
                param.params.activitiesId = param.params.activitiesId.trim();
                param.params.title = param.params.title.trim();
                param.params.staffName = param.params.staffName.trim();
                //发送get请求
                vc.http.apiGet('/activities.listActivitiess',
                    param,
                    function (json, res) {
                        var _activitiesManageInfo = JSON.parse(json);
                        vc.component.activitiesManageInfo.total = _activitiesManageInfo.total;
                        vc.component.activitiesManageInfo.records = _activitiesManageInfo.records;
                        vc.component.activitiesManageInfo.activitiess = _activitiesManageInfo.activitiess;
                        vc.emit('pagination', 'init', {
                            total: vc.component.activitiesManageInfo.records,
                            dataCount: vc.component.activitiesManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddActivitiesModal: function () {
                vc.component.activitiesManageInfo.componentShow = 'addActivitiesView';
                vc.emit('addActivitiesView', 'openAddActivitiesView', {});
            },
            _openEditActivitiesModel: function (_activities) {
                vc.emit('editActivitiesView', 'activitiesEditActivitiesInfo', _activities);
                vc.component.activitiesManageInfo.componentShow = 'editActivitiesView';
            },
            _openDeleteActivitiesModel: function (_activities) {
                vc.emit('deleteActivities', 'openDeleteActivitiesModal', _activities);
            },
            //查询
            _queryActivitiesMethod: function () {
                vc.component._listActivitiess(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetActivitiesMethod: function () {
                vc.component.activitiesManageInfo.conditions.activitiesId = "";
                vc.component.activitiesManageInfo.conditions.title = "";
                vc.component.activitiesManageInfo.conditions.typeCd = "";
                vc.component.activitiesManageInfo.conditions.staffName = "";
                vc.component._listActivitiess(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.activitiesManageInfo.moreCondition) {
                    vc.component.activitiesManageInfo.moreCondition = false;
                } else {
                    vc.component.activitiesManageInfo.moreCondition = true;
                }
            },
            _loadActivitiesType: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/activitiesType/queryActivitiesType',
                    param,
                    function (json, res) {
                        let _activitiesTypeManageInfo = JSON.parse(json);
                        let _data = _activitiesTypeManageInfo.data;
                        $that.activitiesManageInfo.typeCds = _data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);