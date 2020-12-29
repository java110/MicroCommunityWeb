(function (vc, vm) {

    vc.extends({
        data: {
            machineStateInfo: {
                machineCode: '',
                stateName: '',
                state: '',
                url: '',
                userRole:'staff'

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('machineState', 'openMachineStateModal', function (_params) {
                vc.copyObject(_params, vc.component.machineStateInfo);
                $('#machineStateModel').modal('show');

            });
        },
        methods: {
            _changeMachineState: function () {
                vc.component.machineStateInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost($that.machineStateInfo.url,
                    JSON.stringify(vc.component.machineStateInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        $('#machineStateModel').modal('hide');
                        vc.emit('machineManage', 'listMachine', {});
                        if (res.status != 200) {
                            vc.toast(json);
                            //关闭model
                            return;
                        }
                        let _data = JSON.parse(json);
                        vc.toast(_data.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);

                    });
            },
            _closeMachineStateModel: function () {
                $('#machineStateModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
