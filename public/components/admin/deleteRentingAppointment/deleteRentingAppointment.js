(function (vc, vm) {

    vc.extends({
        data: {
            deleteRentingAppointmentInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteRentingAppointment', 'openDeleteRentingAppointmentModal', function (_params) {

                vc.component.deleteRentingAppointmentInfo = _params;
                $('#deleteRentingAppointmentModel').modal('show');

            });
        },
        methods: {
            deleteRentingAppointment: function () {
                vc.component.deleteRentingAppointmentInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/rentingAppointment/deleteRentingAppointment',
                    JSON.stringify(vc.component.deleteRentingAppointmentInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteRentingAppointmentModel').modal('hide');
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
            }
        }
    });

})(window.vc, window.vc.component);
