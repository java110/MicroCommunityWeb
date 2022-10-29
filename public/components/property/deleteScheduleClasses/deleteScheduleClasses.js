(function (vc, vm) {
    vc.extends({
        data: {
            deleteScheduleClassesInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteScheduleClasses', 'openDeleteScheduleClassesModal', function (_params) {
                vc.component.deleteScheduleClassesInfo = _params;
                $('#deleteScheduleClassesModel').modal('show');
            });
        },
        methods: {
            deleteScheduleClasses: function () {
                vc.http.apiPost(
                    '/scheduleClasses.deleteScheduleClasses',
                    JSON.stringify(vc.component.deleteScheduleClassesInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#deleteScheduleClassesModel').modal('hide');
                            vc.emit('scheduleClasses', 'listScheduleClasses', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeDeleteScheduleClassesModel: function () {
                $('#deleteScheduleClassesModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
