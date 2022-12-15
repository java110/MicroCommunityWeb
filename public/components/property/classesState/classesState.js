(function(vc, vm) {

    vc.extends({
        data: {
            classesStateInfo: {
                classesId: '',
                stateName: '',
                state: ''

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('classesState', 'openClassesStateModal', function(_params) {
                vc.copyObject(_params, vc.component.classesStateInfo);
                $('#classesStateModel').modal('show');
            });
        },
        methods: {
            _changeClassesState: function() {
                vc.http.apiPost(
                    '/classes.updateClassesState',
                    JSON.stringify(vc.component.classesStateInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#classesStateModel').modal('hide');
                            vc.emit('classesManage', 'listClasses', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);

                    });
            },
            _closeClassesStateModel: function() {
                $('#classesStateModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);