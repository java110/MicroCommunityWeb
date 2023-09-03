(function (vc, vm) {
    vc.extends({
        data: {
            deleteMeterWaterInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteMeterWater', 'openDeleteMeterWaterModal', function (_params) {
                vc.component.deleteMeterWaterInfo = _params;
                $('#deleteMeterWaterModel').modal('show');
            });
        },
        methods: {
            deleteMeterWater: function () {
                vc.component.deleteMeterWaterInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'meterWater.deleteMeterWater',
                    JSON.stringify(vc.component.deleteMeterWaterInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMeterWaterModel').modal('hide');
                            vc.emit('meterWaterManage', 'listMeterWater', {});
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
            closeDeleteMeterWaterModel: function () {
                $('#deleteMeterWaterModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
