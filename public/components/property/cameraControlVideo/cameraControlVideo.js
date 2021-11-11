/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 1;
    vc.extends({
        data: {
            cameraControlVideoInfo: {
                paId: '',
                inMachineId: '',
                outMachineId: '',
                machines: [],
                showType:'606',
                outMachines: []

            }
        },
        _initMethod: function () {
            $that._initMachineVideo();
        },
        _initEvent: function () {
            vc.on('cameraControlVideo', 'notify', function (param) {
            })
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMachines(_currentPage, DEFAULT_ROWS);
            });
            vc.on('cameraControlInfo', 'page_event', function (_currentPage) {
                vc.component._listMachines(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMachines: function (_page, _rows) {
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
                    function (json, res) {
                        let _machineManageInfo = JSON.parse(json);
                        $that.cameraControlVideoInfo.machines = _machineManageInfo.machines;
                        let _machine = $that.cameraControlVideoInfo.machines[0];
                        vc.emit('pagination', 'init', {
                            total: _machineManageInfo.records,
                            currentPage: _page
                        });
                        vc.emit('cameraControlInfo', 'notify', {
                            _machine
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initMachineVideo:function(_machines){
                $that._playVideo('rtc_media_player1','webrtc://112.124.21.207/live/34020000002000000010@34020000001320000010');
                $that._playVideo('rtc_media_player2','webrtc://112.124.21.207/live/34020000001320000002@34020000001320000010');
                $that._playVideo('rtc_media_player3','webrtc://112.124.21.207/live/34020000001320000001@34020000001320000010');
                $that._playVideo('rtc_media_player4','webrtc://112.124.21.207/live/34020000001320000002@34020000001320000010');
            },
            _playVideo:function(_videoId,url){
                $('#'+_videoId).show();
                let sdk = null; // Global handler to do cleanup when replaying.
                sdk = new SrsRtcPlayerAsync();
                $('#'+_videoId).prop('srcObject', sdk.stream);
                sdk.play(url).then(function(session){
                }).catch(function (reason) {
                    sdk.close();
                    $('#'+_videoId).hide();
                    console.error(reason);
                });
            }
        }
    });
})(window.vc);