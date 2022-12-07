/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 1;
    vc.extends({
        data: {
            viewCameraVideoInfo: {
                machineId: '',
                machine: {},
                timer: {},
                sdk: {}
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('viewCameraVideo', 'openCameraVideoModal', function (_machine) {
                clearInterval($that.viewCameraVideoInfo.timer);
                $that.viewCameraVideoInfo.machineId = _machine.machineId;
                $('#viewCameraVideoModel').modal('show');
                $that._listViewCameraVideoMachines();
                $that._initMachineVideo();
            });
        },
        methods: {
            _listViewCameraVideoMachines: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        machineId: $that.viewCameraVideoInfo.machineId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                //发送get请求
                vc.http.apiGet('/machine.listMachines',
                    param,
                    function (json, res) {
                        let _machineManageInfo = JSON.parse(json);
                        $that.viewCameraVideoInfo.machine = _machineManageInfo.machines[0];
                        $that.applyViewCamera($that.viewCameraVideoInfo.machine);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initMachineVideo: function () {
                timer = setInterval(function () {
                    $that.heartbeatCamera();
                }, 1000 * 30)
            },
            _playVideo: function (_videoId, url) {
                $('#viewCameraVideo').show();
                //let sdk = null; // Global handler to do cleanup when replaying.
                $that.viewCameraVideoInfo.sdk = new SrsRtcPlayerAsync();
                $('#viewCameraVideo').prop('srcObject', $that.viewCameraVideoInfo.sdk.stream);
                $that.viewCameraVideoInfo.sdk.play(url).then(function (session) {
                }).catch(function (reason) {
                    $that.viewCameraVideoInfo.sdk.close();
                    $('#viewCameraVideo').hide();
                    console.error(reason);
                });
            },
            applyViewCamera: function (_machine) {
                let data = {
                    machineId: _machine.machineId,
                    communityId: vc.getCurrentCommunity().communityId,
                }
                vc.http.apiPost(
                    '/machine.playCamera',
                    JSON.stringify(data), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            $that._playVideo(_machine.machineId, _json.data.address);
                            _machine.callId = _json.data.callId
                            vc.toast("操作成功");
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
            heartbeatCamera: function () {
                let _machine = $that.viewCameraVideoInfo.machine;
                if (!_machine) {
                    return;
                }
                let _callIds = _machine.callId;
                if (!_callIds) {
                    return;
                }
                let data = {
                    callIds: _callIds,
                    communityId: vc.getCurrentCommunity().communityId,
                    machineId: _machine.machineId
                }
                vc.http.apiPost(
                    '/machine.heartbeatCamera',
                    JSON.stringify(data), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == -3) { // 摄像头 未推流 重新播放推流
                            $that.viewCameras();
                        }
                    },
                    function (errInfo, error) {
                    }
                );
            },
            _closeViewCameraVideo: function () {
                clearInterval($that.viewCameraVideoInfo.timer);
                /*if ($that.viewCameraVideoInfo.sdk) {
                    $that.viewCameraVideoInfo.sdk.close();
                }*/
                $('#viewCameraVideoModel').modal('hide');
            }
        }
    });
})(window.vc);