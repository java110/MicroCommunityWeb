(function (vc, vm) {
    vc.extends({
        data: {
            editRoomRenovationInfo: {
                rId: '',
                roomName: '',
                personName: '',
                personTel: '',
                startTime: '',
                endTime: '',
                remark: '',
                state: '',
                isViolation: '',
                violationDesc: '',
                roomId: '',
                isPostpone: 'N',
                postponeTime: '',
                renovationCompany: '',
                personMain: '',
                personMainTel: ''
            }
        },
        watch: {
            editRoomRenovationInfo: {
                handler(val, oldVal) {
                    if (val.isPostpone == 'N') {
                        vc.component.editRoomRenovationInfo.postponeTime = '';
                    }
                },
                deep: true
            }
        },
        _initMethod: function () {
            vc.component.initEditRoomRenovation();
            /*vc.initDate('editStartTime', function (_startTime) {
                $that.editRoomRenovationInfo.startTime = _startTime;
            });
            vc.initDate('editEndTime', function (_endTime) {
                $that.editRoomRenovationInfo.endTime = _endTime;
                let start = Date.parse(new Date($that.editRoomRenovationInfo.startTime))
                let end = Date.parse(new Date($that.editRoomRenovationInfo.endTime))
                if (start - end >= 0) {
                    vc.toast("结束时间必须大于开始时间")
                    $that.editRoomRenovationInfo.endTime = '';
                }
            });*/
        },
        _initEvent: function () {
            vc.on('editRoomRenovation', 'openEditRoomRenovationModal', function (_params) {
                vc.component.refreshEditRoomRenovationInfo();
                $('#editRoomRenovationModel').modal('show');
                vc.copyObject(_params, vc.component.editRoomRenovationInfo);
                $that.editRoomRenovationInfo.startTime = vc.dateFormat(_params.startTime);
                $that.editRoomRenovationInfo.endTime = vc.dateFormat(_params.endTime);
                vc.component.editRoomRenovationInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            initEditRoomRenovation: function () {
                $('.editStartTime').datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editStartTime").val();
                        vc.component.editRoomRenovationInfo.startTime = value;
                    });
                $('.editEndTime').datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editEndTime").val();
                        var start = Date.parse(new Date(vc.component.editRoomRenovationInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于起始时间")
                            $(".editEndTime").val('')
                        } else {
                            vc.component.editRoomRenovationInfo.endTime = value;
                        }
                    });
                $('.addPostponeTime').datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addPostponeTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addPostponeTime").val();
                        var start = Date.parse(new Date(vc.component.editRoomRenovationInfo.endTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("延期时间必须大于结束时间")
                            $(".addPostponeTime").val('')
                        } else {
                            vc.component.editRoomRenovationInfo.postponeTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control editStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control editEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control addPostponeTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            editRoomRenovationValidate: function () {
                return vc.validate.validate({
                    editRoomRenovationInfo: vc.component.editRoomRenovationInfo
                }, {
                    'editRoomRenovationInfo.roomName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "房屋不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "房屋格式错误"
                        }
                    ],
                    'editRoomRenovationInfo.personName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "联系人格式错误"
                        }
                    ],
                    'editRoomRenovationInfo.personTel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "联系电话错误"
                        }
                    ],
                    'editRoomRenovationInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "装修时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "装修时间错误"
                        }
                    ],
                    'editRoomRenovationInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "结束时间错误"
                        }
                    ],
                    'editRoomRenovationInfo.isPostpone': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否延期不能为空"
                        }
                    ],
                    'editRoomRenovationInfo.renovationCompany': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "装修单位不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "装修单位格式错误"
                        }
                    ],
                    'editRoomRenovationInfo.personMain': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "装修负责人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "装修负责人格式错误"
                        }
                    ],
                    'editRoomRenovationInfo.personMainTel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "装修负责人电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "装修负责人电话错误"
                        }
                    ],
                    'editRoomRenovationInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注太长"
                        }
                    ],
                    'editRoomRenovationInfo.rId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "装修ID不能为空"
                        }
                    ]
                });
            },
            editRoomRenovation: function () {
                if (!vc.component.editRoomRenovationValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editRoomRenovationInfo.roomName = vc.component.editRoomRenovationInfo.roomName.trim();
                vc.component.editRoomRenovationInfo.personName = vc.component.editRoomRenovationInfo.personName.trim();
                vc.component.editRoomRenovationInfo.personTel = vc.component.editRoomRenovationInfo.personTel.trim();
                vc.component.editRoomRenovationInfo.remark = vc.component.editRoomRenovationInfo.remark.trim();
                vc.http.apiPost(
                    '/roomRenovation/updateRoomRenovation',
                    JSON.stringify(vc.component.editRoomRenovationInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editRoomRenovationModel').modal('hide');
                            vc.emit('roomRenovationManage', 'listRoomRenovation', {});
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            refreshEditRoomRenovationInfo: function () {
                vc.component.editRoomRenovationInfo = {
                    rId: '',
                    roomName: '',
                    personName: '',
                    personTel: '',
                    startTime: '',
                    endTime: '',
                    remark: '',
                    state: '',
                    isViolation: '',
                    violationDesc: '',
                    roomId: '',
                    isPostpone: 'N',
                    postponeTime: '',
                    renovationCompany: '',
                    personMain: '',
                    personMainTel: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
