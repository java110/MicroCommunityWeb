(function (vc, vm) {
    vc.extends({
        data: {
            editInspectionPlanInfo: {
                inspectionPlanId: '',
                inspectionPlanName: '',
                inspectionRouteId: '',
                inspectionPlanPeriod: '',
                inspectionPlanPeriods: [],
                startDate: '',
                endDate: '2050-01-01',
                beforeTime: '30',
                startTime: '',
                endTime: '',
                signType: '',
                canReexamine: '',
                signTypes: [],
                state: '2020025',
                remark: '',
                months: [],
                days: [],
                workdays: [],
                inspectionRoutes: [],
                staffs: []
            }
        },
        _initMethod: function () {
            $that._initInspectionPlanEditInfo();
            vc.getDict('inspection_plan', "sign_type", function (_data) {
                vc.component.editInspectionPlanInfo.signTypes = _data;
            });
            vc.getDict('inspection_plan', "inspection_plan_period", function (_data) {
                vc.component.editInspectionPlanInfo.inspectionPlanPeriods = _data;
            });
        },
        _initEvent: function () {
            // vc.component._initEditInspectionPlanDateInfo();
            vc.on('editInspectionPlan', 'openEditInspectionPlanModal', function (_params) {
                vc.component.refreshEditInspectionPlanInfo();
                vc.copyObject(_params, vc.component.editInspectionPlanInfo);
                vc.component.editInspectionPlanInfo.communityId = vc.getCurrentCommunity().communityId;
                $that.editInspectionPlanInfo.months = _params.inspectionMonth.split(',');
                $that.editInspectionPlanInfo.days = _params.inspectionDay.split(',');
                $that.editInspectionPlanInfo.workdays = _params.inspectionWorkday.split(',');
                $('#editInspectionPlanModel').modal('show');
                $that._listEditInspectionRoutes();
                $that._listEditInspectionPlanStaffs();
            });
            vc.on('editInspectionPlanInfo', 'notify', function (_param) {
                vc.component.editInspectionPlanInfo.inspectionRouteId = _param.inspectionRouteId;
            })
        },
        methods: {
            _initInspectionPlanEditInfo: function () {
                $('.editInspectionPlanStartDate').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editInspectionPlanStartDate').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editInspectionPlanStartDate").val();
                        var start = Date.parse(new Date(value));
                        var end = Date.parse(new Date(vc.component.editInspectionPlanInfo.endDate));
                        if (start - end >= 0) {
                            vc.toast("巡检开始日期必须小于巡检结束日期");
                            $(".editInspectionPlanStartDate").val('');
                            vc.component.editInspectionPlanInfo.startDate = "";
                        } else {
                            vc.component.editInspectionPlanInfo.startDate = value;
                        }
                    });
                $('.editInspectionPlanEndDate').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editInspectionPlanEndDate').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editInspectionPlanEndDate").val();
                        var start = Date.parse(new Date(vc.component.editInspectionPlanInfo.startDate));
                        var end = Date.parse(new Date(value));
                        if (start - end >= 0) {
                            vc.toast("巡检结束日期必须大于巡检开始日期");
                            $(".editInspectionPlanEndDate").val('');
                            vc.component.editInspectionPlanInfo.endDate = "";
                        } else {
                            vc.component.editInspectionPlanInfo.endDate = value;
                        }
                    });
                $('.editInspectionPlanStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'hh:ii',
                    startView: "day",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: true
                });
                $('.editInspectionPlanStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editInspectionPlanStartTime").val();
                        // var start = Date.parse(new Date(value));
                        // var end = Date.parse(new Date(vc.component.editInspectionPlanInfo.endTime));
                        // if (start - end >= 0) {
                        //     vc.toast("巡检开始时间必须小于巡检结束时间");
                        //     $(".editInspectionPlanStartTime").val('');
                        //     vc.component.editInspectionPlanInfo.startTime = "";
                        // } else {
                            vc.component.editInspectionPlanInfo.startTime = value;
                        // }
                    });
                $('.editInspectionPlanEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'hh:ii',
                    startView: "day",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: true
                });
                $('.editInspectionPlanEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editInspectionPlanEndTime").val();
                        // var start = Date.parse(new Date(vc.component.editInspectionPlanInfo.startTime));
                        // var end = Date.parse(new Date(value));
                        // if (start - end >= 0) {
                        //     vc.toast("巡检结束时间必须大于巡检开始时间");
                        //     $(".editInspectionPlanEndTime").val('');
                        //     vc.component.editInspectionPlanInfo.endTime = "";
                        // } else {
                            vc.component.editInspectionPlanInfo.endTime = value;
                        // }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control editInspectionPlanStartDate')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control editInspectionPlanEndDate")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName('form-control editInspectionPlanStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control editInspectionPlanEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            editInspectionPlanValidate: function () {
                return vc.validate.validate({
                    editInspectionPlanInfo: vc.component.editInspectionPlanInfo
                }, {
                    'editInspectionPlanInfo.inspectionPlanName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "计划名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,100",
                            errInfo: "巡检计划名称不能超过100位"
                        }
                    ],
                    'editInspectionPlanInfo.inspectionRouteId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检路线不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,30",
                            errInfo: "巡检路线不能超过30位"
                        }
                    ],
                    'editInspectionPlanInfo.inspectionPlanPeriod': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "执行周期不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,12",
                            errInfo: "执行周期格式错误"
                        }
                    ],
                    'editInspectionPlanInfo.startDate': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检计划开始日期不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "巡检计划开始日期不是有效的日期格式"
                        }
                    ],
                    'editInspectionPlanInfo.endDate': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检计划结束日期不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "巡检计划结束日期不是有效的日期格式"
                        }
                    ],
                    'editInspectionPlanInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检计划开始时间不能为空"
                        }
                    ],
                    'editInspectionPlanInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检计划结束时间不能为空"
                        }
                    ],
                    'editInspectionPlanInfo.signType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "签到方式不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "签到方式格式错误"
                        }
                    ],
                    'editInspectionPlanInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "状态不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "签到方式格式错误"
                        }
                    ],
                    'editInspectionPlanInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注信息不能超过200位"
                        }
                    ],
                    'editInspectionPlanInfo.inspectionPlanId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检计划名称不能为空"
                        }
                    ]
                });
            },
            editInspectionPlan: function () {
                if (!vc.component.editInspectionPlanValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.editInspectionPlanInfo.inspectionMonth = $that.editInspectionPlanInfo.months.join(',');
                $that.editInspectionPlanInfo.inspectionDay = $that.editInspectionPlanInfo.days.join(',');
                $that.editInspectionPlanInfo.inspectionWorkday = $that.editInspectionPlanInfo.workdays.join(',');
                vc.http.apiPost(
                    '/inspectionPlan.updateInspectionPlan',
                    JSON.stringify(vc.component.editInspectionPlanInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editInspectionPlanModel').modal('hide');
                            vc.emit('inspectionPlanManage', 'listInspectionPlan', {});
                            vc.toast("修改成功");
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
            refreshEditInspectionPlanInfo: function () {
                var signTypes = vc.component.editInspectionPlanInfo.signTypes;
                var inspectionPlanPeriods = vc.component.editInspectionPlanInfo.inspectionPlanPeriods;
                vc.component.editInspectionPlanInfo = {
                    inspectionPlanId: '',
                    inspectionPlanName: '',
                    inspectionRouteId: '',
                    inspectionPlanPeriod: '',
                    inspectionPlanPeriods: inspectionPlanPeriods,
                    startDate: vc.dateFormat(new Date()),
                    endDate: '2050-01-01',
                    beforeTime: '30',
                    startTime: '',
                    endTime: '',
                    signType: '',
                    canReexamine: '',
                    signTypes: signTypes,
                    state: '2020025',
                    remark: '',
                    months: [],
                    days: [],
                    workdays: [],
                    inspectionRoutes: [],
                    staffs: []
                };
            },
            /*_initEditInspectionPlanDateInfo: function () {
                /!*vc.initDate('editInspectionPlanStartDate', function (_value) {
                    $that.editInspectionPlanInfo.startDate = _value;
                });
                vc.initDate('editInspectionPlanEndDate', function (_value) {
                    $that.editInspectionPlanInfo.endDate = _value;
                });*!/
                /!*vc.initHourMinute('editInspectionPlanStartTime', function (_value) {
                    $that.editInspectionPlanInfo.startTime = _value;
                });
                vc.initHourMinute('editInspectionPlanEndTime', function (_value) {
                    $that.editInspectionPlanInfo.endTime = _value;
                })*!/
            },*/
            _listEditInspectionRoutes: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/inspectionRoute.listInspectionRoutes',
                    param,
                    function (json, res) {
                        let _inspectionRouteManageInfo = JSON.parse(json);
                        $that.editInspectionPlanInfo.inspectionRoutes = _inspectionRouteManageInfo.inspectionRoutes;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listEditInspectionPlanStaffs: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        inspectionPlanId: $that.editInspectionPlanInfo.inspectionPlanId
                    }
                };
                //发送get请求
                vc.http.apiGet('/inspectionPlanStaff.listInspectionPlanStaffs',
                    param,
                    function (json, res) {
                        let _inspectionRouteManageInfo = JSON.parse(json);
                        _inspectionRouteManageInfo.inspectionPlanStaffs.forEach(item => {
                            item.userId = item.staffId;
                            item.name = item.staffName;
                        });
                        $that.editInspectionPlanInfo.staffs = _inspectionRouteManageInfo.inspectionPlanStaffs;
                        vc.emit('selectStaffs', 'setStaffs', $that.editInspectionPlanInfo.staffs);
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc, window.vc.component);
