(function(vc) {
    vc.extends({
        data: {
            chooseCameraInfo: {
                machines: [],
                _currentMachineName: '',
                viewMachines: [],
                machineIds: [],
                cameraCount: 4,
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('chooseCamera', 'openChooseCameraModel', function(_param) {
                $('#chooseCameraModel').modal('show');
                $that.chooseCameraInfo.viewMachines = _param.machines;
                $that.chooseCameraInfo.cameraCount = _param.cameraCount;
                $that._refreshchooseCameraInfo();
                vc.component._loadAllMachineInfo(1, 500, '');
            });
        },
        watch: { // 监视双向绑定的数据数组
            "chooseCameraInfo.machineIds": {
                deep: true,
                handler() { // 数据数组有变化将触发此函数
                    if ($that.chooseCameraInfo.machineIds.length > $that.chooseCameraInfo.cameraCount) {
                        $that.chooseCameraInfo.machineIds.pop();
                        return;
                    }
                    $that.freshViewMachine();
                }
            }
        },
        methods: {
            _loadAllMachineInfo: function(_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        machineTypeCd: '9998',
                        communityId: vc.getCurrentCommunity().communityId,
                        name: _name
                    }
                };

                //发送get请求
                vc.http.get('machineManage',
                    'list',
                    param,
                    function(json) {
                        var _machineInfo = JSON.parse(json);
                        vc.component.chooseCameraInfo.machines = _machineInfo.machines;
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            queryMachines: function() {
                vc.component._loadAllMachineInfo(1, 10, vc.component.chooseCameraInfo._currentMachineName);
            },
            _refreshchooseCameraInfo: function() {
                vc.component.chooseCameraInfo = {
                    machines: [],
                    _currentMachineName: '',
                    viewMachines: [],
                    machineIds: [],
                    cameraCount: 4,
                };
            },
            freshViewMachine: function() {
                $that.chooseCameraInfo.viewMachines = [];
                let _machineIds = $that.chooseCameraInfo.machineIds;
                let _machines = $that.chooseCameraInfo.machines;

                _machineIds.forEach(item => {
                    _machines.forEach(_machine => {
                        if (item == _machine.machineId) {
                            $that.chooseCameraInfo.viewMachines.push(_machine)
                        }
                    })
                });

                vc.emit('cameraControlVideo', 'notify', {
                    machines: $that.chooseCameraInfo.viewMachines
                })
            }
        }

    });
})(window.vc);