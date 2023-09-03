(function (vc, vm) {
    vc.extends({
        data: {
            classesStateInfo: {
                classesId: '',
                stateName: '',
                state: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('classesState', 'openClassesStateModal', function (_params) {
                vc.copyObject(_params, vc.component.classesStateInfo);
                $('#classesStateModel').modal('show');
            });
        },
        methods: {
            _changeClassesState: function () {
                vc.http.apiPost(
                    '/classes.updateClassesState',
                    JSON.stringify(vc.component.classesStateInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#classesStateModel').modal('hide');
                            vc.emit('classesManage', 'listClasses', {});
                            vc.toast("操作成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            _closeClassesStateModel: function () {
                $('#classesStateModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);