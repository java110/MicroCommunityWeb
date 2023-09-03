(function (vc, vm) {
    vc.extends({
        data: {
            deleteMeterTypeInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteMeterType', 'openDeleteMeterTypeModal', function (_params) {
                vc.component.deleteMeterTypeInfo = _params;
                $('#deleteMeterTypeModel').modal('show');
            });
        },
        methods: {
            deleteMeterType: function () {
                vc.component.deleteMeterTypeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'meterType.deleteMeterType',
                    JSON.stringify(vc.component.deleteMeterTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMeterTypeModel').modal('hide');
                            vc.emit('meterTypeManage', 'listMeterType', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);
                    });
            },
            closeDeleteMeterTypeModel: function () {
                $('#deleteMeterTypeModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
