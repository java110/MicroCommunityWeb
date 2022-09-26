/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            parkingAreaTotalControlVideoInfo: {
                paId: '',
                machines: [],
            }
        },
        _initMethod: function () {

            let _paId = vc.getParam('paId');

            if (_paId) {
                $that.parkingAreaTotalControlVideoInfo.paId = _paId;
                $that._listMachines();
            }

        },
        _initEvent: function () {
            vc.on('parkingAreaTotalControlVideo', 'switch', function (param) {
                // if (param.hasOwnProperty('paId')) {
                //     $that.parkingAreaTotalControlVideoInfo.paId = param.paId;
                //     $that._listMachines();
                // }
            });

            vc.on('parkingAreaTotalControlVideo', 'notify', function (_data) {
                $that._showCarInoutMachineImgInfo(_data);
                $that._showCarInoutMachineInoutInfo(_data);

                let _machines = $that.parkingAreaTotalControlVideoInfo.machines;

                _machines.forEach(item => {
                    if (item.machineId == _data.extMachineId) {
                        vc.emit('parkingAreaTotalControlFee', 'notify', {
                            machine:item,
                            data:_data
                        });
                    }
                })

               
            });

        },
        methods: {
            _showCarInoutMachineImgInfo: function (_data) {
                if (_data.action != 'IN_OUT') {
                    return;
                }
                let _machines = $that.parkingAreaTotalControlVideoInfo.machines;

                _machines.forEach(item => {
                    if (item.machineId == _data.extMachineId) {
                        setTimeout(function () {
                            item.inOutImg = _data.img.replace('.jpg', '_plate.jpg');
                        }, 1500);
                    }
                })
            },
            _showCarInoutMachineInoutInfo:function(_data){
                if (_data.action != 'FEE_INFO') {
                    return;
                }
                _machines.forEach(item => {
                    if (item.machineId == _data.extMachineId) {
                        item.carNum = param.carNum;
                        item.inOutTime = param.inOutTime;
                        item.open = param.open;
                        item.openMsg = param.remark;
                    }
                })
            },
            _listMachines: function () {
                let param = {
                    params: {
                        paId: $that.parkingAreaTotalControlVideoInfo.paId,
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                //发送get请求
                vc.http.apiGet('/machine.listParkingAreaMachines',
                    param,
                    function (json, res) {
                        let _machineManageInfo = JSON.parse(json);
                        let _machines = _machineManageInfo.data;
                        _machines.forEach(item => {
                            item.carNum = '';
                            item.inOutTime = '';
                            item.open = '';
                            item.openMsg = '';
                        })
                        $that.parkingAreaTotalControlVideoInfo.machines = _machines;

                        // 初始化视频
                        $that.initMachineVedio();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            initMachineVedio: function () {

                let _machines = $that.parkingAreaTotalControlVideoInfo.machines;
                let wsUrl = "";
                setTimeout(function () {
                    _machines.forEach(item => {
                        $that._swatchVedio(item);
                    })
                }, 2000)


            },
            _swatchVedio: function (_machine) {
                //创建一个socket实例
                let wsUrl = "";

                wsUrl = _machine.machineIp;
                if (_machine.machineVersion.indexOf('300') > -1) {
                    wsUrl += "/ws.flv"
                } else {
                    wsUrl += "/ws"
                }
                wsUrl = wsUrl.replace(':8131', ':9080');
                let _protocol = window.location.protocol;
                // if (_protocol.startsWith('https')) {
                //     wsUrl =
                //         "wss://" + wsUrl;
                // } else {
                wsUrl =
                    "ws://" + wsUrl;
                // }
                let image = document.getElementById("receiver" + _machine.machineId);
                if (wsUrl.endsWith(".flv")) {
                    image = document.getElementById("receiverDiv" + _machine.machineId);
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
            _openDoor: function (_machine) {

                let _data = {
                    "machineCode": _machine.machineCode,
                    "stateName": "开门",
                    "state": "1500",
                    "url": "/machine/openDoor",
                    "userRole": "staff",
                    "communityId": vc.getCurrentCommunity().communityId
                };
                vc.http.apiPost('/machine/openDoor',
                    JSON.stringify(_data), {
                    emulateJSON: true
                },
                    function (json, res) {
                        let _data = JSON.parse(json);
                        if (_data.code != 0) {
                            vc.toast(_data.msg);
                        } else {
                            vc.toast('已请求设备');
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            _closeDoor: function (_machine) {
                let _data = {
                    "machineCode": _machine.machineCode,
                    "stateName": "关门",
                    "state": "1500",
                    "url": "/machine/closeDoor",
                    "userRole": "staff",
                    "communityId": vc.getCurrentCommunity().communityId
                };
                vc.http.apiPost('/machine/closeDoor',
                    JSON.stringify(_data), {
                    emulateJSON: true
                },
                    function (json, res) {
                        let _data = JSON.parse(json);
                        if (_data.code != 0) {
                            vc.toast(_data.msg);
                        } else {
                            vc.toast('已请求设备');
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            customCarIn: function (_machine, _type) {
                vc.emit('parkingAreaControlCustomCarInout', 'open', {
                    type: _type,
                    machineId: _machine.machineId,
                    boxId: _machine.locationObjId
                })
            },
        }
    });
})(window.vc);