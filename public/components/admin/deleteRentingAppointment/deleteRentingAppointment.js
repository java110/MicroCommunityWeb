(function (vc, vm) {

    vc.extends({
        data: {
            deleteRentingAppointmentInfo: {
                msg: '',
                appointmentId: '',
                tenantName: ''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteRentingAppointment', 'openDeleteRentingAppointmentModal', function (_params) {

                //vc.component.deleteRentingAppointmentInfo = _params;
                vc.copyObject(_params, $that.deleteRentingAppointmentInfo);
                $('#deleteRentingAppointmentModel').modal('show');

            });
        },
        methods: {
            deleteRentingAppointment: function () {

                let data = {
                    appointmentId: $that.deleteRentingAppointmentInfo.appointmentId,
                    state: '2002',
                    msg: $that.deleteRentingAppointmentInfo.msg
                };

                if (data.msg == '') {
                    vc.toast('请填写原因');
                    return;
                }
                vc.http.apiPost(
                    '/rentingAppointment/updateRentingAppointment',
                    JSON.stringify(data),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteRentingAppointmentModel').modal('hide');
                            $that._clearRentingAppointment();
                            vc.emit('rentingAppointmentManage', 'listRentingAppointment', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteRentingAppointmentModel: function () {
                $('#deleteRentingAppointmentModel').modal('hide');
            },
            _clearRentingAppointment: function () {
                $that.deleteRentingAppointmentInfo = {
                    msg: '',
                    appointmentId: '',
                    tenantName: ''
                }
            }
        }
    });

})(window.vc, window.vc.component);
