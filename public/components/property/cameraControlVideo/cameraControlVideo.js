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
            $that._listMachines(1, 500);
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
                vc.http.get('machineManage',
                    'list',
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
                $that._playVideo('rtc_media_player1', 'webrtc://117.159.177.191/live/34020000002000000010@34020000001320000010');
                $that._playVideo('rtc_media_player2', 'webrtc://112.124.21.207/live/34020000001320000002@34020000001320000010');
                $that._playVideo('rtc_media_player3', 'webrtc://112.124.21.207/live/34020000001320000001@34020000001320000010');
                $that._playVideo('rtc_media_player4', 'webrtc://112.124.21.207/live/34020000001320000002@34020000001320000010');
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



            },
            _changeCount: function(_count) {
                $that.cameraControlVideoInfo.cameraCount = _count;
            }
        }
    });
})(window.vc);