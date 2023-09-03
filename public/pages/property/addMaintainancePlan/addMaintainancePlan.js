(function (vc) {
    vc.extends({
        data: {
            addMaintainancePlanInfo: {
                planId: '',
                planName: '',
                standardId: '',
                standards:[],
                planPeriod: '',
                startDate: vc.dateFormat(new Date()),
                endDate: '2050-01-01',
                state: '2020025',
                remark: '',
                months: [],
                days: [],
                everyDays: [],
                staffs: [],
                machines:[]
            }
        },
        watch: {
            'addMaintainancePlanInfo.machines': function() { //'goodList'是我要渲染的对象，也就是我要等到它渲染完才能调用函数
                this.$nextTick(function() {
                    $('#machineIds').selectpicker({
                        title: '选填，请选择保养设备',
                        styleBase: 'form-control',
                        width: 'auto'
                    });

                    $('#machineIds').selectpicker('refresh');
                })
            }
        },
        _initMethod: function () {
            vc.component._initAddMaintainancePlanDateInfo();
            
            $that._listEquipmentAccounts();
            $that._listAddMaintainanceStandards();
            vc.emit('selectStaffs', 'setStaffs', $that.addMaintainancePlanInfo.staffs);
        },
        _initEvent: function () {

            vc.on("addMaintainancePlanInfo", "notify", function (_param) {
                if (_param.hasOwnProperty("staffId")) {
                    vc.component.addMaintainancePlanInfo.staffId = _param.staffId;
                    vc.component.addMaintainancePlanInfo.staffName = _param.staffName;
                }
            });
        },
        methods: {
            addMaintainancePlanValidate() {
                return vc.validate.validate({
                    addMaintainancePlanInfo: vc.component.addMaintainancePlanInfo
                }, {
                    'addMaintainancePlanInfo.planName': [{
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
                    'addMaintainancePlanInfo.standardId': [{
                        limit: "required",
                        param: "",
                        errInfo: "保养标准不能为空"
                    }],
                    'addMaintainancePlanInfo.planPeriod': [{
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
                    'addMaintainancePlanInfo.startDate': [{
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
                    'addMaintainancePlanInfo.endDate': [{
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
                    'addMaintainancePlanInfo.state': [{
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
                    'addMaintainancePlanInfo.remark': [{
                        limit: "maxLength",
                        param: "200",
                        errInfo: "备注信息不能超过200位"
                    }],
                });
            },
            _initAddMaintainancePlanDateInfo: function () {
                vc.initDate('addMaintainancePlanStartDate', function (_value) {
                    $that.addMaintainancePlanInfo.startDate = _value;
                });
                vc.initDate('addMaintainancePlanEndDate', function (_value) {
                    $that.addMaintainancePlanInfo.endDate = _value;
                });
            },
            saveMaintainancePlanInfo: function () {
                if (!vc.component.addMaintainancePlanValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addMaintainancePlanInfo.communityId = vc.getCurrentCommunity().communityId;
                $that.addMaintainancePlanInfo.maintainanceMonth = $that.addMaintainancePlanInfo.months.join(',');
                $that.addMaintainancePlanInfo.maintainanceDay = $that.addMaintainancePlanInfo.days.join(',');
                $that.addMaintainancePlanInfo.maintainanceEveryday = $that.addMaintainancePlanInfo.everyDays;
                //不提交数据将数据 回调给侦听处理
                vc.http.apiPost(
                    '/maintainancePlan.saveMaintainancePlan',
                    JSON.stringify(vc.component.addMaintainancePlanInfo), {
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
                $that.addMaintainancePlanInfo.months = [];
                $that.addMaintainancePlanInfo.days = [];
                $that.addMaintainancePlanInfo.everyDays = [];
                if ($that.addMaintainancePlanInfo.planPeriod == '2020022') {
                    for (let _month = 1; _month < 13; _month++) {
                        $that.addMaintainancePlanInfo.months.push(_month);
                    }
                    for (let _day = 1; _day < 32; _day++) {
                        $that.addMaintainancePlanInfo.days.push(_day);
                    }
                } else {
                    for (let _day = 1; _day < 8; _day++) {
                        $that.addMaintainancePlanInfo.everyDays.push(_day);
                    }
                }
            },
            _listAddMaintainanceStandards: function () {
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
                        $that.addMaintainancePlanInfo.standards = _maintainanceRouteManageInfo.data;

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listEquipmentAccounts: function (_page, _row) {
                let param = {
                    params: {
                        page:1,
                        row:100,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/equipmentAccount.listEquipmentAccount',
                    param,
                    function (json, res) {
                        var _equipmentAccountManageInfo = JSON.parse(json);
                        vc.component.addMaintainancePlanInfo.machines = _equipmentAccountManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);