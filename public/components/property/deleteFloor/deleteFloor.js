(function (vc) {
    vc.extends({
        data: {
            deleteFloorInfo: {}
        },
        _initEvent: function () {
            vc.on('deleteFloor', 'openFloorModel', function (_floorInfo) {
                vc.component.deleteFloorInfo = _floorInfo;
                $('#deleteFloorModel').modal('show');
            });
        },
        methods: {
            closeDeleteFloorModel: function () {
                $('#deleteFloorModel').modal('hide');
            },
            deleteFloor: function () {
                vc.component.deleteFloorInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/floor.deleteFloor',
                    JSON.stringify(vc.component.deleteFloorInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteFloorModel').modal('hide');
                            vc.emit('listFloor', 'listFloorData', {});
                            vc.emit('floorUnitTree', 'refreshTree', {});
                            vc.toast("删除成功")
                            return;
                        } else {
                            vc.toast(_json.msg)
                        }
                        vc.component.deleteFloornfo.errorInfo = json;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.component.deleteFloornfo.errorInfo = errInfo;
                    });
            }
        }
    });
})(window.vc);