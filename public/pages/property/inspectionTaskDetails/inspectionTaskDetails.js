/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            inspectionTaskDetailManageInfo: {
                inspectionTasks: [],
                total: 0,
                records: 1,
                moreCondition: false,
                taskId: '',
                stateTypes: [],
                inspectionStateTypes: [],
                taskStates: [],
                inspectionPointList: [],
                inspectionPlanList: [],
                inspectionRouteList: [],
                patrolTypes: [],
                conditions: {
                    planUserName: '',
                    taskDetailId: '',
                    inspectionPlanName: '',
                    actInsTime: '',
                    inspectionStartTime: '',
                    inspectionEndTime: '',
                    state: '',
                    inspectionState: '',
                    inspectionId: '',
                    inspectionPlanId: '',
                    inspectionRouteId: '',
                    taskState: '',
                    patrolType: ''
                }
            }
        },
        _initMethod: function () {
            //与字典表关联
            vc.getDict('inspection_task', "state", function (_data) {
                vc.component.inspectionTaskDetailManageInfo.stateTypes = _data;
            });
            vc.getDict('inspection_task_detail', "inspection_state", function (_data) {
                vc.component.inspectionTaskDetailManageInfo.inspectionStateTypes = _data;
            });
            vc.getDict('inspection_task_detail', "state", function (_data) {
                vc.component.inspectionTaskDetailManageInfo.taskStates = _data;
            });
            vc.getDict('inspection_task_detail', "patrol_type", function (_data) {
                vc.component.inspectionTaskDetailManageInfo.patrolTypes = _data;
            });
            vc.component._initInspectionTaskDetailDateInfo();
            vc.component._listInspectionTasksDetailList(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.component._listInspectionPlanInfo();
            vc.component._listInspectionRouteInfo();
            vc.component._listInspectionPointInfo();
        },
        _initEvent: function () {
            vc.on('inspectionTaskManage', 'listInspectionTask', function (_param) {
                vc.component._listInspectionTasksDetailList(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listInspectionTasksDetailList(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initInspectionTaskDetailDateInfo: function () {
                $('.startTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        vc.component.inspectionTaskDetailManageInfo.conditions.inspectionStartTime = value;
                    });
                $('.endTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        vc.component.inspectionTaskDetailManageInfo.conditions.inspectionEndTime = value;
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName(' form-control startTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName(" form-control endTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _listInspectionTasksDetailList: function (_page, _rows) {
                vc.component.inspectionTaskDetailManageInfo.conditions.page = _page;
                vc.component.inspectionTaskDetailManageInfo.conditions.row = _rows;
                $that.inspectionTaskDetailManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.inspectionTaskDetailManageInfo.conditions
                };
                param.params.planUserName = param.params.planUserName.trim();
                param.params.taskDetailId = param.params.taskDetailId.trim();
                param.params.inspectionPlanName = param.params.inspectionPlanName.trim();
                //发送get请求
                vc.http.apiGet('inspectionTaskDetail.listInspectionTaskDetails',
                    param,
                    function (json, res) {
                        var _inspectionTaskDetailManageInfo = JSON.parse(json);
                        vc.component.inspectionTaskDetailManageInfo.total = _inspectionTaskDetailManageInfo.total;
                        vc.component.inspectionTaskDetailManageInfo.records = _inspectionTaskDetailManageInfo.records;
                        vc.component.inspectionTaskDetailManageInfo.inspectionTasks = _inspectionTaskDetailManageInfo.inspectionTaskDetails;
                        vc.emit('pagination', 'init', {
                            total: vc.component.inspectionTaskDetailManageInfo.records,
                            dataCount: vc.component.inspectionTaskDetailManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryInspectionTaskMethod: function () {
                vc.component._listInspectionTasksDetailList(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetInspectionTaskMethod: function () {
                vc.component.inspectionTaskDetailManageInfo.conditions.planUserName = "";
                vc.component.inspectionTaskDetailManageInfo.conditions.taskDetailId = "";
                vc.component.inspectionTaskDetailManageInfo.conditions.inspectionPlanName = "";
                vc.component.inspectionTaskDetailManageInfo.conditions.actInsTime = "";
                vc.component.inspectionTaskDetailManageInfo.conditions.inspectionStartTime = "";
                vc.component.inspectionTaskDetailManageInfo.conditions.inspectionEndTime = "";
                vc.component.inspectionTaskDetailManageInfo.conditions.state = "";
                vc.component.inspectionTaskDetailManageInfo.conditions.inspectionId = '';
                vc.component.inspectionTaskDetailManageInfo.conditions.inspectionPlanId = '';
                vc.component.inspectionTaskDetailManageInfo.conditions.inspectionRouteId = '';
                vc.component.inspectionTaskDetailManageInfo.conditions.inspectionState = "";
                vc.component.inspectionTaskDetailManageInfo.conditions.taskState = "";
                vc.component.inspectionTaskDetailManageInfo.conditions.patrolType = "";
                vc.component._listInspectionTasksDetailList(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.inspectionTaskDetailManageInfo.moreCondition) {
                    vc.component.inspectionTaskDetailManageInfo.moreCondition = false;
                } else {
                    vc.component.inspectionTaskDetailManageInfo.moreCondition = true;
                }
            },
            _listInspectionPlanInfo: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 200
                    }
                };
                //发送get请求
                vc.http.apiGet('/inspectionPlan.listInspectionPlans',
                    param,
                    function (json, res) {
                        var _inspectionPointManageInfo = JSON.parse(json);
                        vc.component.inspectionTaskDetailManageInfo.inspectionPlanList = _inspectionPointManageInfo.inspectionPlans;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listInspectionRouteInfo: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 200
                    }
                };
                //发送get请求
                vc.http.apiGet('/inspectionRoute.listInspectionRoutes',
                    param,
                    function (json, res) {
                        var _inspectionPointManageInfo = JSON.parse(json);
                        vc.component.inspectionTaskDetailManageInfo.inspectionRouteList = _inspectionPointManageInfo.inspectionRoutes;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listInspectionPointInfo: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 200
                    }
                };
                //发送get请求
                vc.http.apiGet('/inspectionPoint.listInspectionPoints',
                    param,
                    function (json, res) {
                        var _inspectionPointManageInfo = JSON.parse(json);
                        vc.component.inspectionTaskDetailManageInfo.inspectionPointList = _inspectionPointManageInfo.inspectionPoints;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            openFile: function (_photo) {
                vc.emit('viewImage', 'showImage', {
                    url: _photo.url
                });
            },
            openMap: function (lat, lng) {
                if (!lat || !lng) {
                    vc.toast('暂无位置信息');
                    return;
                }
                vc.emit('viewMap', 'showMap', {
                    lat: lat,
                    lng: lng
                });
            },
            //导出
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=inspectionTaskDetails&' + vc.objToGetParam($that.inspectionTaskDetailManageInfo.conditions));
            }
        }
    });
})(window.vc);
