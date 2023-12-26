(function (vc) {
    vc.extends({
        data: {
            editWorkInfo: {
                workId: '',
                workName: '',
                workTypes: [],
                wtId: '',
                workCycle: '',
                startTime: '',
                endTime: '',
                staffs: [],
                copyStaffs: [],
                pathUrl: '',
                content: '',
                period: '',
                months: [],
                days: [],
                workdays: [],
                hours: '',
                communityId: ''
            }
        },
        _initMethod: function () {
            $that.editWorkInfo.workId = vc.getParam('workId');
            $that._loadWorkPool();
            $that._loadTaskStaff();
            $that._loadWorkCopy();
            $that._listWorkTypes();
            $that._loadWorkCycle();
            vc.initDateTime('editWorkStartTime', function (_value) {
                $that.editWorkInfo.startTime = _value;
            });
            vc.initDateTime('editWorkEndTime', function (_value) {
                $that.editWorkInfo.endTime = _value;
            });

            vc.emit('textarea', 'init', $that.editWorkInfo);
        },
        _initEvent: function () {
            vc.on('editWorkInfo', 'notifyFile', function (_param) {
                $that.editWorkInfo.pathUrl = _param.realFileName;
            })
        },
        methods: {
            editWorkValidate() {
                return vc.validate.validate({
                    editWorkInfo: $that.editWorkInfo
                }, {
                    'editWorkInfo.workName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "标题不能为空"
                        }
                    ],
                    'editWorkInfo.wtId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型不能为空"
                        }
                    ],
                    'editWorkInfo.workCycle': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "标识不能为空"
                        }
                    ],
                    'editWorkInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        }
                    ],
                    'editWorkInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        }
                    ],

                });
            },
            saveWorkPool: function () {
                if (!$that.editWorkValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/work.updateWorkPool',
                    JSON.stringify($that.editWorkInfo), {
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
            },
            _listWorkTypes: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/workType.listWorkType',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.editWorkInfo.workTypes = _json.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _chooseWorkStaff: function () {

                vc.emit('selectStaff', 'openStaff', {
                    call: function (_staff) {
                        $that.editWorkInfo.staffs.push(_staff);
                    }
                });
            },
            _deleteWorkStaff: function (_staff) {
                let _staffs = [];
                $that.editWorkInfo.staffs.forEach(item => {
                    if (_staff.staffId != item.staffId) {
                        _staff.push(item);
                    }
                });
                $that.editWorkInfo.staffs = _staffs;
            },
            _chooseCopyWorkStaff: function () {

                vc.emit('selectStaff', 'openStaff', {
                    call: function (_staff) {
                        $that.editWorkInfo.copyStaffs.push(_staff);
                    }
                });
            },
            _deleteCopyWorkStaff: function (_staff) {
                let _staffs = [];
                $that.editWorkInfo.copyStaffs.forEach(item => {
                    if (_staff.staffId != item.staffId) {
                        _staff.push(item);
                    }
                });
                $that.editWorkInfo.copyStaffs = _staffs;
            },
            _loadWorkPool: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        workId: $that.editWorkInfo.workId
                    }
                };
                //发送get请求
                vc.http.apiGet('/work.queryStartWork',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.copyObject(_json.data[0], $that.editWorkInfo);
                        vc.emit('textarea','setText',_json.data[0].content);
                        if(_json.data[0].pathUrl){
                            vc.emit('uploadFile', 'notifyVedio',_json.data[0].pathUrl);
                        }
                        $that._loadWorkCycle();
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadTaskStaff: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        workId: $that.editWorkInfo.workId
                    }
                };
                //发送get请求
                vc.http.apiGet('/workTask.listWorkTask',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.editWorkInfo.staffs = _json.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadWorkCopy: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        workId: $that.editWorkInfo.workId
                    }
                };
                //发送get请求
                vc.http.apiGet('/workCopy.listWorkCopy',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.editWorkInfo.copyStaffs = _json.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadWorkCycle: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        workId: $that.editWorkInfo.workId
                    }
                };
                //发送get请求
                vc.http.apiGet('/workCycle.listWorkCycle',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        //$that.editWorkInfo.copyStaffs = _json.data;
                        $that.editWorkInfo.period = _json.data[0].period;
                        if (_json.data[0].periodMonth) {
                            $that.editWorkInfo.months = _json.data[0].periodMonth.split(',');
                        }
                        if (_json.data[0].periodDay) {
                            $that.editWorkInfo.days = _json.data[0].periodDay.split(',');
                        }
                        if (_json.data[0].workdays) {
                            $that.editWorkInfo.workdays = _json.data[0].workdays.split(',');
                        }
                        $that.editWorkInfo.hours = _json.data[0].hours;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);