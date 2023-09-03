(function(vc, vm) {

    vc.extends({
        data: {
            stopChargeMachineInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('stopChargeMachine', 'openStopChargeMachineModal', function(_params) {

                vc.component.stopChargeMachineInfo = _params;
                $('#stopChargeMachineModel').modal('show');

            });
        },
        methods: {
            stopChargeMachine: function() {
                vc.component.stopChargeMachineInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/chargeMachine.stopCharge',
                    JSON.stringify(vc.component.stopChargeMachineInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#stopChargeMachineModel').modal('hide');
                            vc.emit('chargeMachineOrder', 'listChargeMachineOrder', {});
                            vc.emit('chargeMachinePortManage', 'listChargeMachinePort', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);

                    });
            },
            closeDeleteChargeMachineModel: function() {
                $('#stopChargeMachineModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);