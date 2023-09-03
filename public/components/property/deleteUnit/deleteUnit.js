(function (vc, vm) {
    vc.extends({
        data: {
            deleteUnitInfo: {
                _currentFloorId: '',
                _currentUnitId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteUnit', 'openUnitModel', function (_params) {
                vc.component.deleteUnitInfo._currentFloorId = _params.floorId;
                vc.component.deleteUnitInfo._currentUnitId = _params.unitId;
                $('#deleteUnitModel').modal('show');
            });
        },
        methods: {
            deleteUnit: function () {
                var param = {
                    floorId: vc.component.deleteUnitInfo._currentFloorId,
                    unitId: vc.component.deleteUnitInfo._currentUnitId,
                    communityId: vc.getCurrentCommunity().communityId
                }
                vc.http.apiPost(
                    '/unit.deleteUnit',
                    JSON.stringify(param),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteUnitModel').modal('hide');
                            vc.emit('unit', 'loadUnit', {
                                floorId: vc.component.deleteUnitInfo._currentFloorId
                            });
                            vc.emit('floorUnitTree', 'refreshTree', {
                                floorId: vc.component.deleteUnitInfo._currentFloorId
                            })
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
            closeDeleteUnitModel: function () {
                $('#deleteUnitModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);