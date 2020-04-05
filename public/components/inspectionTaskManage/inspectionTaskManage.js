/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            inspectionTaskManageInfo: {
                inspectionTasks: [],
                total: 0,
                records: 1,
                moreCondition: false,
                taskId: '',
                conditions: {
                    planUserName: '',
                    inspectionPlanId: '',
                    actInsTime: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listInspectionTasks(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('inspectionTaskManage', 'listInspectionTask', function (_param) {
                vc.component._listInspectionTasks(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listInspectionTasks(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listInspectionTasks: function (_page, _rows) {

                vc.component.inspectionTaskManageInfo.conditions.page = _page;
                vc.component.inspectionTaskManageInfo.conditions.row = _rows;
                $that.inspectionTaskManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.inspectionTaskManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('inspectionTask.listInspectionTasks',
                    param,
                    function (json, res) {
                        var _inspectionTaskManageInfo = JSON.parse(json);
                        vc.component.inspectionTaskManageInfo.total = _inspectionTaskManageInfo.total;
                        vc.component.inspectionTaskManageInfo.records = _inspectionTaskManageInfo.records;
                        vc.component.inspectionTaskManageInfo.inspectionTasks = _inspectionTaskManageInfo.inspectionTasks;
                        vc.emit('pagination', 'init', {
                            total: vc.component.inspectionTaskManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openInspectionTaskDetail: function (_inspectionTask) {
                vc.emit('inspectionTaskDetail', 'openInspectionTaskDetail', _inspectionTask);
            },
            _queryInspectionTaskMethod: function () {
                vc.component._listInspectionTasks(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.inspectionTaskManageInfo.moreCondition) {
                    vc.component.inspectionTaskManageInfo.moreCondition = false;
                } else {
                    vc.component.inspectionTaskManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
