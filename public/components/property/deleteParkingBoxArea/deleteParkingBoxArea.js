(function (vc, vm) {
    vc.extends({
        data: {
            deleteParkingBoxAreaInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteParkingBoxArea', 'openDeleteParkingBoxAreaModal', function (_params) {
                vc.component.deleteParkingBoxAreaInfo = _params;
                $('#deleteParkingBoxAreaModel').modal('show');
            });
        },
        methods: {
            deleteParkingBoxArea: function () {
                vc.component.deleteParkingBoxAreaInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'parkingBoxArea.deleteParkingBoxArea',
                    JSON.stringify(vc.component.deleteParkingBoxAreaInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteParkingBoxAreaModel').modal('hide');
                            vc.emit('parkingBoxAreaManage', 'listParkingBoxArea', {});
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
            closeDeleteParkingBoxAreaModel: function () {
                $('#deleteParkingBoxAreaModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
