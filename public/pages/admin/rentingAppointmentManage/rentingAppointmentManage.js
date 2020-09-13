/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            rentingAppointmentManageInfo: {
                rentingAppointments: [],
                total: 0,
                records: 1,
                moreCondition: false,
                appointmentId: '',
                conditions: {
                    tenantName: '',
                    tenantTel: '',
                    appointmentRoomId: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listRentingAppointments(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('rentingAppointmentManage', 'listRentingAppointment', function (_param) {
                vc.component._listRentingAppointments(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listRentingAppointments(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listRentingAppointments: function (_page, _rows) {

                vc.component.rentingAppointmentManageInfo.conditions.page = _page;
                vc.component.rentingAppointmentManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.rentingAppointmentManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/rentingAppointment/queryRentingAppointment',
                    param,
                    function (json, res) {
                        var _rentingAppointmentManageInfo = JSON.parse(json);
                        vc.component.rentingAppointmentManageInfo.total = _rentingAppointmentManageInfo.total;
                        vc.component.rentingAppointmentManageInfo.records = _rentingAppointmentManageInfo.records;
                        vc.component.rentingAppointmentManageInfo.rentingAppointments = _rentingAppointmentManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.rentingAppointmentManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddRentingAppointmentModal: function () {
                vc.emit('addRentingAppointment', 'openAddRentingAppointmentModal', {});
            },
            _openEditRentingAppointmentModel: function (_rentingAppointment) {
                vc.emit('editRentingAppointment', 'openEditRentingAppointmentModal', _rentingAppointment);
            },
            _openDeleteRentingAppointmentModel: function (_rentingAppointment) {
                vc.emit('deleteRentingAppointment', 'openDeleteRentingAppointmentModal', _rentingAppointment);
            },
            _queryRentingAppointmentMethod: function () {
                vc.component._listRentingAppointments(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.rentingAppointmentManageInfo.moreCondition) {
                    vc.component.rentingAppointmentManageInfo.moreCondition = false;
                } else {
                    vc.component.rentingAppointmentManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
