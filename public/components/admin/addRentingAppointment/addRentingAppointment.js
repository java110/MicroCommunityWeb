(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addRentingAppointmentInfo: {
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
            $that._initAddAppointmentTime();
        },
        _initEvent: function () {
            vc.on('addRentingAppointment', 'openAddRentingAppointmentModal', function () {
                $('#addRentingAppointmentModel').modal('show');
            });
        },
        methods: {
            _initAddAppointmentTime: function () {
                vc.component.addRentingAppointmentInfo.appointmentTime = vc.dateFormat(new Date().getTime());
                $('.addAppointmentTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true

                });
                $('.addAppointmentTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addAppointmentTime").val();
                        vc.component.addRentingAppointmentInfo.appointmentTime = value;
                    });
            },
            addRentingAppointmentValidate() {
                return vc.validate.validate({
                    addRentingAppointmentInfo: vc.component.addRentingAppointmentInfo
                }, {
                    'addRentingAppointmentInfo.tenantName': [
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
                    'addRentingAppointmentInfo.tenantSex': [
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
                    'addRentingAppointmentInfo.tenantTel': [
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
                    'addRentingAppointmentInfo.appointmentTime': [
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
                    'addRentingAppointmentInfo.appointmentRoomId': [
                        {
                            limit: "num",
                            param: "",
                            errInfo: "预约房屋格式错误"
                        },
                    ],
                    'addRentingAppointmentInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "备注不能超过500字"
                        },
                    ],




                });
            },
            saveRentingAppointmentInfo: function () {
                if (!vc.component.addRentingAppointmentValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addRentingAppointmentInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addRentingAppointmentInfo);
                    $('#addRentingAppointmentModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/rentingAppointment/saveRentingAppointment',
                    JSON.stringify(vc.component.addRentingAppointmentInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addRentingAppointmentModel').modal('hide');
                            vc.component.clearAddRentingAppointmentInfo();
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
            clearAddRentingAppointmentInfo: function () {
                vc.component.addRentingAppointmentInfo = {
                    tenantName: '',
                    tenantSex: '',
                    tenantTel: '',
                    appointmentTime: '',
                    appointmentRoomId: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
