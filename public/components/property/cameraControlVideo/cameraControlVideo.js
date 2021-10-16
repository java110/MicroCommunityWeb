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
            $that._initShowType($that.cameraControlVideoInfo.showType);

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
            _swatchVedio: function () {
                //创建一个socket实例
                let wsUrl = "";
                let _enterMachineId = $that.cameraControlVideoInfo.inMachineId;
                vc.emit('parkingAreaControl', 'notify', {
                    inMachineId: _enterMachineId
                });
                $that.cameraControlVideoInfo.inMachines.forEach((item) => {
                    if (item.machineId == _enterMachineId) {
                        wsUrl = item.machineIp;
                        if (item.machineVersion.indexOf('300') > -1) {
                            wsUrl += "/ws.flv"
                        } else {
                            wsUrl += "/ws"
                        }
                    }
                });

                wsUrl = wsUrl.replace(':8131', ':9080');
                let _protocol = window.location.protocol;
                if (_protocol.startsWith('https')) {
                    wsUrl =
                        "wss://" + wsUrl;
                } else {
                    wsUrl =
                        "ws://" + wsUrl;
                }
                let image = document.getElementById("receiver1");
                if (wsUrl.endsWith(".flv")) {
                    image = document.getElementById("receiver1Div");
                    let jessibuca = new Jessibuca({
                        container: image,
                        videoBuffer: 0.2,
                        isResize: false,
                    });
                    jessibuca.onLoad = function () {
                        this.play(wsUrl);
                    };
                    return;
                }
                let receiver_socket = new WebSocket(wsUrl);
                // 监听消息
                receiver_socket.onmessage = function (data) {
                    let reader = new FileReader();
                    reader.onload = function (evt) {
                        if (evt.target.readyState == FileReader.DONE) {
                            let url = evt.target.result;
                            image.src = "data:image/png;" + url;
                        }
                    };
                    reader.readAsDataURL(data.data);
                };
            },
            openFullscreen: function (e) {
                var parents = $(e.target).parent().parent();
     
                // $('#' + parents[0].id).height(650);
                // $('#' + parents[0].id).width(400);
                // $('#'+ parents[0].id).toggle(function () {
                //     $('#' + parents[0].id).height($('#' + parents[0].id).height() + 600);
                // }, function () {
                //     $('#' + parents[0].id).height($('#' + parents[0].id).height() - 100);
                // })
            },
            _openCameraControlInfoVideo: function (_machine) {
                vc.emit('cameraControlInfo', 'notify', {
                    _machine
                });
            },
            _initShowType: function(_typeCd){
                if(_typeCd == '606'){
                    DEFAULT_ROWS=1;
                   $("div[name='showName']").attr('class','col-md-12');
                }
                if(_typeCd == '607'){
                    DEFAULT_ROWS=4;
                   $("div[name='showName']").attr('class','col-md-6');
                }
                if(_typeCd == '608'){
                    DEFAULT_ROWS=9;
                   $("div[name='showName']").attr('class','col-md-4');
                }
                if(_typeCd == '609'){
                    DEFAULT_ROWS=16;
                   $("div[name='showName']").attr('class','col-md-3');
                }
                $that._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);
                
            }

        }
    });
})(window.vc);