(function (vc, vm) {

    vc.extends({
        data: {
            scheduleClassesStateInfo: {
                scheduleId: '',
                stateName: '',
                state: ''

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('scheduleClassesState', 'openScheduleClassesStateModal', function (_params) {
                vc.copyObject(_params, vc.component.scheduleClassesStateInfo);
                $('#scheduleClassesStateModel').modal('show');

            });
        },
        methods: {
            _changeScheduleClassesState: function () {
                vc.http.apiPost(
                    '/scheduleClasses.updateScheduleClassesState',
                    JSON.stringify(vc.component.scheduleClassesStateInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#scheduleClassesStateModel').modal('hide');
                            vc.emit('scheduleClasses', 'listScheduleClasses', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);

                    });
            },
            _closeScheduleClassesStateModel: function () {
                $('#scheduleClassesStateModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
