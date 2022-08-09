/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 1;
    vc.extends({
        data: {
            cameraControlVideoInfo: {
                paId: '',
                machines: [],
                allMachines: [],
                cameraCount: 4
            }
        },
        _initMethod: function() {
            let _cameraCount = vc.getParam('cameraCount');
            if (_cameraCount) {
                $that.cameraControlVideoInfo.cameraCount = _cameraCount;
            }
            $that._listMachines(1, 500);
            $that._initMachineVideo();
        },
        _initEvent: function() {
            vc.on('cameraControlVideo', 'notify', function(param) {
                $that.cameraControlVideoInfo.machines = param.machines;
                $that.applyViewCamera(_item);
            })
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listMachines(_currentPage, DEFAULT_ROWS);
            });
            vc.on('cameraControlInfo', 'page_event', function(_currentPage) {
                vc.component._listMachines(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMachines: function(_page, _rows) {
                let param = {
                        params: {
                            page: _page,
                            row: _rows,
                            machineTypeCd: '9998',
                            communityId: vc.getCurrentCommunity().communityId
                        }
                    }
                    //发送get请求
                vc.http.apiGet('/machine.listMachines',
                    param,
                    function(json, res) {
                        let _machineManageInfo = JSON.parse(json);
                        $that.cameraControlVideoInfo.allMachines = _machineManageInfo.machines;
                        $that.viewCameras();
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initMachineVideo: function(_machines) {

                setInterval(function() {
                    $that.heartbeatCamera();
                }, 1000 * 30)

            },
            _playVideo: function(_videoId, url) {
                $('#' + _videoId).show();
                let sdk = null; // Global handler to do cleanup when replaying.
                sdk = new SrsRtcPlayerAsync();
                $('#' + _videoId).prop('srcObject', sdk.stream);
                sdk.play(url).then(function(session) {}).catch(function(reason) {
                    sdk.close();
                    $('#' + _videoId).hide();
                    console.error(reason);
                });
            },

            viewCameras: function() {
                let _allMachines = $that.cameraControlVideoInfo.allMachines;

                if (!_allMachines || _allMachines.length < 1) {
                    return;
                }

                $that.cameraControlVideoInfo.machines = [];

                for (let _machineIndex = 0; _machineIndex < _allMachines.length; _machineIndex++) {
                    if (_machineIndex >= parseInt($that.cameraControlVideoInfo.cameraCount)) {
                        break;
                    }
                    let _item = _allMachines[_machineIndex];
                    $that.cameraControlVideoInfo.machines.push(_item);
                    $that.applyViewCamera(_item);
                }
            },
            _changeCameras: function() {
                vc.emit('chooseCamera', 'openChooseCameraModel', {
                    machines: $that.cameraControlVideoInfo.machines,
                    cameraCount: $that.cameraControlVideoInfo.cameraCount
                });
            },
            applyViewCamera: function(_machine) {
                let data = {
                    machineId: _machine.machineId,
                    communityId: vc.getCurrentCommunity().communityId,
                }
                vc.http.apiPost(
                    '/machine.playCamera',
                    JSON.stringify(data), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            $that._playVideo(_machine.machineId, _json.data.address);
                            _machine.callId = _json.data.callId
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            heartbeatCamera: function(_machine) {
                let _machines = $that.cameraControlVideoInfo.machines;
                if (!_machines || _machines.length < 1) {
                    return;
                }

                let _callIds = "";
                _machines.forEach(item => {
                    if (item.callId) {
                        _callIds += (item.callId + ",")
                    }
                });

                if (!_callIds) {
                    return;
                }
                let data = {
                    callIds: _callIds,
                    communityId: vc.getCurrentCommunity().communityId,
                    machineId: _machines[0].machineId
                }
                vc.http.apiPost(
                    '/machine.heartbeatCamera',
                    JSON.stringify(data), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == -3) { // 摄像头 未推流 重新播放推流
                            $that.viewCameras();
                        }
                    },
                    function(errInfo, error) {});
            },
            _changeCount: function(_count) {
                $that.cameraControlVideoInfo.cameraCount = _count;
                vc.jumpToPage('/video.html#/pages/property/videoControl?cameraCount=' + _count)
            }
        }
    });
})(window.vc);