/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var photoUrl = '/callComponent/download/getFile/file';
    vc.extends({
        data: {
            maintainanceTaskDetailManageInfo: {
                maintainanceTasks: [],
                total: 0,
                records: 1,
                moreCondition: false,
                taskId: '',
                stateTypes: [],
                maintainanceStateTypes: [],
                taskStates: [],
                plans: [],
                patrolTypes: [],
                conditions: {
                    planUserName: '',
                    taskDetailId: '',
                    planName: '',
                    actInsTime: '',
                    maintainanceStartTime: '',
                    maintainanceEndTime: '',
                    state: '',
                    maintainanceState: '',
                    maintainanceId: '',
                    maintainancePlanId: '',
                    maintainanceRouteId: '',
                    taskState: '',
                    patrolType: ''
                }
            }
        },
        _initMethod: function () {
            //与字典表关联
            vc.getDict('maintainance_task', "state", function (_data) {
                vc.component.maintainanceTaskDetailManageInfo.stateTypes = _data;
            });
            vc.getDict('maintainance_task_detail', "maintainance_state", function (_data) {
                vc.component.maintainanceTaskDetailManageInfo.maintainanceStateTypes = _data;
            });
            vc.getDict('maintainance_task_detail', "state", function (_data) {
                vc.component.maintainanceTaskDetailManageInfo.taskStates = _data;
            });
            vc.getDict('maintainance_task_detail', "patrol_type", function (_data) {
                vc.component.maintainanceTaskDetailManageInfo.patrolTypes = _data;
            });
            vc.component._initMaintainanceTaskDetailDateInfo();
            vc.component._listMaintainanceTasksDetailList(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.component._listMaintainancePlanInfo();
        },
        _initEvent: function () {
            vc.on('maintainanceTaskManage', 'listMaintainanceTask', function (_param) {
                vc.component._listMaintainanceTasksDetailList(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMaintainanceTasksDetailList(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initMaintainanceTaskDetailDateInfo: function () {
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
                        vc.component.maintainanceTaskDetailManageInfo.conditions.maintainanceStartTime = value;
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
                        vc.component.maintainanceTaskDetailManageInfo.conditions.maintainanceEndTime = value;
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
            _listMaintainanceTasksDetailList: function (_page, _rows) {
                vc.component.maintainanceTaskDetailManageInfo.conditions.page = _page;
                vc.component.maintainanceTaskDetailManageInfo.conditions.row = _rows;
                $that.maintainanceTaskDetailManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: vc.component.maintainanceTaskDetailManageInfo.conditions
                };
                param.params.planUserName = param.params.planUserName.trim();
                param.params.taskDetailId = param.params.taskDetailId.trim();
                param.params.planName = param.params.planName.trim();
                //发送get请求
                vc.http.apiGet('/maintainanceTask.listMaintainanceTaskDetail',
                    param,
                    function (json, res) {
                        let _maintainanceTaskDetailManageInfo = JSON.parse(json);
                        vc.component.maintainanceTaskDetailManageInfo.total = _maintainanceTaskDetailManageInfo.total;
                        vc.component.maintainanceTaskDetailManageInfo.records = _maintainanceTaskDetailManageInfo.records;
                        vc.component.maintainanceTaskDetailManageInfo.maintainanceTasks = _maintainanceTaskDetailManageInfo.data;
                        vc.component.maintainanceTaskDetailManageInfo.maintainanceTasks.forEach((item) => {
                            if(item.photos && item.photos.length>0){
                                item.photos.forEach((photo) => {
                                    photo.url = photoUrl + "?fileId=" + photo.url + "&communityId=-1&time=" + new Date()
                                    console.log(photo.url);
                                })
                            }
                        })
                        vc.emit('pagination', 'init', {
                            total: vc.component.maintainanceTaskDetailManageInfo.records,
                            dataCount: vc.component.maintainanceTaskDetailManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryMaintainanceTaskMethod: function () {
                vc.component._listMaintainanceTasksDetailList(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMaintainanceTaskMethod: function () {
                vc.component.maintainanceTaskDetailManageInfo.conditions.planUserName = "";
                vc.component.maintainanceTaskDetailManageInfo.conditions.taskDetailId = "";
                vc.component.maintainanceTaskDetailManageInfo.conditions.planName = "";
                vc.component.maintainanceTaskDetailManageInfo.conditions.actInsTime = "";
                vc.component.maintainanceTaskDetailManageInfo.conditions.maintainanceStartTime = "";
                vc.component.maintainanceTaskDetailManageInfo.conditions.maintainanceEndTime = "";
                vc.component.maintainanceTaskDetailManageInfo.conditions.state = "";
                vc.component.maintainanceTaskDetailManageInfo.conditions.maintainanceId = '';
                vc.component.maintainanceTaskDetailManageInfo.conditions.maintainancePlanId = '';
                vc.component.maintainanceTaskDetailManageInfo.conditions.maintainanceRouteId = '';
                vc.component.maintainanceTaskDetailManageInfo.conditions.maintainanceState = "";
                vc.component.maintainanceTaskDetailManageInfo.conditions.taskState = "";
                vc.component.maintainanceTaskDetailManageInfo.conditions.patrolType = "";
                vc.component._listMaintainanceTasksDetailList(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.maintainanceTaskDetailManageInfo.moreCondition) {
                    vc.component.maintainanceTaskDetailManageInfo.moreCondition = false;
                } else {
                    vc.component.maintainanceTaskDetailManageInfo.moreCondition = true;
                }
            },
            _listMaintainancePlanInfo: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 200
                    }
                };
                //发送get请求
                vc.http.apiGet('/maintainancePlan.listMaintainancePlan',
                    param,
                    function (json, res) {
                        var _maintainancePointManageInfo = JSON.parse(json);
                        vc.component.maintainanceTaskDetailManageInfo.plans = _maintainancePointManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listMaintainanceRouteInfo: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 200
                    }
                };
                //发送get请求
                vc.http.apiGet('/maintainanceRoute.listMaintainanceRoutes',
                    param,
                    function (json, res) {
                        var _maintainancePointManageInfo = JSON.parse(json);
                        vc.component.maintainanceTaskDetailManageInfo.maintainanceRouteList = _maintainancePointManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listMaintainancePointInfo: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 200
                    }
                };
                //发送get请求
                vc.http.apiGet('/maintainancePoint.listMaintainancePoints',
                    param,
                    function (json, res) {
                        var _maintainancePointManageInfo = JSON.parse(json);
                        vc.component.maintainanceTaskDetailManageInfo.maintainancePointList = _maintainancePointManageInfo.data;
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
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=maintainanceTaskDetails&' + vc.objToGetParam($that.maintainanceTaskDetailManageInfo.conditions));
            }
        }
    });
})(window.vc);
