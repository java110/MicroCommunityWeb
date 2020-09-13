(function (vc, vm) {

    vc.extends({
        data: {
            editRentingAppointmentInfo: {
                appointmentId: '',
                tenantName: '',
                tenantSex: '',
                tenantTel: '',
                appointmentTime: '',
                appointmentRoomId: '',
                remark: '',
            }
        },
        _initMethod: function () {
            $that._initEditAppointmentTime();
        },
        _initEvent: function () {
            vc.on('editRentingAppointment', 'openEditRentingAppointmentModal', function (_params) {
                vc.component.refreshEditRentingAppointmentInfo();
                $('#editRentingAppointmentModel').modal('show');
                vc.copyObject(_params, vc.component.editRentingAppointmentInfo);
                vc.component.editRentingAppointmentInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            _initEditAppointmentTime: function () {
                //vc.component.editRentingAppointmentInfo.appointmentTime = vc.dateFormat(new Date().getTime());
                $('.editAppointmentTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true

                });
                $('.editAppointmentTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editAppointmentTime").val();
                        vc.component.editRentingAppointmentInfo.appointmentTime = value;
                    });
            },
            editRentingAppointmentValidate: function () {
                return vc.validate.validate({
                    editRentingAppointmentInfo: vc.component.editRentingAppointmentInfo
                }, {
                    'editRentingAppointmentInfo.tenantName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "租客名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "租客名称不能超过64位"
                        },
                    ],
                    'editRentingAppointmentInfo.tenantSex': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "租客性别不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "年龄格式错误"
                        },
                    ],
                    'editRentingAppointmentInfo.tenantTel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "租客电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "手机号格式错误"
                        },
                    ],
                    'editRentingAppointmentInfo.appointmentTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预约时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "预约时间格式错误"
                        },
                    ],
                    'editRentingAppointmentInfo.appointmentRoomId': [
                        {
                            limit: "num",
                            param: "",
                            errInfo: "预约房屋格式错误"
                        },
                    ],
                    'editRentingAppointmentInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "备注不能超过500字"
                        },
                    ],
                    'editRentingAppointmentInfo.appointmentId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预约ID不能为空"
                        }]

                });
            },
            editRentingAppointment: function () {
                if (!vc.component.editRentingAppointmentValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/rentingAppointment/updateRentingAppointment',
                    JSON.stringify(vc.component.editRentingAppointmentInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editRentingAppointmentModel').modal('hide');
                            vc.emit('rentingAppointmentManage', 'listRentingAppointment', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditRentingAppointmentInfo: function () {
                vc.component.editRentingAppointmentInfo = {
                    appointmentId: '',
                    tenantName: '',
                    tenantSex: '',
                    tenantTel: '',
                    appointmentTime: '',
                    appointmentRoomId: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
