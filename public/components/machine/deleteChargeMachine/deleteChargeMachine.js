(function (vc, vm) {
    vc.extends({
        data: {
            deleteChargeMachineInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteChargeMachine', 'openDeleteChargeMachineModal', function (_params) {
                vc.component.deleteChargeMachineInfo = _params;
                $('#deleteChargeMachineModel').modal('show');
            });
        },
        methods: {
            deleteChargeMachine: function () {
                vc.component.deleteChargeMachineInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/chargeMachine.deleteChargeMachine',
                    JSON.stringify(vc.component.deleteChargeMachineInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteChargeMachineModel').modal('hide');
                            vc.emit('chargeMachineManage', 'listChargeMachine', {});
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
            closeDeleteChargeMachineModel: function () {
                $('#deleteChargeMachineModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
