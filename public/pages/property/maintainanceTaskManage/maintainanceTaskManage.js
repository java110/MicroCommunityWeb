/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            maintainanceTaskManageInfo: {
                maintainanceTasks: [],
                total: 0,
                records: 1,
                moreCondition: false,
                taskId: '',
                stateTypes: [],
                conditions: {
                    planUserName: '',
                    planId: '',
                    planName: '',
                    actInsTime: '',
                    startTime: '',
                    endTime: '',
                    state: ''
                }
            }
        },
        _initMethod: function () {
            //与字典表关联
            vc.getDict('maintainance_task', "state", function (_data) {
                vc.component.maintainanceTaskManageInfo.stateTypes = _data;
            });
            vc.component._initMaintainanceTaskDateInfo();
            vc.component._listMaintainanceTasks(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('maintainanceTaskManage', 'listMaintainanceTask', function (_param) {
                vc.component._listMaintainanceTasks(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('maintainanceTaskManage', 'pageReload', function (_param) {
                location.reload();
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMaintainanceTasks(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initMaintainanceTaskDateInfo: function () {
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
                        vc.component.maintainanceTaskManageInfo.conditions.startTime = value;
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
                        vc.component.maintainanceTaskManageInfo.conditions.endTime = value;
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
            _listMaintainanceTasks: function (_page, _rows) {
                vc.component.maintainanceTaskManageInfo.conditions.page = _page;
                vc.component.maintainanceTaskManageInfo.conditions.row = _rows;
                $that.maintainanceTaskManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.maintainanceTaskManageInfo.conditions
                };
                param.params.planUserName = param.params.planUserName.trim();
                param.params.planId = param.params.planId.trim();
                param.params.planName = param.params.planName.trim();
                //发送get请求
                vc.http.apiGet('/maintainanceTask.listMaintainanceTask',
                    param,
                    function (json, res) {
                        var _maintainanceTaskManageInfo = JSON.parse(json);
                        vc.component.maintainanceTaskManageInfo.total = _maintainanceTaskManageInfo.total;
                        vc.component.maintainanceTaskManageInfo.records = _maintainanceTaskManageInfo.records;
                        vc.component.maintainanceTaskManageInfo.maintainanceTasks = _maintainanceTaskManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.maintainanceTaskManageInfo.records,
                            dataCount: vc.component.maintainanceTaskManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openMaintainanceTaskDetail: function (_maintainanceTask) {
                vc.emit('maintainanceTaskDetail', 'openMaintainanceTaskDetail', _maintainanceTask);
            },
            _openMaintainanceTaskTransfer: function (_maintainanceTask) {
                vc.emit('maintainanceTaskTransfer', 'openMaintainanceTaskTransferModal', _maintainanceTask);
            },
            _openDeleteMaintainanceTask: function (_maintainanceTask) {
                vc.emit('deleteMaintainanceTask', 'openDeleteMaintainanceTaskModal', _maintainanceTask);
            },
            //查询
            _queryMaintainanceTaskMethod: function () {
                vc.component._listMaintainanceTasks(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMaintainanceTaskMethod: function () {
                vc.component.maintainanceTaskManageInfo.conditions.planUserName = "";
                vc.component.maintainanceTaskManageInfo.conditions.planId = "";
                vc.component.maintainanceTaskManageInfo.conditions.planName = "";
                vc.component.maintainanceTaskManageInfo.conditions.startTime = "";
                vc.component.maintainanceTaskManageInfo.conditions.endTime = "";
                vc.component.maintainanceTaskManageInfo.conditions.state = "";
                vc.component._listMaintainanceTasks(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.maintainanceTaskManageInfo.moreCondition) {
                    vc.component.maintainanceTaskManageInfo.moreCondition = false;
                } else {
                    vc.component.maintainanceTaskManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);