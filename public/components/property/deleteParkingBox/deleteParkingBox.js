(function (vc, vm) {
    vc.extends({
        data: {
            deleteParkingBoxInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteParkingBox', 'openDeleteParkingBoxModal', function (_params) {
                vc.component.deleteParkingBoxInfo = _params;
                $('#deleteParkingBoxModel').modal('show');
            });
        },
        methods: {
            deleteParkingBox: function () {
                vc.component.deleteParkingBoxInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'parkingBox.deleteParkingBox',
                    JSON.stringify(vc.component.deleteParkingBoxInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteParkingBoxModel').modal('hide');
                            vc.emit('parkingBoxManage', 'listParkingBox', {});
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
            closeDeleteParkingBoxModel: function () {
                $('#deleteParkingBoxModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
