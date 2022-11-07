(function (vc) {
    vc.extends({
        data: {
            editMaintainancePlanInfo: {
                planId: '',
                planName: '',
                standardId: '',
                standards: [],
                planPeriod: '',
                startDate: vc.dateFormat(new Date()),
                endDate: '2050-01-01',
                state: '2020025',
                remark: '',
                months: [],
                days: [],
                everyDays: [],
                staffs: [],
                machines: []
            }
        },
        _initMethod: function () {
            $that.editMaintainancePlanInfo.planId = vc.getParam('planId');
            vc.component._initAddMaintainancePlanDateInfo();

            $that._listEditMaintainanceStandards();
            $that._listMaintainancePlans();
            $that._listMaintainancePlanStaffs();
            
        },
        _initEvent: function () {

            vc.on("editMaintainancePlanInfo", "notify", function (_param) {
                if (_param.hasOwnProperty("staffId")) {
                    vc.component.editMaintainancePlanInfo.staffId = _param.staffId;
                    vc.component.editMaintainancePlanInfo.staffName = _param.staffName;
                }
            });
        },
        methods: {
            editMaintainancePlanValidate() {
                return vc.validate.validate({
                    editMaintainancePlanInfo: vc.component.editMaintainancePlanInfo
                }, {
                    'editMaintainancePlanInfo.planName': [{
                        limit: "required",
                        param: "",
                        errInfo: "计划名称不能为空"
                    },
                    {
                        limit: "maxin",
                        param: "1,100",
                        errInfo: "巡检计划名称不能超过100位"
                    },
                    ],
                    'editMaintainancePlanInfo.standardId': [{
                        limit: "required",
                        param: "",
                        errInfo: "保养标准不能为空"
                    }],
                    'editMaintainancePlanInfo.planPeriod': [{
                        limit: "required",
                        param: "",
                        errInfo: "执行周期不能为空"
                    },
                    {
                        limit: "maxin",
                        param: "1,12",
                        errInfo: "执行周期格式错误"
                    },
                    ],
                    'editMaintainancePlanInfo.startDate': [{
                        limit: "required",
                        param: "",
                        errInfo: "计划开始时间不能为空"
                    },
                    {
                        limit: "date",
                        param: "",
                        errInfo: "计划开始时间不是有效的时间格式"
                    },
                    ],
                    'editMaintainancePlanInfo.endDate': [{
                        limit: "required",
                        param: "",
                        errInfo: "计划结束时间不能为空"
                    },
                    {
                        limit: "date",
                        param: "",
                        errInfo: "计划结束时间不是有效的时间格式"
                    },
                    ],
                    'editMaintainancePlanInfo.state': [{
                        limit: "required",
                        param: "",
                        errInfo: "状态不能为空"
                    },
                    {
                        limit: "num",
                        param: "",
                        errInfo: "签到方式格式错误"
                    },
                    ],
                    'editMaintainancePlanInfo.remark': [{
                        limit: "maxLength",
                        param: "200",
                        errInfo: "备注信息不能超过200位"
                    }],
                });
            },
            _initAddMaintainancePlanDateInfo: function () {
                vc.initDate('editMaintainancePlanStartDate', function (_value) {
                    $that.editMaintainancePlanInfo.startDate = _value;
                });
                vc.initDate('editMaintainancePlanEndDate', function (_value) {
                    $that.editMaintainancePlanInfo.endDate = _value;
                });
            },
            saveMaintainancePlanInfo: function () {
                if (!vc.component.editMaintainancePlanValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editMaintainancePlanInfo.communityId = vc.getCurrentCommunity().communityId;
                $that.editMaintainancePlanInfo.maintainanceMonth = $that.editMaintainancePlanInfo.months.join(',');
                $that.editMaintainancePlanInfo.maintainanceDay = $that.editMaintainancePlanInfo.days.join(',');
                $that.editMaintainancePlanInfo.maintainanceEveryday = $that.editMaintainancePlanInfo.everyDays;
                //不提交数据将数据 回调给侦听处理
                vc.http.apiPost(
                    '/maintainancePlan.updateMaintainancePlan',
                    JSON.stringify(vc.component.editMaintainancePlanInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model

                            vc.toast('成功');
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

            _changeMaintainancePeriod: function () {
                $that.editMaintainancePlanInfo.months = [];
                $that.editMaintainancePlanInfo.days = [];
                $that.editMaintainancePlanInfo.everyDays = [];
                if ($that.editMaintainancePlanInfo.planPeriod == '2020022') {
                    for (let _month = 1; _month < 13; _month++) {
                        $that.editMaintainancePlanInfo.months.push(_month);
                    }
                    for (let _day = 1; _day < 32; _day++) {
                        $that.editMaintainancePlanInfo.days.push(_day);
                    }
                } else {
                    for (let _day = 1; _day < 8; _day++) {
                        $that.editMaintainancePlanInfo.everyDays.push(_day);
                    }
                }
            },
            _listEditMaintainanceStandards: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/maintainance.listMaintainanceStandard',
                    param,
                    function (json, res) {
                        let _maintainanceRouteManageInfo = JSON.parse(json);
                        $that.editMaintainancePlanInfo.standards = _maintainanceRouteManageInfo.data;

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listMaintainancePlans: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        planId: $that.editMaintainancePlanInfo.planId
                    }
                };
                //发送get请求
                vc.http.apiGet('/maintainancePlan.listMaintainancePlan',
                    param,
                    function (json, res) {
                        let _maintainancePlanManageInfo = JSON.parse(json);
                        let _params = _maintainancePlanManageInfo.data[0];
                        vc.copyObject(_params, $that.editMaintainancePlanInfo);
                        $that.editMaintainancePlanInfo.months = _params.maintainanceMonth.split(',');
                        $that.editMaintainancePlanInfo.days = _params.maintainanceDay.split(',');
                        $that.editMaintainancePlanInfo.everyDays = _params.maintainanceEveryday;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listMaintainancePlanStaffs: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        planId: $that.editMaintainancePlanInfo.planId
                    }
                };
                //发送get请求
                vc.http.apiGet('/maintainancePlan.listMaintainancePlanStaff',
                    param,
                    function (json, res) {
                        let _maintainancePlanManageInfo = JSON.parse(json);
                        _maintainancePlanManageInfo.data.forEach(item => {
                            item.userId = item.staffId;
                            item.name = item.staffName;
                        });
                        $that.editMaintainancePlanInfo.staffs = _maintainancePlanManageInfo.data;
                        vc.emit('selectStaffs', 'setStaffs', $that.editMaintainancePlanInfo.staffs);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);