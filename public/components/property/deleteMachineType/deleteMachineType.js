(function (vc, vm) {

    vc.extends({
        data: {
            deleteMachineTypeInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteMachineType', 'openDeleteMachineTypeModal', function (_params) {

                vc.component.deleteMachineTypeInfo = _params;
                $('#deleteMachineTypeModel').modal('show');

            });
        },
        methods: {
            deleteMachineType: function () {
                vc.component.deleteMachineTypeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'machineType.deleteMachineType',
                    JSON.stringify(vc.component.deleteMachineTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMachineTypeModel').modal('hide');
                            vc.emit('machineTypesTree', 'refreshTree', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteMachineTypeModel: function () {
                $('#deleteMachineTypeModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
