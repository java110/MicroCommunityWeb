(function (vc) {
    vc.extends({
        propTypes: {
            notifyLoadDataComponentName: vc.propTypes.string
        },
        data: {
            deleteParkingSpaceInfo: {}
        },
        _initEvent: function () {
            vc.on('deleteParkingSpace', 'openParkingSpaceModel', function (_parkingSpaceInfo) {
                vc.component.deleteParkingSpaceInfo = _parkingSpaceInfo;
                $('#deleteParkingSpaceModel').modal('show');
            });
        },
        methods: {
            closeDeleteParkingSpaceModel: function () {
                $('#deleteParkingSpaceModel').modal('hide');
            },
            deleteParkingSpace: function () {
                vc.component.deleteParkingSpaceInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.post(
                    'deleteParkingSpace',
                    'delete',
                    JSON.stringify(vc.component.deleteParkingSpaceInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        var _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteParkingSpaceModel').modal('hide');
                            vc.toast("删除成功")
                            vc.emit($props.notifyLoadDataComponentName, 'listParkingSpaceData', {});
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.component.deleteParkingSpacenfo.errorInfo = errInfo;
                    });
            }
        }
    });
})(window.vc);