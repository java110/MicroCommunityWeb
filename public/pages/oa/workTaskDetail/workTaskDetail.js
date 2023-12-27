/**
 业主详情页面
 **/
(function (vc) {
    vc.extends({
        data: {
            workTaskDetailInfo: {
                viewWorkFlag: '',
                workId: "",
                wtId: '',
                workName: '',
                typeName: "",
                workCycle: "",
                startTime: "",
                endTime: "",
                createUserName: "",
                curStaffName: "",
                curCopyName: "",
                stateName: "",
                createTime: '',
                content: '',
                pathUrl: '',
                taskId: '',
                todo: 'OFF',
                events: [],
                files:[],
                audit: {
                    taskId: '',
                    auditCode: 'C',
                    auditMessage: '已办理',
                    staffId: '',
                    staffName: '',
                    pathUrl: '',
                }
            }
        },
        _initMethod: function () {
            $that.workTaskDetailInfo.workId = vc.getParam('workId');
            $that.workTaskDetailInfo.taskId = vc.getParam('taskId');
            let _todo = vc.getParam('todo');
            if (_todo) {
                $that.workTaskDetailInfo.todo = _todo;
                $that.workTaskDetailInfo.audit.taskId = vc.getParam('taskId');
            }

            if (!vc.notNull($that.workTaskDetailInfo.workId)) {
                return;
            }

            $that._loadWorkInfo();
            $that._loadWorkEventData();
            $that._loadWorkFileData();

        },
        _initEvent: function () {
            vc.on('workTaskDetail', 'listWorkData', function (_info) {
                $that._loadWorkInfo();
            });
            vc.on('workTaskDetail', 'notifyFile', function (_param) {
                $that.workTaskDetailInfo.audit.pathUrl = _param.realFileName;
            })
        },
        methods: {
            _loadWorkInfo: function () {
                let param = {
                    params: {
                        workId: $that.workTaskDetailInfo.workId,
                        page: 1,
                        row: 1,
                    }
                }
                //发送get请求
                vc.http.apiGet('/work.listWorkPool',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.copyObject(_json.data[0], $that.workTaskDetailInfo);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadWorkEventData: function () {
                let param = {
                    params: {
                        taskId: $that.workTaskDetailInfo.taskId,
                        workId: $that.workTaskDetailInfo.workId,
                        page: 1,
                        row: 100
                    }
                };
                //发送get请求
                vc.http.apiGet('/workEvent.listWorkEvent',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.workTaskDetailInfo.events = _json.data;
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadWorkFileData: function (_page, _row) {
                let param = {
                    params: {
                        taskId: $that.workTaskDetailInfo.taskId,
                        workId: $that.workTaskDetailInfo.workId,
                        page: 1,
                        row: 100
                    }
                };
                //发送get请求
                vc.http.apiGet('/work.listWorkPoolFile',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.workTaskDetailInfo.files = _json.data;
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseStaff: function () {
                vc.emit('selectStaff', 'openStaff', $that.workTaskDetailInfo.audit);
            },
            _auditSubmit: function () {

                vc.http.apiPost(
                    '/work.finishWorkTask',
                    JSON.stringify($that.workTaskDetailInfo.audit), {
                    emulateJSON: true
                },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('添加成功');
                            vc.goBack();
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            }
        }
    });
})(window.vc);