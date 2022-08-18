(function (vc, vm) {
    vc.extends({
        data: {
            deleteParkingAreaInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteParkingArea', 'openDeleteParkingAreaModal', function (_params) {
                vc.component.deleteParkingAreaInfo = _params;
                $('#deleteParkingAreaModel').modal('show');
            });
        },
        methods: {
            deleteParkingArea: function () {
                vc.component.deleteParkingAreaInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/parkingArea.deleteParkingArea',
                    JSON.stringify(vc.component.deleteParkingAreaInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteParkingAreaModel').modal('hide');
                            vc.emit('parkingAreaManage', 'listParkingArea', {});
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
            closeDeleteParkingAreaModel: function () {
                $('#deleteParkingAreaModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);