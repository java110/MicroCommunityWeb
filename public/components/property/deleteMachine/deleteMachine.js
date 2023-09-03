(function (vc, vm) {
    vc.extends({
        data: {
            deleteMachineInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteMachine', 'openDeleteMachineModal', function (_params) {
                vc.component.deleteMachineInfo = _params;
                $('#deleteMachineModel').modal('show');
            });
        },
        methods: {
            deleteMachine: function () {
                vc.component.deleteMachineInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/machine.deleteMachine',
                    JSON.stringify(vc.component.deleteMachineInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMachineModel').modal('hide');
                            vc.emit('machineManage', 'listMachine', {});
                            vc.emit('monitorMachineManage', 'listMachine', {});
                            vc.emit('accessControlMachineManage', 'listMachine', {});
                            vc.emit('attendanceMachineManage', 'listMachine', {});
                            vc.emit('barrierGateMachineManage', 'listMachine', {});
                            vc.toast("删除成功");
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
            closeDeleteMachineModel: function () {
                $('#deleteMachineModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);