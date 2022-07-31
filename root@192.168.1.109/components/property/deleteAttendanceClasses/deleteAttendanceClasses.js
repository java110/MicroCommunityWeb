(function (vc, vm) {
    vc.extends({
        data: {
            deleteAttendanceClassesInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteAttendanceClasses', 'openDeleteAttendanceClassesModal', function (_params) {
                vc.component.deleteAttendanceClassesInfo = _params;
                $('#deleteAttendanceClassesModel').modal('show');
            });
        },
        methods: {
            deleteAttendanceClasses: function () {
                vc.component.deleteAttendanceClassesInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'attendanceClasses.deleteAttendanceClasses',
                    JSON.stringify(vc.component.deleteAttendanceClassesInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteAttendanceClassesModel').modal('hide');
                            vc.emit('attendanceClassesManage', 'listAttendanceClasses', {});
                            vc.toast("删除成功");
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeDeleteAttendanceClassesModel: function () {
                $('#deleteAttendanceClassesModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
