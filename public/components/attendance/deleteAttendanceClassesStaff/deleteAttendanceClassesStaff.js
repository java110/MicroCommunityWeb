(function (vc, vm) {
    vc.extends({
        data: {
            deleteAttendanceClassesStaffInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteAttendanceClassesStaff', 'openDeleteAttendanceClassesStaffModal', function (_params) {
                vc.component.deleteAttendanceClassesStaffInfo = _params;
                $('#deleteAttendanceClassesStaffModel').modal('show');
            });
        },
        methods: {
            deleteAttendanceClassesStaff: function () {
                vc.component.deleteAttendanceClassesStaffInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/attendanceClasses.deleteAttendanceClassesStaff',
                    JSON.stringify(vc.component.deleteAttendanceClassesStaffInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteAttendanceClassesStaffModel').modal('hide');
                            vc.emit('attendanceClassesStaffManage', 'listAttendanceClassesStaff', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);
                    });
            },
            closeDeleteAttendanceClassesStaffModel: function () {
                $('#deleteAttendanceClassesStaffModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
