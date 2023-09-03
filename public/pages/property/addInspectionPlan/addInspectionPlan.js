(function (vc) {
    vc.extends({
        data: {
            addInspectionPlanInfo: {
                inspectionPlanId: '',
                inspectionPlanName: '',
                inspectionRouteId: '',
                inspectionPlanPeriod: '',
                inspectionPlanPeriods: [],
                startDate: vc.dateFormat(new Date()),
                endDate: '2050-01-01',
                beforeTime: '30',
                startTime: '',
                endTime: '',
                signType: '',
                canReexamine: '1000',
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
            // vc.component._initAddInspectionPlanDateInfo();
            vc.component._initInspectionPlanAddInfo();
            vc.getDict('inspection_plan', "inspection_plan_period", function (_data) {
                vc.component.addInspectionPlanInfo.inspectionPlanPeriods = _data;
            });
            vc.getDict('inspection_plan', "sign_type", function (_data) {
                vc.component.addInspectionPlanInfo.signTypes = _data;
            });
            $that._listAddInspectionRoutes();
            vc.emit('selectStaffs', 'setStaffs', $that.addInspectionPlanInfo.staffs);
        },
        _initEvent: function () {
            vc.on("addInspectionPlanInfo", "notify", function (_param) {
                if (_param.hasOwnProperty("staffId")) {
                    vc.component.addInspectionPlanInfo.staffId = _param.staffId;
                    vc.component.addInspectionPlanInfo.staffName = _param.staffName;
                }
                if (_param.hasOwnProperty("inspectionRouteId")) {
                    vc.component.addInspectionPlanInfo.inspectionRouteId = _param.inspectionRouteId;
                }
            });
        },
        methods: {
            _initInspectionPlanAddInfo: function () {
                $('.addInspectionPlanStartDate').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addInspectionPlanStartDate').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addInspectionPlanStartDate").val();
                        var start = Date.parse(new Date(value));
                        var end = Date.parse(new Date(vc.component.addInspectionPlanInfo.endDate));
                        if (start - end > 0) {
                            vc.toast("巡检开始日期必须小于巡检结束日期");
                            $(".addInspectionPlanStartDate").val('');
                            vc.component.addInspectionPlanInfo.startDate = "";
                        } else {
                            vc.component.addInspectionPlanInfo.startDate = value;
                        }
                    });
                $('.addInspectionPlanEndDate').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addInspectionPlanEndDate').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addInspectionPlanEndDate").val();
                        var start = Date.parse(new Date(vc.component.addInspectionPlanInfo.startDate));
                        var end = Date.parse(new Date(value));
                        if (start - end > 0) {
                            vc.toast("巡检结束日期必须大于巡检开始日期");
                            $(".addInspectionPlanEndDate").val('');
                            vc.component.addInspectionPlanInfo.endDate = "";
                        } else {
                            vc.component.addInspectionPlanInfo.endDate = value;
                        }
                    });
                $('.addInspectionPlanStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'hh:ii',
                    startView: "day",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: true,
                    todayBtn: true
                });
                $('.addInspectionPlanStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addInspectionPlanStartTime").val();
                        // var start = Date.parse(new Date(value));
                        // var end = Date.parse(new Date(vc.component.addInspectionPlanInfo.endTime));
                        // if (start - end >= 0) {
                        //     vc.toast("巡检开始时间必须小于巡检结束时间");
                        //     $(".addInspectionPlanStartTime").val('');
                        //     vc.component.addInspectionPlanInfo.startTime = "";
                        // } else {
                            vc.component.addInspectionPlanInfo.startTime = value;
                        // }
                    });
                $('.addInspectionPlanEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'hh:ii',
                    startView: "day",
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: true,
                    todayBtn: true
                });
                $('.addInspectionPlanEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addInspectionPlanEndTime").val();
                        // var start = Date.parse(new Date(vc.component.addInspectionPlanInfo.startTime));
                        // var end = Date.parse(new Date(value));
                        // if (start - end >= 0) {
                        //     vc.toast("巡检结束时间必须大于巡检开始时间");
                        //     $(".addInspectionPlanEndTime").val('');
                        //     vc.component.addInspectionPlanInfo.endTime = "";
                        // } else {
                            vc.component.addInspectionPlanInfo.endTime = value;
                        // }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control addInspectionPlanStartDate')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control addInspectionPlanEndDate")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName('form-control addInspectionPlanStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control addInspectionPlanEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            addInspectionPlanValidate() {
                return vc.validate.validate({
                    addInspectionPlanInfo: vc.component.addInspectionPlanInfo
                }, {
                    'addInspectionPlanInfo.inspectionPlanName': [
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
                    'addInspectionPlanInfo.inspectionRouteId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检路线不能为空"
                        }
                    ],
                    'addInspectionPlanInfo.inspectionPlanPeriod': [
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
                    'addInspectionPlanInfo.startDate': [
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
                    'addInspectionPlanInfo.endDate': [
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
                    'addInspectionPlanInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检计划开始时间不能为空"
                        }
                    ],
                    'addInspectionPlanInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检计划结束时间不能为空"
                        }
                    ],
                    'addInspectionPlanInfo.signType': [
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
                    'addInspectionPlanInfo.state': [
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
                    'addInspectionPlanInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注信息不能超过200位"
                        }
                    ]
                });
            },
            /*_initAddInspectionPlanDateInfo: function () {
                vc.initDate('addInspectionPlanStartDate', function (_value) {
                    $that.addInspectionPlanInfo.startDate = _value;
                });
                vc.initDate('addInspectionPlanEndDate', function (_value) {
                    $that.addInspectionPlanInfo.endDate = _value;
                });
                vc.initHourMinute('addInspectionPlanStartTime', function (_value) {
                    $that.addInspectionPlanInfo.startTime = _value;
                });
                vc.initHourMinute('addInspectionPlanEndTime', function (_value) {
                    $that.addInspectionPlanInfo.endTime = _value;
                })
            },*/
            saveInspectionPlanInfo: function () {
                if (!vc.component.addInspectionPlanValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addInspectionPlanInfo.communityId = vc.getCurrentCommunity().communityId;
                $that.addInspectionPlanInfo.inspectionMonth = $that.addInspectionPlanInfo.months.join(',');
                $that.addInspectionPlanInfo.inspectionDay = $that.addInspectionPlanInfo.days.join(',');
                $that.addInspectionPlanInfo.inspectionWorkday = $that.addInspectionPlanInfo.workdays.join(',');
                //不提交数据将数据 回调给侦听处理
                vc.http.apiPost(
                    '/inspectionPlan.saveInspectionPlan',
                    JSON.stringify(vc.component.addInspectionPlanInfo), {
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
            clearAddInspectionPlanInfo: function () {
                let inspectionPlanPeriods = vc.component.addInspectionPlanInfo.inspectionPlanPeriods;
                let signTypes = vc.component.addInspectionPlanInfo.signTypes;
                vc.component.addInspectionPlanInfo = {
                    inspectionPlanName: '',
                    inspectionRouteId: '',
                    inspectionPlanPeriod: '',
                    staffId: '',
                    startDate: vc.dateFormat(new Date()),
                    endDate: '2050-01-01',
                    beforeTime: '30',
                    startTime: '',
                    endTime: '',
                    signType: '',
                    canReexamine: '1000',
                    state: '2020025',
                    remark: '',
                    signTypes: signTypes,
                    inspectionPlanPeriods: inspectionPlanPeriods,
                    months: [],
                    days: [],
                    workdays: [],
                    inspectionRoutes: [],
                    staffs: []
                };
            },
            _changeInspectionPeriod: function () {
                $that.addInspectionPlanInfo.months = [];
                $that.addInspectionPlanInfo.days = [];
                $that.addInspectionPlanInfo.workdays = [];
                if ($that.addInspectionPlanInfo.inspectionPlanPeriod == '2020022') {
                    for (let _month = 1; _month < 13; _month++) {
                        $that.addInspectionPlanInfo.months.push(_month);
                    }
                    for (let _day = 1; _day < 32; _day++) {
                        $that.addInspectionPlanInfo.days.push(_day);
                    }
                } else {
                    for (let _day = 1; _day < 8; _day++) {
                        $that.addInspectionPlanInfo.workdays.push(_day);
                    }
                }
            },
            _listAddInspectionRoutes: function () {
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
                        $that.addInspectionPlanInfo.inspectionRoutes = _inspectionRouteManageInfo.inspectionRoutes;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);