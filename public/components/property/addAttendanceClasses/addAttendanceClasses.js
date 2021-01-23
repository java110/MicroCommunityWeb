(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addAttendanceClassesInfo: {
                classesId: '',
                classesName: '',
                timeOffset: '',
                clockCount: '',
                clockType: '',
                clockTypeValue: '',
                leaveOffset: '',
                lateOffset: '',
                classesObjType: '',
                classesObjId: '',
                attrs: [

                ]
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
                        },
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
                        },
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
                        },
                    ],
                    'addAttendanceClassesInfo.clockType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "打卡类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "打卡类型错误"
                        },
                    ],
                    'addAttendanceClassesInfo.clockTypeValue': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "打卡规则不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "打卡规则格式错误"
                        },
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
                        },
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
                        },
                    ],
                    'addAttendanceClassesInfo.classesObjType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "班次对象类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "班次对象类型错误"
                        },
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
                        },
                    ],




                });
            },
            saveAttendanceClassesInfo: function () {
                if (!vc.component.addAttendanceClassesValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addAttendanceClassesInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addAttendanceClassesInfo);
                    $('#addAttendanceClassesModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    'attendanceClasses.saveAttendanceClasses',
                    JSON.stringify(vc.component.addAttendanceClassesInfo),
                    {
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

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddAttendanceClassesInfo: function () {
                vc.component.addAttendanceClassesInfo = {
                    classesName: '',
                    timeOffset: '',
                    clockCount: '',
                    clockType: '',
                    clockTypeValue: '',
                    leaveOffset: '',
                    lateOffset: '',
                    classesObjType: '',
                    classesObjId: '',
                    attrs: []

                };
            },
            _addAttendanceChangeClockCount: function () {
                let _clockCount = $that.addAttendanceClassesInfo.clockCount;
                let _attrs = [];
                if (_clockCount > 1) {
                    _attrs.push(
                        {
                            specCd: '10000',
                            value: '',
                            name: '上午上班',
                            seq: 1
                        }
                    );
                    _attrs.push(
                        {
                            specCd: '20000',
                            value: '',
                            name: '下午下班',
                            seq: 4
                        }
                    );
                }
                if (_clockCount > 3) {
                    _attrs.push(
                        {
                            specCd: '11000',
                            value: '',
                            name: '中午下班',
                            seq: 2
                        }
                    );
                    _attrs.push(
                        {
                            specCd: '21000',
                            value: '',
                            name: '中午上班',
                            seq: 3
                        }
                    );
                }

                if (_clockCount > 5) {
                    _attrs.push(
                        {
                            specCd: '12000',
                            value: '',
                            name: '晚上上班',
                            seq: 5
                        }
                    );
                    _attrs.push(
                        {
                            specCd: '22000',
                            value: '',
                            name: '晚上下班',
                            seq: 6
                        }
                    );
                }


                let _newAttrs = _attrs.sort(function (a, b) {
                    return a.seq - b.seq ;
                });

                $that.addAttendanceClassesInfo.attrs = _newAttrs;
            }
        }
    });

})(window.vc);
