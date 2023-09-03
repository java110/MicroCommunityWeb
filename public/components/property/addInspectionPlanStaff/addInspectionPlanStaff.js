(function (vc) {
    vc.extends({
        data: {
            addInspectionPlanStaffInfo: {
                inspectionPlanId: '',
                staffId: '',
                staffName: '',
                startTime: '',
                endTime: ''
            }
        },
        _initMethod: function () {
            vc.component._initAddInspectionPlanStaffDateInfo();
        },
        _initEvent: function () {
            vc.on('addInspectionPlanStaff', 'openAddInspectionPlanStaffModal', function (_inspectionPlan) {
                $('#addInspectionPlanStaffModel').modal('show');
                $that.addInspectionPlanStaffInfo.inspectionPlanId = _inspectionPlan.inspectionPlanId;
            });
            vc.on("addInspectionPlanStaff", "notify", function (_param) {
                if (_param.hasOwnProperty("staffId")) {
                    vc.component.addInspectionPlanStaffInfo.staffId = _param.staffId;
                    vc.component.addInspectionPlanStaffInfo.staffName = _param.staffName;
                }
                if (_param.hasOwnProperty("inspectionPlanId")) {
                    vc.component.addInspectionPlanStaffInfo.inspectionPlanId = _param.inspectionPlanId;
                }
            });
            vc.on('addInspectionPlanStaff', 'switchOrg', function (_org) {
                _org.departmentId = _org.orgId;
                vc.emit('addInspectionPlanStaff', 'staffSelect2', 'setStaff', _org)
            });
        },
        methods: {
            addInspectionPlanStaffValidate() {
                return vc.validate.validate({
                    addInspectionPlanStaffInfo: vc.component.addInspectionPlanStaffInfo
                }, {
                    'addInspectionPlanStaffInfo.inspectionPlanId': [{
                        limit: "required",
                        param: "",
                        errInfo: "巡检计划不能为空"
                    }],
                    'addInspectionPlanStaffInfo.staffId': [{
                        limit: "required",
                        param: "",
                        errInfo: "执行人不能为空"
                    }],
                    'addInspectionPlanStaffInfo.staffName': [{
                        limit: "required",
                        param: "",
                        errInfo: "执行人员不能为空"
                    }],
                    'addInspectionPlanStaffInfo.startTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "开始时间不能为空"
                    }],
                    'addInspectionPlanStaffInfo.endTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "结束时间不能为空"
                    }]
                });
            },
            _initAddInspectionPlanStaffDateInfo: function () {
                $('.addInspectionPlanStaffStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'hh:ii',
                    initTime: true,
                    startView: 'day',
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addInspectionPlanStaffStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addInspectionPlanStaffStartTime").val();
                        vc.component.addInspectionPlanStaffInfo.startTime = value;
                    });
                $('.addInspectionPlanStaffEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'hh:ii',
                    initTime: true,
                    startView: 'day',
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addInspectionPlanStaffEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addInspectionPlanStaffEndTime").val();
                        vc.component.addInspectionPlanStaffInfo.endTime = value;
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control addInspectionPlanStaffStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control addInspectionPlanStaffEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _saveInspectionPlanStaff: function () {
                if (!vc.component.addInspectionPlanStaffValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addInspectionPlanStaffInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'inspectionPlanStaff.saveInspectionPlanStaff',
                    JSON.stringify(vc.component.addInspectionPlanStaffInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addInspectionPlanModel').modal('hide');
                            vc.emit('inspectionPlanStaffManage', 'listInspectionPlanStaff', {
                                inspectionPlanId: $that.addInspectionPlanStaffInfo.inspectionPlanId
                            });
                            vc.component.clearaddInspectionPlanStaffInfo();
                            $('#addInspectionPlanStaffModel').modal('hide');
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
            clearaddInspectionPlanStaffInfo: function () {
                vc.emit('addInspectionPlanStaff', 'staffSelect2', 'clearStaff', {});
                vc.emit('chooseOrgTree2', 'clearAll', {});
                vc.component.addInspectionPlanStaffInfo = {
                    inspectionPlanId: '',
                    staffId: '',
                    staffName: '',
                    startTime: '',
                    endTime: ''
                };
            },
            cleanInspectionPlanStaffAddModel: function () {
                vc.component.clearaddInspectionPlanStaffInfo();
                //员工select2
                vc.emit('addInspectionPlanStaff', 'staffSelect2', 'clearStaff', {});
                vc.emit('chooseOrgTree2', 'clearAll', {});
            }
        }
    });
})(window.vc);