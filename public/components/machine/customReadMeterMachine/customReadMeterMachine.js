(function(vc, vm) {

    vc.extends({
        data: {
            customReadMeterMachineInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('customReadMeterMachine', 'openCustomReadMeterMachineModal', function(_params) {
                $('#customReadMeterMachineModel').modal('show');
            });
        },
        methods: {
            customReadMeterMachine: function() {
                vc.component.customReadMeterMachineInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/meterMachine.customMeterMachineRead',
                    JSON.stringify(vc.component.customReadMeterMachineInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('抄表请求已发送，表反馈速度可能有延时，请您刷新查看！');
                            $('#customReadMeterMachineModel').modal('hide');
                            vc.emit('meterMachineManage', 'listMeterMachine', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteMeterMachineModel: function() {
                $('#customReadMeterMachineModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);