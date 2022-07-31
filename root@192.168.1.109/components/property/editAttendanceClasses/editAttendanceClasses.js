(function (vc, vm) {
    vc.extends({
        data: {
            editAttendanceClassesInfo: {
                classesId: '',
                classesName: '',
                timeOffset: '',
                clockCount: '',
                clockTypes: [],
                clockType: '',
                clockTypeValue: '',
                leaveOffset: '',
                lateOffset: '',
                classesObjType: '',
                classesObjId: '',
                classesObjName: '',
                attrs: [],
                clockTypeValues: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editAttendanceClasses', 'openEditAttendanceClassesModal', function (_params) {
                vc.component.refreshEditAttendanceClassesInfo();
                $('#editAttendanceClassesModel').modal('show');
                vc.getDict('attendance_classes', "clock_type", function (_data) {
                    vc.component.editAttendanceClassesInfo.clockTypes = _data;
                });
                vc.copyObject(_params, vc.component.editAttendanceClassesInfo);
                vc.component.editAttendanceClassesInfo.communityId = vc.getCurrentCommunity().communityId;
                $that._initEditAttendanceClasses(_params.attrs);
            });
        },
        methods: {
            editAttendanceClassesValidate: function () {
                return vc.validate.validate({
                    editAttendanceClassesInfo: vc.component.editAttendanceClassesInfo
                }, {
                    'editAttendanceClassesInfo.classesName': [
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
                    'editAttendanceClassesInfo.timeOffset': [
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
                    'editAttendanceClassesInfo.clockCount': [
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
                    'editAttendanceClassesInfo.clockType': [
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
                    'editAttendanceClassesInfo.clockTypeValue': [
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
                    'editAttendanceClassesInfo.leaveOffset': [
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
                    'editAttendanceClassesInfo.lateOffset': [
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
                    'editAttendanceClassesInfo.classesObjType': [
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
                    'editAttendanceClassesInfo.classesObjId': [
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
                    'editAttendanceClassesInfo.classesId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "班组ID不能为空"
                        }
                    ]
                });
            },
            editAttendanceClasses: function () {
                let _clockType = $that.editAttendanceClassesInfo.clockType;
                if (_clockType == '1001') {
                    $that.editAttendanceClassesInfo.clockTypeValue = '*';
                } else if (_clockType == '1002') {
                    $that.editAttendanceClassesInfo.clockTypeValue = '?';
                } else {
                    let _clockTypeValue = '';
                    $that.editAttendanceClassesInfo.clockTypeValues.forEach(item => {
                        _clockTypeValue += (item + ',');
                    })
                    if (_clockTypeValue.endsWith(',')) {
                        _clockTypeValue = _clockTypeValue.substring(0, _clockTypeValue.length - 1)
                    }
                    $that.editAttendanceClassesInfo.clockTypeValue = _clockTypeValue;
                }
                if (!vc.component.editAttendanceClassesValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                var flag = "0";
                $that.editAttendanceClassesInfo.attrs.forEach(function (item) {
                    if (item.value == null || item.value == '' || item.value == 'undefined') {
                        vc.toast("上下班时间不能为空");
                        flag = "1";
                    }
                });
                if (flag == "1") {
                    return;
                }
                vc.http.apiPost(
                    'attendanceClasses.updateAttendanceClasses',
                    JSON.stringify(vc.component.editAttendanceClassesInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editAttendanceClassesModel').modal('hide');
                            vc.emit('attendanceClassesManage', 'listAttendanceClasses', {});
                            vc.toast("修改成功");
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditAttendanceClassesInfo: function () {
                vc.component.editAttendanceClassesInfo = {
                    classesId: '',
                    classesName: '',
                    timeOffset: '',
                    clockCount: '',
                    clockTypes: [],
                    clockType: '',
                    clockTypeValue: '',
                    leaveOffset: '',
                    lateOffset: '',
                    classesObjType: '',
                    classesObjId: '',
                    classesObjName: '',
                    attrs: [],
                    clockTypeValues: []
                }
            },
            _editAttendanceChangeClockCount: function () {
                let _clockCount = $that.editAttendanceClassesInfo.clockCount;
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
                    return a.seq - b.seq;
                });
                $that.editAttendanceClassesInfo.attrs = _newAttrs;
                $that.$nextTick(function () {
                    //方法
                    $that.editAttendanceClassesInfo.attrs.forEach(item => {
                        //初始化日期组件
                        vc.initHourMinute(item.specCd, function (_value) {
                            item.value = _value;
                        });
                    });
                });
            },
            _initEditAttendanceClasses: function (_attrs) {
                let _clockTypeValue = $that.editAttendanceClassesInfo.clockTypeValue;
                let _clockTypeValues = $that.editAttendanceClassesInfo.clockTypeValues;
                if (_clockTypeValue.indexOf(',') > -1) {
                    _clockTypeValues = [];
                    _clockTypeValue.split(',').forEach(item => {
                        _clockTypeValues.push(item);
                    })
                    $that.editAttendanceClassesInfo.clockTypeValues = _clockTypeValues;
                }
                $that._editAttendanceChangeClockCount();
                let _newAttrs = $that.editAttendanceClassesInfo.attrs;
                _newAttrs.forEach(newItem => {
                    _attrs.forEach(item => {
                        if (newItem.specCd == item.specCd) {
                            newItem.value = item.value;
                            newItem.attrId = item.attrId;
                        }
                    })
                });
                $that.editAttendanceClassesInfo.attrs = _newAttrs;
                // $that.$nextTick(function () {
                //     //方法
                //     $that.editAttendanceClassesInfo.attrs.forEach(item => {
                //         //初始化日期组件
                //         vc.initHourMinute(item.specCd, function (_value) {
                //             item.value = _value;
                //         });
                //     });
                // });
            }
        }
    });
})(window.vc, window.vc.component);
