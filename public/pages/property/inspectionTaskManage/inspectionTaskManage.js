/**
 入驻小区
 **/
(function(vc) {
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
                stateTypes: [],
                conditions: {
                    planUserName: '',
                    inspectionPlanId: '',
                    inspectionPlanName: '',
                    actInsTime: '',
                    startTime: '',
                    endTime: '',
                    state: '',
                    orderByDesc: 'desc'
                }
            }
        },
        _initMethod: function() {
            //与字典表关联
            vc.getDict('inspection_task', "state", function(_data) {
                vc.component.inspectionTaskManageInfo.stateTypes = _data;
            });
            vc.component._initInspectionTaskDateInfo();
            vc.component._listInspectionTasks(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('inspectionTaskManage', 'listInspectionTask', function(_param) {
                vc.component._listInspectionTasks(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('inspectionTaskManage', 'pageReload', function(_param) {
                location.reload();
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listInspectionTasks(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initInspectionTaskDateInfo: function() {
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
                    .on('changeDate', function(ev) {
                        var value = $(".startTime").val();
                        vc.component.inspectionTaskManageInfo.conditions.startTime = value;
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
                    .on('changeDate', function(ev) {
                        var value = $(".endTime").val();
                        vc.component.inspectionTaskManageInfo.conditions.endTime = value;
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
            _listInspectionTasks: function(_page, _rows) {
                vc.component.inspectionTaskManageInfo.conditions.page = _page;
                vc.component.inspectionTaskManageInfo.conditions.row = _rows;
                $that.inspectionTaskManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.inspectionTaskManageInfo.conditions
                };
                param.params.planUserName = param.params.planUserName.trim();
                param.params.inspectionPlanId = param.params.inspectionPlanId.trim();
                param.params.inspectionPlanName = param.params.inspectionPlanName.trim();
                //发送get请求
                vc.http.apiGet('inspectionTask.listInspectionTasks',
                    param,
                    function(json, res) {
                        var _inspectionTaskManageInfo = JSON.parse(json);
                        vc.component.inspectionTaskManageInfo.total = _inspectionTaskManageInfo.total;
                        vc.component.inspectionTaskManageInfo.records = _inspectionTaskManageInfo.records;
                        vc.component.inspectionTaskManageInfo.inspectionTasks = _inspectionTaskManageInfo.inspectionTasks;
                        vc.emit('pagination', 'init', {
                            total: vc.component.inspectionTaskManageInfo.records,
                            dataCount: vc.component.inspectionTaskManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openInspectionTaskDetail: function(_inspectionTask) {
                vc.emit('inspectionTaskDetail', 'openInspectionTaskDetail', _inspectionTask);
            },
            _openInspectionTaskTransfer: function(_inspectionTask) {
                vc.emit('inspectionTaskTransfer', 'openInspectionTaskTransferModal', _inspectionTask);
            },
            _openDeleteInspectionTask: function(_inspectionTask) {
                vc.emit('deleteInspectionTask', 'openDeleteInspectionTaskModal', _inspectionTask);
            },
            //查询
            _queryInspectionTaskMethod: function() {
                vc.component._listInspectionTasks(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetInspectionTaskMethod: function() {
                vc.component.inspectionTaskManageInfo.conditions.planUserName = "";
                vc.component.inspectionTaskManageInfo.conditions.inspectionPlanId = "";
                vc.component.inspectionTaskManageInfo.conditions.inspectionPlanName = "";
                vc.component.inspectionTaskManageInfo.conditions.startTime = "";
                vc.component.inspectionTaskManageInfo.conditions.endTime = "";
                vc.component.inspectionTaskManageInfo.conditions.state = "";
                vc.component._listInspectionTasks(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if (vc.component.inspectionTaskManageInfo.moreCondition) {
                    vc.component.inspectionTaskManageInfo.moreCondition = false;
                } else {
                    vc.component.inspectionTaskManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);