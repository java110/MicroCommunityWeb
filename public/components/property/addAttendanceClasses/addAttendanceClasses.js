(function (vc) {
    vc.extends({
        data: {
            addAttendanceClassesInfo: {
                classesId: '',
                classesName: '',
                timeOffset: '',
                leaveOffset: '',
                lateOffset: '',
                classesObjType: '',
                classesObjId: '',
                classesObjName: ''
                maxLastOffset:'',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addAttendanceClasses', 'openAddAttendanceClassesModal', function () {
                $('#addAttendanceClassesModel').modal('show');
            });
        },
        methods: {
            addAttendanceClassesValidate() {
                return vc.validate.validate({
                    addAttendanceClassesInfo: vc.component.addAttendanceClassesInfo
                }, {
                    'addAttendanceClassesInfo.classesName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "班次名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "班次名称格式错误"
                        }
                    ],
                    'addAttendanceClassesInfo.timeOffset': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "打卡范围不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "打卡范围格式错误"
                        }
                    ],
                    'addAttendanceClassesInfo.clockCount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "打卡次数不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "打卡次数错误"
                        }
                    ],
                    'addAttendanceClassesInfo.leaveOffset': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "迟到范围不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "20",
                            errInfo: "迟到范围错误"
                        }
                    ],
                    'addAttendanceClassesInfo.lateOffset': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "早退范围不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "20",
                            errInfo: "早退范围错误"
                        }
                    ],
                    'addAttendanceClassesInfo.classesObjId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "班次对象不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "班次对象错误"
                        }
                    ]
                });
            },
            saveAttendanceClassesInfo: function () {
                vc.http.apiPost(
                    '/attendanceClasses.saveAttendanceClasses',
                    JSON.stringify(vc.component.addAttendanceClassesInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addAttendanceClassesModel').modal('hide');
                            vc.component.clearAddAttendanceClassesInfo();
                            vc.emit('attendanceClassesManage', 'listAttendanceClasses', {});
                            vc.toast("添加成功");
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
            clearAddAttendanceClassesInfo: function () {
                vc.component.addAttendanceClassesInfo = {
                    classesId: '',
                    classesName: '',
                    timeOffset: '',
                    leaveOffset: '',
                    lateOffset: '',
                    classesObjType: '',
                    classesObjId: '',
                    classesObjName: ''
                    maxLastOffset:'',
                };
            },
        }
    });
})(window.vc);